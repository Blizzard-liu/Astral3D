/**
 * @author ErSan
 * @email  mlt131220@163.com
 * @date   2025/4/10 0:29
 * @description html面板
 */
import {JSONMeta} from "three";
import {CSS3DObject, CSS3DSprite} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { readAstralZipArrayBuffer, readAstralZipText, waitAstralZipConstructor } from "@/utils/wasm/zip.ts";

interface IHtmlPanelOption {
    // 类型是否是精灵
    isSprite: boolean;
    // 代码内容
    codes: Array<{ name: string, content: string | ArrayBuffer, isIndex?: boolean }>;
    // 对应的代码是单html文件还是多文件
    isSingleHtml: boolean;
}

/**
 * html面板转换器
 * @description 如果是单html文件，沙箱环境使用with + proxy；如果是zip包，沙箱环境使用iframe
 */
class HtmlPanelConverter {
    private static instance: HtmlPanelConverter | null = null;

    private config = {
        // 是否允许执行脚本
        allowScripts: true,
        // 文件大小限制
        maxFileSize: 1024 * 1024 * 10, // 10M
        // 标签黑名单
        notAllowedTags: ['iframe'],
    };

    private readonly sandbox: any;

    private constructor() {
        // 创建安全沙箱环境
        this.sandbox = this._createSandbox();

        // 配套CSS样式（需添加到页面）
        const style = document.createElement('style');
        style.textContent = `
.css3d-imported-content {
  pointer-events: none !important;
  // overflow: hidden;
}

.css3d-imported-content [style] {
  will-change: transform, opacity;
}
`;
        document.head.appendChild(style);
    }

    // 获取单例实例
    public static getInstance(): HtmlPanelConverter {
        if (!HtmlPanelConverter.instance) {
            HtmlPanelConverter.instance = new HtmlPanelConverter();
        }
        return HtmlPanelConverter.instance;
    }

    // 创建安全沙箱
    private _createSandbox() {
        // 重写全局的 fetch 方法
        const originalFetch = window.fetch;
        // 重写 XMLHttpRequest 的 open 方法
        const originalXMLHttpRequest = window.XMLHttpRequest;
        // 重写Websocket
        const originalWebSocket = window.WebSocket;

        // url检查
        const checkUrl = (url: string) => {
            if(url.indexOf(import.meta.env.VITE_GLOB_ORIGIN) > -1) return false;

            if(url.indexOf('http://') === -1 && url.indexOf('https://') === -1 && url.indexOf('ws://') === -1 && url.indexOf('wss://') === -1) return false;

            return true;
        }

        const sandbox = {
            fetch: async (url: string, options: any) => {
                if (checkUrl(url)) {
                    throw new Error('请求被禁止：无法向当前服务器发起请求');
                }

                // 如果不是当前服务器的请求，则调用原始的 fetch 方法
                return originalFetch(url, options);
            },
            XMLHttpRequest: () => {
                const xhr = new originalXMLHttpRequest();

                // 拦截 open 方法
                const originalOpen = xhr.open;
                // @ts-ignore
                xhr.open = function (method, url, async, user, password) {
                    if (checkUrl(url as string)) {
                        throw new Error('请求被禁止：无法向当前服务器发起请求');
                    }

                    // 如果不是当前服务器的请求，则调用原始的 open 方法
                    return originalOpen.call(xhr, method, url, async, user, password);
                };

                return xhr;
            },
            WebSocket: (url:string) => {
                if (checkUrl(url)) {
                    throw new Error('请求被禁止：无法连接到当前服务器的 WebSocket');
                }
                return new originalWebSocket(url);
            },
            // 其他要修改的的全局对象...
        };

        return new Proxy(sandbox, {
            // 拦截所有属性，防止到 Proxy 对象以外的作用域链查找。
            has: () => true,
            get: (target, prop) => {
                // 加固，防止逃逸
                if (prop === Symbol.unscopables) {
                    return undefined;
                }

                if (Reflect.has(target, prop)) {
                    return Reflect.get(target, prop);
                }
                // 暂时允许从window直接获取属性，后续考虑限制。因为不限制很危险，比如可以获取到window.location、window.history等敏感信息。
                // else{
                //     return undefined;
                // }

                // 禁止访问的属性
                if(['location', 'history', 'top', 'parent', 'frameElement'].includes(typeof prop === "string" ? prop : '')) return undefined;

                //如果找不到，就直接从window对象上取值
                const rawValue = Reflect.get(window, prop);

                //如果兜底的是一个函数，需要绑定window对象，比如window.addEventListener
                if (typeof rawValue === 'function') {
                    const valueStr = rawValue.toString();
                    if (!/^function\s+[A-Z]/.test(valueStr) && !/^class\s+/.test(valueStr)) {
                        return rawValue.bind(window); // 所有 window 上非构造函数调用时候的 this 绑定window对象
                    }
                }

                return rawValue;
            }
        });
    }

    // 主加载方法
    loadAsync(option: { url: string, isSprite: boolean, fileName?: string }): Promise<HtmlPanel | HtmlSprite> {
        return new Promise(async (resolve, reject) => {
            if (!option.url) {
                reject(new Error('请输入url参数'));
                return;
            }

            const htmlPanelOption: IHtmlPanelOption = {
                isSprite: option.isSprite,
                isSingleHtml: true,
                codes: []
            }

            const response = await fetch(option.url);
            try{
                this._validateResponse(response);
            }catch (e){
                reject(e);
                return;
            }

            // 判断是zip包还是html文件
            let suffix = option.fileName?.split('.').pop() || option.url.split('.').pop();

            if (suffix && ['zip'].includes(suffix)) {
                try {
                    const AstralZip = await waitAstralZipConstructor();
                    const zipContent = await AstralZip.loadAsync(await response.arrayBuffer());

                    try {
                        // 强制检查根目录下的index.html
                        const mainHtmlFile = zipContent.file('index.html');
                        if (!mainHtmlFile) {
                            reject(new Error('The .zip file root directory must contain index.html'));
                            return;
                        }

                        // AstralZip 返回统一的文件元信息列表，避免依赖第三方 ZIP 库的私有 files 字典结构。
                        for (const fileMeta of zipContent.files()) {
                            const relativePath = fileMeta.name;

                            // 判断是否为文件，兼容显式目录元信息与斜杠结尾目录路径。
                            if (fileMeta.dir || relativePath.endsWith('/')) continue;

                            const _isEdit = this._isEditable(relativePath);

                            // 文本资源保持字符串形态，图片/二进制资源保持 ArrayBuffer，避免改变 CSS3D 面板解析行为。
                            const content = _isEdit
                                ? await readAstralZipText(zipContent, relativePath)
                                : await readAstralZipArrayBuffer(zipContent, relativePath);
                            // 存储到目标数组
                            htmlPanelOption.codes.push({
                                name: relativePath,
                                content: content,
                                isIndex: relativePath === 'index.html'
                            });
                        }
                    } finally {
                        zipContent.dispose();
                    }
                } catch (error) {
                    reject(error);
                    return;
                }

                htmlPanelOption.isSingleHtml = false;
            } else {
                if (!option.fileName) {
                    // 解析URL以获取文件名
                    // const _url = new URL(option.url, document.baseURI);
                    const _url = new URL(option.url, import.meta.env.VITE_GLOB_ORIGIN);

                    option.fileName = _url.pathname.split('/').pop() || 'index.html';
                }

                htmlPanelOption.codes.push({
                    name: option.fileName,
                    content: await response.text(),
                    isIndex: true
                });

                htmlPanelOption.isSingleHtml = true;
            }

            try{
                resolve(this.parseToCSS3D(htmlPanelOption));
            }catch (e){
                reject(e);
            }
        })
    }

    // 安全验证方法
    private _validateResponse(response: Response) {
        if (!response.ok) throw new Error('加载失败');

        if (Number(response.headers.get('content-length')) > this.config.maxFileSize) {
            throw new Error('文件大小超出限制');
        }
    }

    // 解析HTML生成CSS3D对象
    parseToCSS3D(options: IHtmlPanelOption) {
        if (options.codes.length === 0) throw new Error('解析内容不能为空');

        // 解析文档
        let container: HTMLDivElement | HTMLIFrameElement;
        if (options.isSingleHtml) {
            // 创建容器
            container = document.createElement('div');
            container.className = 'css3d-imported-content';

            const htmlDoc = this._parseHtml(options.codes[0].content as string);

            // 克隆并处理内容
            const content = this._processContent(htmlDoc);

            // 仅添加content(body)的子节点
            while (content.firstChild) {
                container.appendChild(content.firstChild);
            }
        } else {
            // TODO 解析zip,但是现在只处理了单文件HTML，后续加强支持解析多文件HTML
            // 创建容器
            container = document.createElement('div');
            container.className = 'css3d-imported-content';

            // 创建虚拟文件系统映射表
            const filesMap = new Map<string, string>();
            options.codes.forEach(code => {
                const mimeType = this._getMimeType(code.name);
                const blob = new Blob([code.content], {type: mimeType});
                const blobURL = URL.createObjectURL(blob);
                filesMap.set(code.name, blobURL);
            });

            // 获取主HTML内容
            const mainHtmlCode = options.codes.find(code => code.isIndex);
            if (!mainHtmlCode) throw new Error('主文件index.html不存在');

            // 深度克隆文档对象以便修改
            const htmlDoc = this._parseHtml(mainHtmlCode.content as string);
            const basePath = mainHtmlCode.name.split('/').slice(0, -1).join('/') || '';
            this._replaceResourceUrls(htmlDoc, filesMap, basePath);

            const iframe = document.createElement('iframe');
            iframe.style.border = 'none';
            iframe.width = 192 * 5 + '';
            iframe.height = 108 * 5 + '';
            // @ts-ignore
            (<any>iframe).sandbox = 'allow-same-origin allow-scripts';
            iframe.srcdoc = htmlDoc.documentElement.outerHTML;
            container.appendChild(iframe);
            document.body.appendChild(container);

            // 创建iframe并注入所有资源
            const iframeDoc = iframe.contentDocument!;

            // 添加基础路径保证相对路径解析
            const baseTag = document.createElement('base');
            baseTag.href = URL.createObjectURL(new Blob([], {type: 'text/html'}));
            iframeDoc.head.prepend(baseTag);

            // 清理blob URLs
            iframe.addEventListener('load', () => {
                filesMap.forEach(url => URL.revokeObjectURL(url));
                // document.body.removeChild(container);
                // container.remove();
            });
        }

        if (!container) throw new Error('解析失败');

        if (options.isSprite) {
            return new HtmlSprite(container, options);
        } else {
            return new HtmlPanel(container, options);
        }
    }

    // 使用DOMParser解析HTML结构
    private _parseHtml(content: string) {
        const parser = new DOMParser();
        return parser.parseFromString(content, "text/html");
    }

    // 处理文档内容
    private _processContent(htmlDoc: Document) {
        const container = htmlDoc.documentElement.cloneNode(true) as HTMLElement;

        // 清理危险元素
        this._sanitizeContent(container);

        // 处理脚本
        if (this.config.allowScripts) {
            this._processScripts(container);
        }

        return container;
    }

    // 清理危险内容
    private _sanitizeContent(content: HTMLElement) {
        // 删除不允许的标签
        content.querySelectorAll('*').forEach(node => {
            if (this.config.notAllowedTags.includes(node.tagName.toLowerCase())) {
                node.remove();
            }
        });

        // 删除危险属性
        const dangerousAttrs = ['onload', 'onerror', 'onclick'];
        content.querySelectorAll('*').forEach(node => {
            dangerousAttrs.forEach(attr => node.removeAttribute(attr));
        });
    }

    // 处理脚本内容
    private async _processScripts(content: HTMLElement) {
        const scripts = content.querySelectorAll('script');

        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            const newScript = document.createElement('script');

            let execute: Function | undefined;

            // 执行脚本
            const executeScript = (scriptContent:string) => {
                try {
                    const code = `with(sandbox){${scriptContent}}`;
                    newScript.textContent = code;
                    execute = new Function('sandbox', code);
                } catch (e) {
                    console.warn('脚本执行失败:', e);
                }

                // script.replaceWith(newScript);
                execute && execute(this.sandbox);
            }

            // 检查是否存在src属性
            const src = script.getAttribute('src');
            if (src) {
                // 处理外部脚本
                try {
                    const res = await fetch(src);
                    if (!res.ok) {
                        console.error(`加载外部脚本失败: ${src}`);
                        continue; // 跳过当前脚本
                    }
                    executeScript(await res.text());
                } catch (e) {
                    console.error(`加载外部脚本异常: ${src}`, e);
                }
            }else{
                executeScript(script.textContent || '');
            }
        }
    }

    // 获取文件类型
    private _getMimeType(filename: string): string {
        const ext = filename.split('.').pop()?.toLowerCase() || '';
        switch (ext) {
            case 'html':
                return 'text/html';
            case 'css':
                return 'text/css';
            case 'js':
                return 'application/javascript';
            case 'json':
                return 'application/json';
            case 'png':
                return 'image/png';
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'gif':
                return 'image/gif';
            case 'svg':
                return 'image/svg+xml';
            case 'zip':
                return 'application/zip';
            default:
                return 'text/plain';
        }
    }

    // 通过filePath判断文件内容是否可编辑（html、css、js、json、svg）
    _isEditable(filePath: string): boolean {
        const ext = filePath.split('.').pop()?.toLowerCase() || '';
        return ['html', 'css', 'js', 'json','svg'].includes(ext);
    }

    // 替换资源URL
    private _replaceResourceUrls(doc: Document, filesMap: Map<string, string>, basePath: string) {
        const attrMap = {
            'script': 'src',
            'link': 'href',
            'img': 'src',
            'audio': 'src',
            'video': 'src',
            'source': 'src',
            'embed': 'src',
            'object': 'data'
        };

        Object.entries(attrMap).forEach(([tag, attr]) => {
            doc.querySelectorAll(`${tag}[${attr}]`).forEach(el => {
                const originPath = el.getAttribute(attr);
                if (!originPath) return;

                // 路径标准化处理
                const resolvedPath = new URL(originPath, `${import.meta.env.VITE_GLOB_ORIGIN}/${basePath}/`).pathname.slice(1);

                if (filesMap.has(resolvedPath)) {
                    el.setAttribute(attr, filesMap.get(resolvedPath)!);
                }
            });
        });

        // 上面的代码中为了解析路径使用了固定域名，正常而已解析结果不会受此影响，如果结果不对，可以改用下面的代码
        // 使用虚拟路径协议代替真实域名
        // const virtualProtocol = 'virtual-resource:';
        // Object.entries(attrMap).forEach(([tag, attr]) => {
        //     doc.querySelectorAll(`${tag}[${attr}]`).forEach(el => {
        //         const originPath = el.getAttribute(attr);
        //         if (!originPath) return;
        //
        //         // 构造无域名的标准化路径
        //         const resolved = new URL(originPath, `${virtualProtocol}//${basePath}/`);
        //         const resolvedPath = resolved.href
        //             .replace(`${virtualProtocol}//`, '')  // 移除协议头
        //             .replace(/(\/\/+)/g, '/')             // 处理多余斜杠
        //             .replace(/^\/+/, '');                 // 移除开头的斜杠
        //
        //         if (filesMap.has(resolvedPath)) {
        //             el.setAttribute(attr, filesMap.get(resolvedPath)!);
        //         }
        //     });
        // });
    }
}

class HtmlPanel extends CSS3DObject {
    type = 'HtmlPanel';
    isHtmlPanel = true;
    options: IHtmlPanelOption;

    constructor(element: HTMLElement, options: IHtmlPanelOption) {
        super(element);

        this.options = options;
    }

    /**
     * 获取json配置
     */
    toJSON(meta?: JSONMeta) {
        const superJSON = super.toJSON(meta).object;

        return {
            metadata: {
                version: 4.6,
                type: 'Object',
                generator: 'HtmlPanel.toJSON'
            },
            object: {
                ...superJSON,
                type: this.type,
                options: this.options
            },
        } as any;
    }

    /**
     * 从json配置解析
     */
    static fromJSON(data: any) {
        return HtmlPanelConverter.getInstance().parseToCSS3D(data.options);
    }
}

class HtmlSprite extends CSS3DSprite {
    type = 'HtmlSprite';
    isHtmlSprite = true;
    options: IHtmlPanelOption;

    constructor(element: HTMLElement, options: IHtmlPanelOption) {
        super(element);

        this.options = options;
    }

    /**
     * 获取json配置
     */
    toJSON(meta?: JSONMeta) {
        const superJSON = super.toJSON(meta).object;

        return {
            metadata: {
                version: 4.6,
                type: 'Object',
                generator: 'HtmlSprite.toJSON'
            },
            object: {
                ...superJSON,
                type: this.type,
                options: this.options
            },
        } as any;
    }

    /**
     * 从json配置解析
     */
    static fromJSON(data: any) {
        return HtmlPanelConverter.getInstance().parseToCSS3D(data.options);
    }
}

export {HtmlPanelConverter, HtmlPanel, HtmlSprite};

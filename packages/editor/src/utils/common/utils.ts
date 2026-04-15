import type { TreeOption } from 'naive-ui';
import {BASE64_TYPES} from "@astral3d/engine";
import {t} from "@/language";

// 替换字符
export function escapeHTML(html:string) {
    if (typeof html !== "string") return html;

    return html
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * naive UI树结构寻找对应节点位置及所处父节点
 * @param node 目标节点
 * @param nodes 树数据
 */
export function findSiblingsAndIndex(node: TreeOption, nodes?: TreeOption[]): [TreeOption[], number] | [null, null] {
    if (!nodes) return [null, null];
    for (let i = 0; i < nodes.length; ++i) {
        const siblingNode = nodes[i];
        if (siblingNode.key === node.key) return [nodes, i];

        const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children)
        if (siblings && index !== null) return [siblings, index];
    }
    return [null, null];
}

// base64 转 File
export function base64ToFile(dataurl, filename) {
    let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.${BASE64_TYPES[arr[0]]}`, {type: mime});
}


/**
 * 求次幂
 */
export function pow1024(num) {
    return Math.pow(1024, num)
}

/**
 * 动态添加script
 * @param src
 * @param async
 */
export function loadScript(src:string,async:boolean = true){
    return new Promise((resolve,reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = async;

        script.onload = () => {
            resolve("");
        };

        script.onerror = () => {
            reject(`${src} 加载失败!`);
        };

        document.head.appendChild(script);
    })
}

/**
 * 复制到剪切板
 * @param text
 */
export function copyToClipboard(text: string) {
    return new Promise((resolve, reject) => {
        // 检查浏览器是否支持 Clipboard API
        if (!navigator.clipboard) {
            reject(t("prompt['Your browser does not support the Clipboard API, please use another browser']"));
            return;
        }

        // 使用 Clipboard API 复制文本
        navigator.clipboard.writeText(text).then(() => {
            resolve(t("prompt['Successfully copied to clipboard']"));
        }).catch(err => {
            resolve(`${t("prompt['Failed to copy to clipboard']")}: ${err}`);
        });
    })
}

/**
 * 获取rem的px值
 */
export function remToPxNumber(rem: number): number {
    const f = parseFloat(document.documentElement.style.fontSize);
    return f * rem;
}

/**
 * 动态注入脚本，并监听执行完毕事件
 * @param {string} src
 */
export function injectJS(src) {
    return new Promise(resolve => {
        // Warn：script.src !== script.getAttribute('src')
        const loaded = Array.from(document.scripts).some(it => it.getAttribute('src') === src);
        if (loaded) {
            resolve(src);
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        document.head.insertBefore(script, document.head.firstElementChild);
        script.addEventListener('load', () => {
            resolve(src);
        });
    })
}

/**
 * 在树形结构中查找指定 key 的节点（深度优先搜索）
 */
export function findTreeNode(tree:TreeOption[], targetKey:string | number):TreeOption | null {
    // 检查树数据是否为数组
    if (!Array.isArray(tree)) return null;

    for (const node of tree) {
        // 检查当前节点是否匹配
        if (node.key === targetKey) {
            return node;
        }

        // 递归搜索子节点
        if (node.children && node.children.length > 0) {
            const result = findTreeNode(node.children, targetKey);
            if (result) return result;
        }
    }

    return null;
}

/**
 * 使用深度优先遍历（DFS）递归算法，为没有子节点的节点添加 isLeaf: true 属性
 */
export function markLeafNodes(tree:TreeOption[]) {
    if (!tree || !Array.isArray(tree)) return;

    for (const node of tree) {
        // 如果有children数组且不为空
        if (node.children && node.children.length > 0) {
            // 递归处理子节点
            markLeafNodes(node.children);
        }
        // 如果children不存在，或者存在但为空数组
        else {
            // 设置 isLeaf 属性（不覆盖已存在的值）
            if (!node.hasOwnProperty('isLeaf')) {
                node.isLeaf = true;
            }
        }
    }
}
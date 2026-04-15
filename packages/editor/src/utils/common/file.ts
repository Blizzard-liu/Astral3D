import {pow1024} from "./utils";

/**
 * 通过Fetch API下载文件/图片（支持跨域/Blob处理）
 * @param {string} url 文件地址
 * @param {string} filename 保存的文件名
 */
export async function downloadWithFetch(url:string, filename:string = "") {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('The network is responding abnormally');

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        if(!filename){
            filename = url.substring(url.lastIndexOf("/") + 1);
        }

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // 清理内存
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(link);
        }, 100);
    } catch (error) {
        console.error('下载失败:', error);
    }
}

/**
 * 文件大小 字节转换单位
 * @param {number} size
 * @returns {string|*}
 */
export const filterSize = (size:number): string | any => {
    if (!size) return '0B';
    if (size < pow1024(1)) return size + ' B';
    if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + ' KB';
    if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + ' MB';
    if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + ' GB';
    return (size / pow1024(4)).toFixed(2) + ' TB'
}


export const getServiceStaticFile = (url:string):string => {
    if(!url) return "";

    if(url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("http:") || url.startsWith("https:") || url.startsWith('/file/static')) return url;

    return `/file/static` + (url[0] === '/' ? '' : '/') + url;
}

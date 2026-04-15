/**
 * 下载blob二进制对象
 * @param blob
 * @param filename
 */
export function downloadBlob(blob, filename) {
    const link = document.createElement('a');

    if (link.href) {
        URL.revokeObjectURL(link.href);
    }

    link.href = URL.createObjectURL(blob);
    link.download = filename || 'data.json';
    link.dispatchEvent(new MouseEvent('click'));
}

/**
 * 下载ArrayBuffer对象
 * @param buffer
 * @param filename
 */
export function saveArrayBuffer(buffer, filename) {
    downloadBlob(new Blob([buffer], {type: 'application/octet-stream'}), filename);
}

/**
 * 下载text文档
 * @param text
 * @param filename
 */
export function saveString(text, filename) {
    downloadBlob(new Blob([text], {type: 'text/plain'}), filename);
}
import { Utils } from "@astral3d/engine";

export const XMPContext: Record<string, string> = {
    dc: 'http://purl.org/dc/elements/1.1/',
    model3d: 'https://schema.khronos.org/model3d/xsd/1.0/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    xmp: 'http://ns.adobe.com/xap/1.0/',
    xmpRights: 'http://ns.adobe.com/xap/1.0/rights/',
};

export function formatLong(x: number): string {
    return x.toString();
}

export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function dim(str: string): string {
    return `\x1b[2m${str}\x1b[0m`;
}

/* wasm内优化处理 */
let wasmReady = false;

async function ensureWasmReady() {
    if (wasmReady) return;
    await Utils.injectWasm({ wasmUrl: "/wasm/Astral3DglTFHandler.wasm" });
    wasmReady = true;
}

export async function encodeGLB(u8: Uint8Array, meta: Record<string, any> = {}) {
    await ensureWasmReady();

    const out = window.glTFHandlerEncodeGLB(u8, JSON.stringify(meta || {}));
    return new Uint8Array(out.buffer, out.byteOffset, out.byteLength);
}

export async function encodePNG(png: Uint8Array) {
    await ensureWasmReady();

    const out = window.glTFHandlerEncodePNG(png);
    return new Uint8Array(out.buffer, out.byteOffset, out.byteLength);
}
/* wasm内优化处理 End */

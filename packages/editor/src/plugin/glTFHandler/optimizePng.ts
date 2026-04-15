import type { Transform } from '@gltf-transform/core';
import { encodePNG } from './util';

function asUint8Array(data: unknown): Uint8Array {
    if (data instanceof Uint8Array) return data;
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    throw new Error('Unsupported texture image type');
}

export const optimizePNG = (): Transform => async (doc) => {
    const textures = doc.getRoot().listTextures();
    for (const tex of textures) {
        // 仅处理 PNG
        if (tex.getMimeType() !== 'image/png') continue;

        const image = tex.getImage();
        if (!image || image.byteLength === 0) continue;

        // 归一化为 Uint8Array
        const imgU8 = asUint8Array(image);

        const stamped = await encodePNG(imgU8);
        tex.setImage(stamped);
        tex.setMimeType('image/png');
    }
};

import * as THREE from "three";
import Loader from "@/core/loader/Loader.ts";
import App from "@/core/app/App.ts";
import { readAstralZipArrayBuffer, readAstralZipBlob, readAstralZipText, waitAstralZipConstructor } from "@/utils/wasm/zip.ts";

interface IMaterialZipJson {
    textures: Record<string, string>;
    properties: Record<string, unknown>;
}

interface ITextureLoadResult {
    type: string;
    texture: THREE.Texture | null;
}

/**
 * 根据文件名推断 PBR 贴图槽位。
 * @param materialJson 材质描述对象。
 * @param relativePath ZIP 内部文件路径。
 */
function collectTexturePath(materialJson: IMaterialZipJson, relativePath: string) {
    if (relativePath.includes("baseColor")) {
        materialJson.textures.baseColor = relativePath;
    } else if (relativePath.includes("normal")) {
        materialJson.textures.normal = relativePath;
    } else if (relativePath.includes("bump")) {
        materialJson.textures.bump = relativePath;
    } else if (relativePath.includes("displacement")) {
        materialJson.textures.displacement = relativePath;
    }  else if (relativePath.includes("emissive")) {
        materialJson.textures.emissive = relativePath;
    } else if (relativePath.includes("alpha")) {
        materialJson.textures.alpha = relativePath;
    } else if (relativePath.includes("env")) {
        materialJson.textures.env = relativePath;
    } else if (relativePath.includes("light")) {
        materialJson.textures.light = relativePath;
    } else {
        // arm 贴图可能将粗糙度、金属度、AO 分别写入同一张图的不同通道，因此这里保留多槽位写入。
        if (relativePath.includes("roughness")) {
            materialJson.textures.roughness = relativePath;
        }
        if (relativePath.includes("metalness")) {
            materialJson.textures.metalness = relativePath;
        }
        if (relativePath.includes("ao")) {
            materialJson.textures.ao = relativePath;
        }
    }
}

/**
 * 在没有 material.json 时从 ZIP 文件名推断材质描述。
 * @param fileMetas ZIP 内文件元信息列表。
 * @returns {IMaterialZipJson} 推断出的材质描述。
 */
function createMaterialJsonFromFiles(fileMetas: IAstralZip.FileMeta[]): IMaterialZipJson {
    const materialJson: IMaterialZipJson = {
        textures: {},
        properties: {}
    };

    fileMetas.forEach(fileMeta => {
        const relativePath = fileMeta.name;

        // AstralZip 会显式返回目录描述；同时兼容以斜杠结尾的目录路径。
        if (fileMeta.dir || relativePath.endsWith("/")) return;

        collectTexturePath(materialJson, relativePath);
    });

    return materialJson;
}

/**
 * 从 ZIP 中读取材质描述。
 * @param zipContent ZIP 归档对象。
 * @returns {Promise<IMaterialZipJson>} 材质描述。
 */
async function readMaterialJson(zipContent: IAstralZip.Zip): Promise<IMaterialZipJson> {
    const materialJsonFile = zipContent.file("material.json");
    if (!materialJsonFile) {
        return createMaterialJsonFromFiles(zipContent.files());
    }

    return JSON.parse(await readAstralZipText(zipContent, "material.json"));
}

/**
 * 加载单张材质贴图。
 * @param zipContent ZIP 归档对象。
 * @param type 贴图槽位。
 * @param path ZIP 内部贴图路径。
 * @returns {Promise<ITextureLoadResult>} 贴图加载结果。
 */
async function loadMaterialTexture(zipContent: IAstralZip.Zip, type: string, path: string): Promise<ITextureLoadResult> {
    const textureFile = zipContent.file(path);
    if (!textureFile) {
        console.warn(`Texture file not found: ${path}`);
        return { type, texture: null };
    }

    const extension = path.toString().split(".").pop()?.toLowerCase() || "jpg";
    let textureBlob: Blob;

    try {
        // EXR 需要保留专用 MIME，避免后续纹理加载器无法识别格式。
        if (extension === "exr") {
            const buffer = await readAstralZipArrayBuffer(zipContent, path);
            textureBlob = new Blob([buffer], { type: "image/x-exr" });
        } else {
            textureBlob = await readAstralZipBlob(zipContent, path);
        }
    } catch (err) {
        console.error(`Failed to load texture (${type}):`, err);
        return { type, texture: null };
    }

    const textureUrl = URL.createObjectURL(textureBlob);

    return new Promise<ITextureLoadResult>(
        (resolve) => {
            Loader.loadUrlTexture(
                extension,
                textureUrl,
                (texture: THREE.Texture) => {
                    URL.revokeObjectURL(textureUrl);
                    resolve({ type, texture });
                },
                (error: Error) => {
                    URL.revokeObjectURL(textureUrl);
                    console.error(`Texture load error (${type}):`, error);
                    resolve({ type, texture: null });
                }
            );
        }
    );
}

/**
 * 解析材质zip包
 * @param zipFile 材质 ZIP 文件。
 * @returns {Promise<THREE.MeshStandardMaterial>} 解析后的 PBR 材质。
 */
export async function parseMaterialZip(zipFile: File): Promise<THREE.MeshStandardMaterial> {
    const AstralZip = await waitAstralZipConstructor();
    const zipContent = await AstralZip.loadAsync(zipFile);

    try {
        const materialJson = await readMaterialJson(zipContent);

        // 并行加载所有纹理，保持原有解析速度和容错行为。
        const textureResults = await Promise.all(
            Object.entries(materialJson.textures).map(([type, path]) => loadMaterialTexture(zipContent, type, path))
        );
        const textures = textureResults.reduce((acc, { type, texture }) => {
            if (texture) acc[type] = texture;
            return acc;
        }, {} as Record<string, THREE.Texture>);

        // 处理无有效纹理的情况。
        if (Object.keys(textures).length === 0) {
            throw new Error("No valid textures found in the zip file");
        }

        return await App.createPBRMaterial(textures, materialJson.properties || {});
    } finally {
        zipContent.dispose();
    }
}

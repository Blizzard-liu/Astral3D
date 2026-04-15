export const ASTRAL_ZIP_READY_TIMEOUT = 10000;
export const ASTRAL_ZIP_READY_INTERVAL = 16;
export const ASTRAL_ZIP_MAX_WORKERS = 4;

/**
 * 获取 AstralZip 构造器.
 * @returns {IAstralZip.Constructor | undefined} 返回 wasm 注入后的 AstralZip 构造器.
 */
export function getAstralZipConstructor(): IAstralZip.Constructor | undefined {
	const globalScope = globalThis as typeof globalThis & { AstralZip?: IAstralZip.Constructor };
	return globalScope.AstralZip;
}

/**
 * 等待 AstralZip wasm 能力完成注入.
 * @returns {Promise<IAstralZip.Constructor>} 返回可用的 AstralZip 构造器.
 */
export function waitAstralZipConstructor(): Promise<IAstralZip.Constructor> {
	const constructor = getAstralZipConstructor();
	if (constructor) {
		return Promise.resolve(constructor);
	}

	const startTime = performance.now();
	return new Promise((resolve, reject) => {
		const check = () => {
			const constructor = getAstralZipConstructor();
			if (constructor) {
				resolve(constructor);
				return;
			}

			if (performance.now() - startTime > ASTRAL_ZIP_READY_TIMEOUT) {
				reject(new Error("AstralZip wasm 未完成注入"));
				return;
			}

			setTimeout(check, ASTRAL_ZIP_READY_INTERVAL);
		};

		check();
	});
}

/**
 * 获取 AstralZip 并发压缩 worker 数量.
 * @returns {number} 返回受上限保护的 worker 数量.
 */
export function getAstralZipWorkers(): number {
	const hardwareConcurrency = navigator.hardwareConcurrency || ASTRAL_ZIP_MAX_WORKERS;
	return Math.max(1, Math.min(ASTRAL_ZIP_MAX_WORKERS, hardwareConcurrency));
}

/**
 * 从归档中读取指定文件代理.
 * @param archive ZIP 归档对象.
 * @param fileName 文件内部路径.
 * @returns {IAstralZip.File} 返回文件代理.
 */
export function getAstralZipFile(archive: IAstralZip.Zip, fileName: string): IAstralZip.File {
	const file = archive.file(fileName);
	if (!file) {
		throw new Error(`zip 文件不存在: ${fileName}`);
	}

	return file;
}

/**
 * 读取 ZIP 内文本文件.
 * @param archive ZIP 归档对象.
 * @param fileName 文件内部路径.
 * @returns {Promise<string>} 返回 UTF-8 文本.
 */
export function readAstralZipText(archive: IAstralZip.Zip, fileName: string): Promise<string> {
	return getAstralZipFile(archive, fileName).async("string");
}

/**
 * 读取 ZIP 内二进制文件.
 * @param archive ZIP 归档对象.
 * @param fileName 文件内部路径.
 * @returns {Promise<ArrayBuffer>} 返回独立 ArrayBuffer.
 */
export function readAstralZipArrayBuffer(archive: IAstralZip.Zip, fileName: string): Promise<ArrayBuffer> {
	return getAstralZipFile(archive, fileName).async("arraybuffer");
}

/**
 * 读取 ZIP 内 Blob 文件.
 * @param archive ZIP 归档对象.
 * @param fileName 文件内部路径.
 * @returns {Promise<Blob>} 返回 Blob.
 */
export function readAstralZipBlob(archive: IAstralZip.Zip, fileName: string): Promise<Blob> {
	return getAstralZipFile(archive, fileName).async("blob");
}
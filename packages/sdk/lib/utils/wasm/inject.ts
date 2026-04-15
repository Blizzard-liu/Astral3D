import "./wasm_exec.js";

// 20251112: 注入tinyGo编译的wasm
export function injectWasm(opts: { wasmUrl: string }): Promise<any> {
	return new Promise((resolve, reject) => {
		if (!opts.wasmUrl) {
			reject("wasmUrl requires valid URL");
			return;
		}

		// @ts-ignore
		const go = new AstralGo();

		const done = obj => {
			const wasm = obj.instance;
			go.run(wasm);

			resolve(wasm);
		};

		if ("instantiateStreaming" in WebAssembly) {
			WebAssembly.instantiateStreaming(fetch(opts.wasmUrl), go.importObject)
				.then(function (obj) {
					done(obj);
				})
				.catch(function (err) {
					reject(err);
				});
		} else {
			fetch(opts.wasmUrl)
				.then(resp => resp.arrayBuffer())
				.then(bytes =>
					WebAssembly.instantiate(bytes, go.importObject)
						.then(function (obj) {
							done(obj);
						})
						.catch(function (err) {
							reject(err);
						})
				);
		}
	});
}

import {Preview,Utils} from "@astral3d/engine";

export class AssetPreview {
    static #instance:AssetPreview;    // 静态私有属性存储唯一实例
    previewer: Preview;
    private container: HTMLElement;

    static getInstance(container?:HTMLElement) {
        if (!AssetPreview.#instance) {
            AssetPreview.#instance = new AssetPreview(container);
        }else if(container && container !== AssetPreview.#instance.container){
            AssetPreview.#instance.updateContainer(container);
        }

        return AssetPreview.#instance;
    }

    constructor(container?:HTMLElement) {
        if (AssetPreview.#instance) {
            throw new Error("Use AssetPreview.getInstance() instead");
        }

        this.container = container || Utils.createDivContainer();

        this.previewer = new Preview({
            container: this.container,
            hdr: "/static/resource/hdr/cloudy.hdr",
            request: {
                baseUrl:"/file/static/"
            }
        });
    }

    updateContainer(container:HTMLElement){
        if(container === this.previewer.container) return;

        this.container = container;
        this.previewer.container = container;
    }

    /**
     * 加载预览项
     */
    load(fileOrUrl:string | File,type:string = "Model"){
        return this.previewer.load(fileOrUrl,type);
    }

    clear(){
        this.previewer.clear();
    }

    dispose(){
        this.previewer.dispose();
        //@ts-ignore
        this.previewer = null;
        //@ts-ignore
        AssetPreview.#instance = null;
    }
}
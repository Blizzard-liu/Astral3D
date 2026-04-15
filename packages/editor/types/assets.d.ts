declare namespace IAssets {
    type SupportType = 'Model' | 'Material' | 'Texture' | 'Billboard' | 'HDR';

    interface MainCategory {
        key: IAssets.SupportType;
        label:string | ComputedRef<string>;
        icon:any;
        children:IAssets.Category[];
    }

    interface Category {
        id:string | number;
        key:string;
        label:string;
        pkey:string | null;
        sortNum:number;
        type: IAssets.SupportType;
        children:IAssets.Category[];
    }

    interface Item {
        id?: number;
        name: string;
        type: IAssets.SupportType;
        category: string;
        categoryName?: string;
        thumbnail: string;
        size: number;
        tags?: string; // 标签,英文逗号分割。比如 ["含骨骼", "含动画", "静态"]
        file: string; // 文件地址
        createTime?:string;
        updateTime?:string;
    }
}
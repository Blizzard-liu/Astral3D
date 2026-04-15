declare interface IDrawingMark {
    x: number,
    y: number,
    w: number,
    h: number,
    color?:string,
    modelUuid?: string,
    modelPath?: string
}

declare interface IDrawingImgInfo {
    width: number,
    height: number
}

declare interface IDrawingInfo {
    imgSrc:string;
    markList:IDrawingMark[];
    imgInfo:IDrawingImgInfo;
}

declare namespace ICad{
    interface DxfLayer{
        name: string,
        color: number,
        colorIndex: number,
        frozen: boolean, // 冻结
        visible: boolean,
        //entities: any[]
    }

    interface DxfLayers{
        [name:string]: DxfLayer
    }

    interface Data {
        id:number,
        fileName :string,
        thumbnail:string,
        filePath:string,
        converterFilePath:string,
        conversionStatus :number,
        createTime :string,
    }
}
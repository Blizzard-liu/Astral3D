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

declare interface IDrawing {
    isUploaded: boolean;
    imgSrc:string;
    isCad: boolean;
    layers: ICad.DxfLayers;
    isDrawingRect:boolean;
    selectedRectIndex: number;
    markList: DrawingMark[];
    imgInfo: DrawingImgInfo;
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
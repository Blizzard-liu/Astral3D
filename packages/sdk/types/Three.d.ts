/**
 * 扩展three.js类型声明
 */
import * as THREE from 'three';

declare module 'three' {
    interface Object3D extends THREE.Object3D{
        // 是否被忽略，仅用于显示（选中、场景树、打包等都会忽略）
        ignore?: boolean;

        // 元数据
        metaData: {
            material?: string | Array<string> | THREE.Material
        };

        // 是否为粒子发射器代理对象
        isEmitterProxy?: boolean;

        // 此Object3D被操控时的代理对象
        proxy?: THREE.Object3D;

        // 粒子发射器
        emitter?:any;

        // 广告牌配置
        options?:any;

        // html面板
        isHtmlPanel?: boolean;
        isHtmlSprite?: boolean;

        //IFC模型
        isIFC?: boolean;

        // CSS3D/CSS2D
        element:HTMLElement;

        // 当前所处模型树层级
        groupLayer?:number;

        // 在对象以及后代中执行的回调函数,仅对满足条件的对象执行
        traverseByCondition(callback: (Object3D) => void, condition: (Object3D) => boolean):void;

        // 判断 parentObj 是否是 当前对象 的任意层级祖先（包括祖父、曾祖父等）
        isAncestor(parentObj:Object3D):boolean;

        /* 变更的声明 */
        animations: Array<THREE.AnimationAction>;

        // /* 以下补充THREE.Object3D自身缺少的声明 */
        // isInstancedMesh?: boolean;
        // count?:number;
        // instanceMatrix?: THREE.InstancedBufferAttribute;
        // instanceColor?:THREE.Color;
        // isBatchedMesh?:boolean;
        // perObjectFrustumCulled?:boolean;
        // sortObjects?:boolean;
        // _drawRanges?:any;
        // _reservedRanges?:any;
        // _visibility?: boolean;
        // _active?: boolean;
        // _bounds?: any;
        // _maxInstanceCount?: number;
        // _maxVertexCount?: number;
        // _maxIndexCount?: number;
        // _geometryInitialized?: boolean;
        // _geometryCount?: number;
        // _matricesTexture?: THREE.Texture;
        // _colorsTexture?: THREE.Texture;
        // boundingSphere?: THREE.Sphere;
        // boundingBox?: THREE.Box3;
        // isScene?: boolean;
        // material:THREE.Material | THREE.Material[];

        /* 强制解决three本身类型声明产生的各种问题 */
        [key:string]:any;
    }

    interface Camera{
        isPerspectiveCamera?:boolean;

        updateProjectionMatrix:() => void;
    }

    interface Material {
        // 从另一个材质中复制相同的属性（材质类型可能不同）
        copyAttr(source:THREE.Material):void;
    }

    interface Object3DJSONObject{
        environmentType?: "ModelViewer";
        environment?: string;
        options?: {
            [key: string]: any
        }
    }

    interface BufferGeometry {
        //BVH boundsTree 屬性
        boundsTree: any;
    }
}

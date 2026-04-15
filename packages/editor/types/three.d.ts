/**
 * 扩展three.js类型声明
 */
import * as THREE from 'three';

declare module 'three' {
    interface Object3D extends THREE.Object3D{
        /* 强制解决three本身类型声明产生的各种问题 */
        [key:string]:any;
    }
}

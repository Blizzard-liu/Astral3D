import * as THREE from "three";
import CameraControls from "camera-controls";
import Viewer from "../Viewer"

/**
 * @author ErSan
 * @email  mlt131220@163.com
 * @date   2024/10/21 21:16
 * @description 场景相机管理器。 TODO: 后续应把viewport.camera也管理进来
 */
export class CameraManage {
    private readonly viewer: Viewer;

    /**
     * 默认交互相机参数
     */
    options: {};

    private readonly controls: CameraControls;

    constructor(viewer:Viewer,cameraControls:CameraControls) {
        this.viewer = viewer;
        this.controls = cameraControls;

        this.options = this.viewer.options.control;

        this.init();
    }

    init(){
        this.setInteract(this.options);
    }

    /**
     * 设置交互模式
     */
    setInteract(config){
        const opt = Object.assign({}, this.options, config);

        Object.keys(opt).forEach(key => {
            if(this.controls[key] !== undefined){
                this.controls[key] = opt[key];
            }
        })
    }

    /**
     * 前视图
     * @description 以z轴方向为正前方
     */
    front() {
        return new Promise((resolve, reject) => {
            try {
                this.setInteract({
                    minAzimuthAngle: 0,
                    maxAzimuthAngle: 0,
                    minPolarAngle: Math.PI / 2,
                    maxPolarAngle: Math.PI / 2,
                })

                this.controls.rotateTo(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(90), true).then(() => {
                    this.controls.fitToSphere(this.viewer.scene, true);
                })

                resolve(this.viewer.camera);
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * 后视图
     * @description -z方向
     */
    rear() {
        return new Promise((resolve, reject) => {
            try {
                this.setInteract({
                    minAzimuthAngle: -Math.PI,
                    maxAzimuthAngle: -Math.PI,
                    minPolarAngle: Math.PI / 2,
                    maxPolarAngle: Math.PI / 2,
                });

                this.controls.rotateTo(THREE.MathUtils.degToRad(-180), THREE.MathUtils.degToRad(90), true).then(() => {
                    this.controls.fitToSphere(this.viewer.scene, true);
                })

                resolve(this.viewer.camera);
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * 左视图
     * @description -x方向
     */
    left() {
        return new Promise((resolve, reject) => {
            try {
                this.setInteract({
                    minAzimuthAngle: -Math.PI / 2,
                    maxAzimuthAngle: -Math.PI / 2,
                    minPolarAngle: Math.PI / 2,
                    maxPolarAngle: Math.PI / 2,
                });

                this.controls.rotateTo(THREE.MathUtils.degToRad(-180), THREE.MathUtils.degToRad(180), true).then(() => {
                    this.controls.fitToSphere(this.viewer.scene, true);
                })

                resolve(this.viewer.camera);
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * 右视图
     * @description x方向
     */
    right() {
        return new Promise((resolve, reject) => {
            try {
                this.setInteract({
                    minAzimuthAngle: Math.PI / 2,
                    maxAzimuthAngle: Math.PI / 2,
                    minPolarAngle: Math.PI / 2,
                    maxPolarAngle: Math.PI / 2
                });

                this.controls.rotateTo(THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(180), true).then(() => {
                    this.controls.fitToSphere(this.viewer.scene, true);
                })

                resolve(this.viewer.camera);
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * 顶视图
     * @description y方向
     */
    top() {
        return new Promise((resolve, reject) => {
            try {
                this.setInteract({
                    minAzimuthAngle: -Infinity,
                    maxAzimuthAngle: Infinity,
                    minPolarAngle: 0,
                    maxPolarAngle: 0,
                })
                this.controls.rotatePolarTo(0,true).then(() => {
                    this.controls.fitToSphere(this.viewer.scene, true);
                });

                resolve(this.viewer.camera);
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * 底视图
     * @description -y方向
     */
    bottom() {
        return new Promise((resolve, reject) => {
            try {
                this.setInteract({
                    minAzimuthAngle: -Infinity,
                    maxAzimuthAngle: Infinity,
                    minPolarAngle: Math.PI,
                    maxPolarAngle: Math.PI,
                });

                this.controls.rotatePolarTo(Math.PI,true).then(() => {
                    this.controls.fitToSphere(this.viewer.scene, true);
                });

                resolve(this.viewer.camera);
            } catch (e) {
                reject(e)
            }
        })
    }
}
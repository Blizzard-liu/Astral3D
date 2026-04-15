/**
 * @author ErSan
 * @email  mlt131220@163.com
 * @date   2024/9/16 23:19
 * @description glTF处理器插件
 */
import {h, ref} from "vue";
import type {ModalReactive} from "naive-ui";
import {t} from "@/language";
import type {Plugin} from "@astral3d/engine";
import GLTFHandlerComponent from "@/components/es/plugin/builtin/GLTFHandler.vue";

import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
// @ts-ignore
import { ready as resampleReady, resample as resampleWASM } from 'keyframe-resample';
import { Logger,WebIO, Transform } from '@gltf-transform/core';
import {
    dedup,
    instance,
    prune,
    quantize,
    resample,
    weld,
    meshopt,
    draco,
    simplify,
    textureCompress,
    flatten,
    join,
    sparse,
    palette,
} from '@gltf-transform/functions';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import {Session} from "./session";
import {loadScript} from "@/utils/common/utils";
import { optimizePNG } from "@/plugin/glTFHandler/optimizePng";

//使用'micromatch'，因为'contains: true'没有像预期的那样在minimatch中工作。需要确保'*'匹配的模式，如'image/png'。
export const MICROMATCH_OPTIONS = { nocase: true, contains: true };

export default class GLTFHandler implements Plugin{
    icon= "";
    name = "glTF处理器";
    version = 1;

    logger = new Logger(Logger.Verbosity.INFO);
    io = new WebIO({credentials: 'include'}).registerExtensions(ALL_EXTENSIONS);

    modalInstance:ModalReactive | undefined = undefined;
    GLTFHandlerComponentRef = ref();
    dracoScript = new Proxy({
        encoder:false,
        decoder:false,
        failMsg:""
    },{
        set:(target: {decoder: boolean;encoder: boolean;failMsg: string;}, p: string | symbol, newValue: any): boolean => {
            target[p] = newValue;

            if(p === "failMsg"){
                window.$message?.error(newValue)
                return true;
            }

            if(target.encoder && target.decoder){
                this.registerDependencies()
            }

            return true;
        }
    })

    async install() {
        // console.log(`%c glTF处理器 %c 版本：1.0.0`, 'background: #35495e; padding: 4px; border-radius: 3px 0 0 3px; color: #fff',
        //     'background: #41b883; padding: 4px; border-radius: 0 3px 3px 0; color: #fff');
    }

    async run() {
        // 运行时再加载draco相关js
        if(!this.dracoScript.encoder){
            loadScript("/libs/draco/draco_encoder.js",false).then(() => {
                this.dracoScript.encoder = true;
            }).catch(() => {
                this.dracoScript.failMsg = t("plugin.gltfHandler['Draco encoder load fail,Refresh the page and try again.']");
            })
        }
        if(!this.dracoScript.decoder) {
            loadScript("/libs/draco/draco_decoder.js", false).then(() => {
                this.dracoScript.decoder = true;
            }).catch(() => {
                this.dracoScript.failMsg = t("plugin.gltfHandler['Draco decoder load fail,Refresh the page and try again.']");
            })
        }

        this.GLTFHandlerComponentRef = ref();
        this.modalInstance = window.$modal.create({
            title: this.name,
            preset:"card",
            maskClosable:false,
            style: {
                width: '90%',
                maxWidth: '800px'
            },
            onAfterLeave: () => this.finish(),
            content: () => {
                return h(GLTFHandlerComponent,{
                    onOptimize: this.optimize.bind(this),
                    onFinish: () => this.finish(),
                    ref: this.GLTFHandlerComponentRef
                },"")
            },
        })
    }

    // 关闭插件
    finish(){
        this.modalInstance && this.modalInstance.destroy();

        this.GLTFHandlerComponentRef = ref();
    }

    uninstall(): void {}

    setLogger(log:string){
        if(!this.GLTFHandlerComponentRef.value) return;

        this.GLTFHandlerComponentRef.value.addLog(log);
    }

    async registerDependencies(){
        this.io.registerDependencies({
            // @ts-ignore
            'draco3d.encoder': await new DracoEncoderModule(),
            // @ts-ignore
            'draco3d.decoder': await new DracoDecoderModule(),
        })
    }

    /* 下面是实现的自定义的处理器方法 */
    async optimize(opts:IPlugin.GLTFHandlerOptimizeModel,inputFile:File,outputFileName = ""){
        this.setLogger(`Optimize ${inputFile.name}`);

        if(this.dracoScript.failMsg){
            window.$message?.error(this.dracoScript.failMsg);
            return;
        }
        if(!this.dracoScript.encoder || !this.dracoScript.decoder){
            setTimeout(()=>this.optimize(opts,inputFile,outputFileName),1000)
            return;
        }

        /* 文件准备就绪，开始优化 */

        const transforms: Transform[] = [
            optimizePNG(),
            dedup()
        ];

        if (opts.instance) transforms.push(instance({ min: opts.instanceMin }));

        if (opts.palette) {
            transforms.push(
                palette({
                    min: opts.paletteMin,
                    keepAttributes: !opts.prune || !opts.pruneAttributes,
                }),
            );
        }

        if (opts.flatten) transforms.push(flatten());
        if (opts.join) transforms.push(join());
        if (opts.weld) transforms.push(weld());

        if (opts.simplify) {
            transforms.push(
                simplify({
                    simplifier: MeshoptSimplifier,
                    // simplifyError 用%显示时扩大了100倍，需要高精度计算减小100倍
                    error: opts.simplifyError / 100,
                    ratio: opts.simplifyRatio,
                    lockBorder: opts.simplifyLockBorder,
                }),
            );
        }

        // 重新采样动画通道，无损地删除重复的关键帧以减小文件大小。重复的关键帧通常出现在由创作软件“烘焙”的动画中，以应用 IK 约束或其他软件特定功能。
        transforms.push(resample({ ready: resampleReady, resample: resampleWASM }));

        if (opts.prune) {
            transforms.push(
                prune({
                    keepAttributes: !opts.pruneAttributes,
                    keepIndices: false,
                    keepLeaves: !opts.pruneLeaves,
                    keepSolidTextures: !opts.pruneSolidTextures,
                }),
            );
        }

        transforms.push(sparse());

        if (opts.textureCompress !== 'none') {
            transforms.push(
                textureCompress({
                    resize: [opts.textureSize, opts.textureSize],
                    targetFormat: opts.textureCompress === 'auto' ? undefined : opts.textureCompress,
                    // limitInputPixels: options.limitInputPixels as boolean,
                    limitInputPixels: false,
                }),
            );
        }

        // 最后进行网格压缩
        if (opts.compress === 'draco') {
            transforms.push(draco());
        } else if (opts.compress === 'meshopt') {
            transforms.push(meshopt({ encoder: MeshoptEncoder, level: opts.meshoptLevel }));
        } else if (opts.compress === 'quantize') {
            transforms.push(quantize());
        }

        // 设置输出文件名
        if(!outputFileName){
            const format = inputFile.name.split(".").pop();
            outputFileName = inputFile.name.replace(`.${format}`,`_astral3d.optimize.${format}`)
        }

        // 生成临时 URL
        const inputFileUrl = URL.createObjectURL(inputFile);

        let outputFile:File | undefined = undefined
        try {
            outputFile = await Session.create(this,inputFileUrl, inputFile.name, outputFileName)
                .setDisplay(true)
                .transform(...transforms);

            this.setLogger(`Optimize ${inputFile.name} success!`);
        }catch (e:unknown){
            if (e instanceof Error) {
                window.$message?.error(e.message);
                this.setLogger(`Optimize ${inputFile.name} error: ${e.message}`);
            } else {
                window.$message?.error(e as string);
                this.setLogger(`Optimize ${inputFile.name} error: ${e}`);
            }
        }

        return outputFile;
    }
}
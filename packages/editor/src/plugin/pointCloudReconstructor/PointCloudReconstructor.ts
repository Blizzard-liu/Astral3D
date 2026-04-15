/**
 * @author ErSan
 * @email  mlt131220@163.com
 * @date   2025/07/03 14:20
 * @description 语义化点云重建
 */
import { h, ref } from "vue";
import type { ModalReactive } from "naive-ui";
import type { Plugin } from "@astral3d/engine";
import PointCloudReconstructorComponent from "@/components/es/plugin/builtin/PointCloudReconstructor.vue";

export default class PointCloudReconstructor implements Plugin {
    icon = "";
    name = "语义化点云重建";
    version = 0.1;

    modalInstance: ModalReactive | undefined = undefined;
    componentRef = ref();

    async install() {
        // console.log(`%c 语义化点云重建 %c 版本：0.1.0`, 'background: #35495e; padding: 4px; border-radius: 3px 0 0 3px; color: #fff',
        //     'background: #41b883; padding: 4px; border-radius: 0 3px 3px 0; color: #fff');
    }

    async run() {
        this.componentRef = ref();
        this.modalInstance = window.$modal.create({
            title: this.name,
            preset: "card",
            maskClosable: false,
            style: {
                width: '90%',
                maxWidth: '800px'
            },
            onAfterLeave: () => {
                this.componentRef.value.handleClose();
                this.finish();
            },
            content: () => {
                return h(PointCloudReconstructorComponent, {
                    ref: this.componentRef
                }, "")
            },
        })
    }

    // 关闭插件
    finish() {
        this.modalInstance && this.modalInstance.destroy();

        this.componentRef = ref();
    }

    uninstall(): void { }
}
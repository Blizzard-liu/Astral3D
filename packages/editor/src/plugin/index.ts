import GLTFHandler from "./glTFHandler/glTFHandler";
import PointCloudReconstructor from "./pointCloudReconstructor/PointCloudReconstructor";

// 注册内置插件
export const installBuiltinPlugin = (viewer) => {
    //glTF处理器
    viewer.modules.plugin.use(new GLTFHandler());
    // 语义化点云重建
    viewer.modules.plugin.use(new PointCloudReconstructor());
}
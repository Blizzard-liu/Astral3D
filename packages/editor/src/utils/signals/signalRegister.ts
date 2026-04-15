import {Utils} from '@astral3d/engine';

/**
 * 其他不便分类的
 */
const otherSignal = [
    // 编辑脚本
    "editScript",
    // 场景树变化
    "sceneTreeChange",
]

Utils.SignalsRegisterFn([
    ...otherSignal
])
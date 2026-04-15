/**
 * 用于验证的工具函数集合
 */
import {t} from "@/language";

export function formItemIsFile(_, value:File | null){
    return new Promise<void>((resolve, reject) => {
        // 判断value是否是File类型
        if (!value || !(value instanceof File)) {
            reject(Error(t("prompt.The entry can not be null")))
        } else {
            resolve()
        }
    })
}

export function formItemNotNil(_, value:any){
    return new Promise<void>((resolve, reject) => {
        if (value === null || value === undefined) {
            reject(Error(t("prompt.The entry can not be null")))
        } else {
            resolve()
        }
    })
}
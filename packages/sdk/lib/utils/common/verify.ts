/**
 * 验证方法
 */

export const IS_MAC = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

export const isNil = (v) => v === null || v === undefined;

// 判断是否是空对象，排除数组
export const isEmptyObject = (obj:object) => typeof obj === 'object' && obj !== null && !Array.isArray(obj) && Object.keys(obj).length === 0;
/**
 * 递归访问嵌套属性
 * @param {object} obj
 * @param {string} path 属性路径字符串，eg: "a.b.c"
 */
export function getNestedProperty(obj:object, path:string):any {
    return path.split('.').reduce((o, key) => o?.[key], obj);
}

/**
 * 转义正则特殊字符
 * @param {string} str
 */
export function escapeRegExp(str:string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 获取系统主题色
 */
export function getOsTheme(){
    const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)"); // 是深色
    if (isDarkTheme.matches) {
        return 'dark';
    } else {
        return "light";
    }
}

/**
 * 获取rem的px值
 */
export function remToPxNumber(rem: number): number {
    const f = parseFloat(document.documentElement.style.fontSize);
    return f * rem;
}

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 时间间隔（毫秒）
 * @returns {Function} - 返回一个防抖后的函数
 */
export function debounce(func, wait): (...args: any[]) => void {
    let timer: NodeJS.Timeout | null = null;
    return function(){
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func(...arguments)
        }, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func - 需要节流的函数
 * @param {number} wait - 时间间隔（毫秒），表示在这个时间间隔内最多执行一次函数
 * @returns {Function} - 返回一个节流后的函数
 */
export function throttle(func, wait:number):(...args: any[]) => void {
    // 上一次执行函数的时间戳，初始值为 0
    let lastTime = 0;

    // 返回一个闭包函数，作为节流后的函数
    return function () {
        // 获取当前时间戳
        const now = Date.now();

        // 如果当前时间与上一次执行时间的差值大于等于 wait，则执行函数
        if (now - lastTime >= wait) {
            // 更新上一次执行函数的时间戳
            lastTime = now;
            // 调用原始函数，并传入参数
            func(...arguments);
        }
    };
}

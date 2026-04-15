import "../signals/signalRegister";

window.URL = window.URL || window.webkitURL;
// @ts-ignore
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
Number.prototype.format = function () {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

/*添加自执行函数，为rem设置自适应的根DOM字体大小，1920px下默认1rem = 20px */
(function () {
    change();

    function change() {
        const w = document.documentElement.clientWidth > 1280 ? document.documentElement.clientWidth : 1280;
        document.documentElement.style.fontSize = w * 20 / 1920 + "px";
    }

    /*监听窗口大小的改变*/
    window.addEventListener("resize", change, false);
})()

//屏蔽选中
document.onselectstart = function (event) {
    if (window.event) {
        event = window.event;
    }
    try {
        const the = event.srcElement;
        // @ts-ignore
        return (the.tagName === "INPUT" && the.type.toLowerCase() === "text") || the.tagName === "TEXTAREA";
    } catch (e) {
        return false;
    }
}

// 禁止浏览器默认右键菜单
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// 保存原始方法
const originalStringify = JSON.stringify;
const originalParse = JSON.parse;

// 重写 JSON.stringify
JSON.stringify = function (value: any, ...args: any[]) {
    return originalStringify(value, function (key, val) {
        // 如果有自定义的 replacer 函数，先执行它
        if (args[0]) {
            val = args[0](key, val);
        }

        if (val === Infinity) return "Infinity";
        if (val === -Infinity) return "-Infinity";
        return val;
    }, args[1]); // args[1] 是 space 参数
};

// 重写 JSON.parse
JSON.parse = function (text: string, reviver?: (key: any, value: any) => any) {
    return originalParse(text, function (key, value) {
        // 处理 Infinity
        if (value === "Infinity") return Infinity;
        if (value === "-Infinity") return -Infinity;

        // 如果有自定义的 reviver 函数，执行它
        return reviver ? reviver(key, value) : value;
    });
};
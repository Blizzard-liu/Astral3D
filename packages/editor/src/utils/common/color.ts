// 10进制转rgba
export function decToRgb(number:number) {
    const blue = number & 0xff;
    const green = number >> 8 & 0xff;
    const red = number >> 16 & 0xff;
    return `rgb(${red}, ${green}, ${blue})`;
}
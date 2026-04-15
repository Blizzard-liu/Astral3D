let numberTag = '[object Number]';

let objectProto = Object.prototype;

let objectToString = objectProto.toString;

function isObjectLike(value) {
    return !!value && typeof value == 'object';
}

function isNumber(value) {
    return typeof value == 'number' ||
        (isObjectLike(value) && objectToString.call(value) == numberTag);
}

export default isNumber;
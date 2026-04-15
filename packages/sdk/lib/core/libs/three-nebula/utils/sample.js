let MAX_SAFE_INTEGER = 9007199254740991;

let argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

let reIsUint = /^(?:0|[1-9]\d*)$/;

function arrayMap(array, iteratee) {
    let index = -1,
        length = array ? array.length : 0,
        result = Array(length);

    while (++index < length) {
        result[index] = iteratee(array[index], index, array);
    }
    return result;
}

function baseTimes(n, iteratee) {
    let index = -1,
        result = Array(n);

    while (++index < n) {
        result[index] = iteratee(index);
    }
    return result;
}

function baseValues(object, props) {
    return arrayMap(props, function(key) {
        return object[key];
    });
}

function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}

let objectProto = Object.prototype;

let hasOwnProperty = objectProto.hasOwnProperty;

let objectToString = objectProto.toString;

let propertyIsEnumerable = objectProto.propertyIsEnumerable;

let nativeFloor = Math.floor,
    nativeKeys = overArg(Object.keys, Object),
    nativeRandom = Math.random;

function arrayLikeKeys(value, inherited) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    // Safari 9 makes `arguments.length` enumerable in strict mode.
    let result = (isArray(value) || isArguments(value))
        ? baseTimes(value.length, String)
        : [];

    let length = result.length,
        skipIndexes = !!length;

    for (let key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
            result.push(key);
        }
    }
    return result;
}

function baseKeys(object) {
    if (!isPrototype(object)) {
        return nativeKeys(object);
    }
    let result = [];
    for (let key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
            result.push(key);
        }
    }
    return result;
}

function baseRandom(lower, upper) {
    return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
}

function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length &&
        (typeof value == 'number' || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length);
}

function isPrototype(value) {
    let Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

    return value === proto;
}

function sample(collection) {
    let array = isArrayLike(collection) ? collection : values(collection),
        length = array.length;

    return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
}

function isArguments(value) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
        (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

let isArray = Array.isArray;

function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}

function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
}

function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    let tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
}

function isLength(value) {
    return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

function isObject(value) {
    let type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}

function isObjectLike(value) {
    return !!value && typeof value == 'object';
}

function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

function values(object) {
    return object ? baseValues(object, keys(object)) : [];
}

export default sample;
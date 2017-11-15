/**
 * extracts all 'public' properties from an object, recursively per default.
 * private properties can either be defined by having the same prefix (i.e. '__privateProperty')
 * or by providing all key names that should be ignored.
 * can also be combined, in case it is needed to also hide some public properties.
 *
 * note: if you want a more convenient way of rextracting by extending Object.prototype, use require(rextract) instead
 *
 * All parameters are optional
 * @param {Object} object the object to extract data from
 * @param {boolean} recursive if true, will go through all child objects
 * @param {string} ignorePrefix string to detect private properties by their key names (i.e. '__' for '__privateProp'). a falsey value will disable this check.
 * @param {Array} ignoreKeys Array of strings standing for keys that will be ignored (i.e. [ 'internalId', 'hugeChildObjectWeDontNeedAndThusIgnore' ])
 * @param {function} iteratorCallback callback function that, if provided, will be called for every property that is not being ignored. function will be called with 3 parameters, key, value and object, and is expected to return a value to be stored for that property or null to skip it. check the readme for example implementation.
 * @returns {Object} extracted data object */
function rextract(object, recursive, ignorePrefix, ignoreKeys, iteratorCallback) {
    var d = {};
    for(var k in object) {
        var v = object[k];
        if (typeof v == 'undefined' ||
            typeof v == 'function' ||
            v === null) continue;
        if ((ignorePrefix && k.indexOf(ignorePrefix) == 0) ||
            (ignoreKeys && ignoreKeys.indexOf(k) > -1)) continue;
        if (typeof v == 'object') {
            if (recursive) d[k] = rextract(v, recursive, ignorePrefix, ignoreKeys, iteratorCallback);
        } else {
            if (typeof iteratorCallback == 'function')
                d[k] = iteratorCallback(k, v, object);
            else d[k] = v;
        }
        if (d[k] === null) delete d[k];
    }
    return d;
}

module.exports = rextract;

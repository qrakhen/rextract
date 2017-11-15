const getOptions = require('../options/');

/**
* ! please take a look into the readme for detailed information about this function !
*
* note: if you want a more convenient way of rextracting by extending Object.prototype, use require(rextract) instead
*
* default options:
*  {
*      recursive: true,            // whether to extract child objects too
*      arrayIsRecursion: false     // whether an array is treated as recursion
*      depth: -1,                  // maximum object depth, -1 = none
*      ignore: {                   // you may also provide simple strings instead of arrays here
*          prefix: [],             // prefix(-es) to identify and ignore 'private' properties
*          keys: [],               // explicit keys to be ignored
*          types: [ 'undefined' ], // explicit types to be ignored
*          null: true              // whether null-values should be ignored
*      },
*      pre: false,                 // pre-filter callback, executed before any other filters, expected to return true/false, overrides rules and forces the property to be written
*      each: false                 // "for-each" manipulation callback, executed after all checks are done (function(key, value, object) { }) check the readme for more information about those callbacks
*  }
 * @param {Object} object the object to extract data from
 * @param {Object|boolean|string} options [dynamic] the options object as described above or in the readme. if a boolean is provided, it will be treated as the recursive option, and a string will be taken as ignore.prefix.
 * @param {number} __d only used internally, don't provide this unless you want to break it
 * @returns {Object} extracted data object */
const rextract = function(object, options, __d) {
    if (typeof object != 'object') return object;
    var o = getOptions(options),
        l = (typeof __d == 'undefined' ? o.depth : __d),
        r = (l == 0 ? false : o.recursive),
        i = o.ignore,
        a = Array.isArray(object),
        d = (a ? [] : {});
    step: for (var k in object) {
        if (k == 'rextract' && typeof Object.prototype.rextract == 'function') continue;
        var v = object[k], f = false;
        if (typeof o.pre == 'function') f = !!(o.pre(k, v, object));
        if (!f) {
            if ((i.types.indexOf(typeof v) > -1) ||
                (v === null && i.null) ||
                (i.keys && i.keys.indexOf(k) > -1)) continue;
            for (var p = 0; p < i.prefix.length; p++) if (k.indexOf(i.prefix[p]) == 0) continue step;
        }
        if (typeof v == 'object') {
            if (Array.isArray(v)) {
                if (!f && o.arrayIsRecursion && !r) continue;
                d[k] = rextract(v, o, l - 1);
            } else if (f || r) d[k] = rextract(v, o, l - 1);
        } else d[k] = v;
        if (typeof o.each == 'function') d[k] = o.each(k, v, object);
        if (!f && d[k] === null && i.null) delete d[k];
    }
    return d;
};


module.exports = rextract;

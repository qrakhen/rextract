const getOptions = require('./options/');

/**
 * extracts all 'public' properties from an object, recursively per default.
 * private properties can either be defined by having the same prefix (i.e. '__privateProperty')
 * or by providing all key names that should be ignored.
 * can also be combined, in case it is needed to also hide some public properties.
 *
 * note: if you want to be safe by not extending Object.prototype, use require(rextract/safe) instead
 *
 * option default values:
 *  {
 *      recursive: false,           // whether to extract child objects too
 *      arrayIsRecursion: false     // whether an array is treated as recursion
 *      depth: -1,                  // maximum object depth, -1 = none
 *      ignore: {                   // you may also provide simple strings instead of arrays here
 *          prefix: [],             // prefix(-es) to identify and ignore 'private' properties
 *          keys: [],               // explicit keys to be ignored
 *          types: [ 'undefined' ], // explicit types to be ignored
 *          null: true              // whether null-values should be ignored
 *      },
 *      step: false                 // extraction-step callback (function(key, value, object) { }) check the readme for more information
 *  }
 * @param {Object} options
 * @param {number} __depth only used internally, don't provide this unless you want to break it
 * @returns {Object} extracted data object */
Object.prototype.rextract = function(options, __depth) {
    var o = getOptions(options);
    if (typeof __depth == 'undefined') __depth = o.depth;
    var r = (__depth == 0 ? false : o.recursive),
        i = o.ignore,
        d = {};
    step: for (var k in this) {
        var v = this[k];
        if ((i.types.indexOf(typeof v) > -1) ||
            (v === null && i.null) ||
            (i.keys && i.keys.indexOf(k) > -1)) continue;
        for (var p = 0; p < i.prefix.length; p++) if (k.indexOf(i.prefix[p]) == 0) continue step;
        if (typeof v == 'object') {
            if (Array.isArray(v)) {
                if (o.arrayIsRecursion && !r) continue;
                d[k] = [];
                var _v = v.rextract(o, __depth - 1);
                for (var _k in _v) if (typeof _v[_k] !== 'function') d[k].push(_v[_k]);
            } else if (r) d[k] = v.rextract(o, __depth - 1);
        } else {
            if (typeof o.step == 'function')
                d[k] = o.step(k, v, this);
            else d[k] = v;
        }
        if (d[k] === null && i.null) delete d[k];
    }
    return d;
};

const getOptions = require('./options/');
const __rextract = require('./safe/');

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
 * @param {Object|boolean|string} options [dynamic] the options object as described above or in the readme. if a boolean is provided, it will be treated as the recursive option, and a string will be taken as ignore.prefix.
 * @param {number} __d only used internally, don't provide this unless you want to break it
 * @returns {Object} extracted data object */
Object.prototype.rextract = function(options, __d) {
    return __rextract(this, options, __d);
};

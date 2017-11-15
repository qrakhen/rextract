const base = {
    recursive: false,
    treatArrayAsRecursion: false,
    depth: -1,
    ignore: {
        prefix: [],
        keys: [],
        types: [ 'undefined' ],
        null: true
    },
    step: false
};

function __merge(a, b) {
    var r = {};
    for (var k in a) {
        if (typeof b[k] == 'undefined') r[k] = a[k];
        else if (typeof b[k] == 'object') r[k] = __merge(a[k], b[k]);
        else r[k] = b[k];
        if (Array.isArray(a[k]) && !Array.isArray(r[k])) r[k] = [r[k]];
    }
    return r;
}

function merge(options) {
    if (!options) options = {};
    return __merge(base, options);
}

module.exports = merge;

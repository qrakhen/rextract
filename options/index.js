const base = {
    recursive: true,
    treatArrayAsRecursion: false,
    depth: -1,
    ignore: {
        prefix: [],
        keys: [],
        types: [ 'undefined' ],
        null: true
    },
    pre: false,
    each: false
};

function __merge(a, b) {
    var r = {};
    for (var k in a) {
        if (typeof b[k] == 'undefined') r[k] = a[k];
        else if (typeof b[k] == 'object' && !Array.isArray(b[k])) r[k] = __merge(a[k], b[k]);
        else r[k] = b[k];
        if (Array.isArray(a[k]) && !Array.isArray(r[k])) r[k] = (r[k] === false ? [] : [r[k]]);
    }
    return r;
}

function merge(options) {
    if (typeof options == 'undefined') options = {};
    else if (typeof options == 'boolean') options = { recursive: options };
    else if (typeof options == 'string') options = { ignore: { prefix: options }};
    for (var k in options) if (typeof base[k] == 'undefined') throw new Error('rextract: using unknown option value "' + k + '"\nplease refer to the readme for option usage.');
    return __merge(base, options);
}

module.exports = merge;

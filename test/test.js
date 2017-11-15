const assert = require('assert');
const rextract = require('../safe');

Object.defineProperty(this, 'dummy', {
    get: function() {
        return {
            veryCustomProperty: 'so special',
            publicInt: 5,
            publicString: 'public string',
            publicUndefined: undefined,
            publicNull: null,
            __privateInt: 20,
            __privateString: 'private string',
            publicObject: {
                public: 10,
                __private: 40,
                deepObject: {
                    public: 20,
                    __private: 80,
                    superDeep: {
                        __veryDark: true
                    }
                }
            },
            publicFunction: function() { },
            __privateFunction: function() { }
        };
    }
});

describe('rextract()', () => {
    it('export everything but undefined and null, no recursion', () => {
        var result = rextract(this.dummy, false);
        assert.equal(7, Object.keys(result).length);
        assert.equal('undefined', typeof result.publicObject);
    });
    it('export everything but null, undefined and properties that start with __', () => {
        var result = rextract(this.dummy, '__');
        assert.equal(5, Object.keys(result).length);
        assert.equal('undefined', typeof result.__privateString);
    });
    it('export everything but null and undefined, with recursion', () => {
        var result = rextract(this.dummy);
        assert.equal(8, Object.keys(result).length);
        assert.equal('object', typeof result.publicObject);
    });
    it('export everything but null and undefined, with recursion but maximum depth 2', () => {
        var result = rextract(this.dummy, {
            depth: 2
        });
        assert.equal('object', typeof result.publicObject.deepObject);
        assert.equal('undefined', typeof result.publicObject.deepObject.superDeep)
    });
    it('export default options, but double every number using step callback', () => {
        var result = rextract(this.dummy, {
            each: (k, v, o) => {
                if (typeof v == 'number') return v * 2;
                else return v;
            }
        });
        assert.equal(10, result.publicInt);
    });
    it('should return every single property by always returning true inside the pre() callback', () => {
        var result = rextract(this.dummy, {
            recursive: false,
            pre: (k, v, o) => {
                return true;
            }
        });
        assert.equal(10, Object.keys(result).length);
    });
});

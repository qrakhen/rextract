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
                    __private: 80
                }
            },
            publicFunction: function() { },
            __privateFunction: function() { }
        };
    }
});

describe('rextract() [SAFE], = require(\'rextract/safe\')', () => {
    it('should return an extracted object containing all properties that are primitive, not null and not undefined by default\n' +
        '-> rextract(object);', () => {
        var result = rextract(this.dummy);
        assert.equal(5, Object.keys(result).length);
        assert.equal(undefined, result.publicObject);
    });
    it('should return an extracted object containing primitives and all child objects including their primitives when recursive = true\n' +
        '-> rextract(object, true);', () => {
        var result = rextract(this.dummy, true);
        assert.equal(6, Object.keys(result).length);
        assert.equal('object', typeof result.publicObject);
    });
    it('should return an extracted object containing all public primitives, skipping those with given prefix ignorePrefix = \'__\'\n' +
        '-> rextract(object, false, \'__\');', () => {
        var result = rextract(this.dummy, false, '__');
        assert.equal(3, Object.keys(result).length);
        assert.equal('undefined', typeof result.__privateInt);
    });
    it('should return an extracted object containing all primitives except for all keys defined with ignoreKeys = [ \'veryCustomProperty\' ]\n' +
        '-> rextract(object, false, false, [\'veryCustomProperty\');', () => {
        var result = rextract(this.dummy, false, false, [ 'veryCustomProperty' ]);
        assert.equal(4, Object.keys(result).length);
        assert.equal('undefined', typeof result.veryCustomProperty);
    });
    it('should return nothing at all when providing an iterator callback that always returns null:\n' +
        '-> rextract(object, false, false, false, (k, v, o) => { return null; });', () => {
        var result = rextract(this.dummy, false, false, false, (k, v, o) => { return null; });
        assert.equal(0, Object.keys(result).length);
    });
    it('should return an object that only contains properties that are real and less than 40 including those of all child objects when using a custom callback and recursive = true:\n' +
        '-> rextract(object, true, false, false, (k, v, o) => {\nif (typeof v == \'number\') return (v < 40 ? v : null);\nelse return null;\n});', () => {
        var result = rextract(this.dummy, true, false, false, (k, v, o) => {
            if (typeof v == 'number') return (v < 40 ? v : null);
            return null;
        });
        assert.equal(3, Object.keys(result).length);
        assert.equal(10, result.publicObject.public);
    });
});

require('../');

describe('Object.prototype.rextract() [POTENTIALLY UNSAFE] but so cool, = require(\'rextract\')', () => {
    it('should return an extracted object containing all properties that are primitive, not null and not undefined by default\n' +
        '-> object.rextract();', () => {
        var result = this.dummy.rextract();
        assert.equal(5, Object.keys(result).length);
        assert.equal(undefined, result.publicObject);
    });
    it('should return an extracted object containing primitives and all child objects including their primitives when recursive = true\n' +
        '-> object.rextract(true);', () => {
        var result = this.dummy.rextract(true);
        assert.equal(6, Object.keys(result).length);
        assert.equal('object', typeof result.publicObject);
    });
    it('should return an extracted object containing all public primitives, skipping those with given prefix ignorePrefix = \'__\'\n' +
        '-> object.rextract(false, \'__\');', () => {
        var result = this.dummy.rextract(false, '__');
        assert.equal(3, Object.keys(result).length);
        assert.equal('undefined', typeof result.__privateInt);
    });
    it('should return an extracted object containing all primitives except for all keys defined with ignoreKeys = [ \'veryCustomProperty\' ]\n' +
        '-> object.rextract(false, false, [\'veryCustomProperty\');', () => {
        var result = this.dummy.rextract(false, false, [ 'veryCustomProperty' ]);
        assert.equal(4, Object.keys(result).length);
        assert.equal('undefined', typeof result.veryCustomProperty);
    });
    it('should return nothing at all when providing an iterator callback that always returns null:\n' +
        '-> object.rextract(false, false, false, (k, v, o) => { return null; });', () => {
        var result = this.dummy.rextract(false, false, false, (k, v, o) => { return null; });
        assert.equal(0, Object.keys(result).length);
    });
    it('should return an object that only contains properties that are real and less than 40 including those of all child objects when using a custom callback and recursive = true:\n' +
        '-> object.rextract(true, false, false, (k, v, o) => {\nif (typeof v == \'number\') return (v < 40 ? v : null);\nelse return null;\n});', () => {
        var result = this.dummy.rextract(true, false, false, (k, v, o) => {
            if (typeof v == 'number') return (v < 40 ? v : null);
            return null;
        });
        assert.equal(3, Object.keys(result).length);
        assert.equal(10, result.publicObject.public);
    });
});

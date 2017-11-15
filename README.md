# rextract

Rextract is a very simple library written in JavaScript that provides a single function to extract data
from any object, with
 - optional and smart recursion
 - simulated and customizable public/private behaviour using your own naming conventions (i.e. user.__privateName vs. user.displayName)
 - maximum configuration possibilities
 - an iteration callback to fully customize the extraction behaviour step by step.

### Usage
Please scroll down for an in depth usage guide!

```
npm install --save rextract
```

```
require('rextract');
var data = object.rextract(options);
```

#### Please Note
When requiring rextract normally, ` Object.prototype ` will be overwritten.
This can be very unsafe but also convenient - if you get weird errors from other packages, use ` require('rextract/safe') ` instead.
```
// with Object.prototype method
require('rextract');
var data = object.extract();

// with safe method
const rextract = require('rextract/safe');
var data = rextract(object);
```

#### Options
Default options for all possible settings:
```
{
    recursive: true,            // whether to extract child objects too
    arrayIsRecursion: false     // whether an array is treated as recursion (objects inside arrays are still treated as recursion)
    depth: -1,                  // maximum object depth, -1 = none/infinite, 0 in case you want nothing in return (literally {}), 1 for the first layer, and so on.
    ignore: {                   // you may also provide simple strings instead of arrays here
        prefix: [],             // prefix(-es) to identify and ignore 'private' properties
        keys: [],               // explicit keys to be ignored
        types: [ 'undefined' ], // explicit types to be ignored
        null: true              // whether null-values should be ignored
    },
    pre: false,                 // pre-filter callback, executed before any other filters, expected to return true/false, overrides rules and forces the property to be written
    each: false                 // "for-each" manipulation callback, executed after all checks are done (function(key, value, object) { }) check the readme for more information about those callbacks
}
```

For your convience, you can alternatively provide either a boolean or a string instead, to cover the most frequent cases:
```
object.rextract(false); // will disable recursion (and true would enable it, but that feels slightly redundant)
object.rextract('__');  // will be treated as ignore.prefix, so ['__', 'private', 'secret'] would work, too
```

### In-depth implementation example
##### (totally realistic)

Let's say we have a user object including a few weird things so I can cover most cases:
```
var user = {
    displayName: 'Creative Username',
    __userName: 'UserLoginName',
    age: 27,
    friends: [ 'Jeff', 'Dave', 'Jane', 'Max', { name: 'Special Snowflake' }],
    house: {
        __location: {
            city: 'England', // so funny right, haha
            zip: 1337,
            geo: {
                lng: 12.345678,
                lat: 87.654321
            }
        },
        kitchen: null,
        door: undefined,
        secretBasementStash: 'so secret!'
    },
    eat: function(food) {
        console.log('nom nom, ' + food + '!');
    },
    bool: true
};
```

Yes, weird user data. Let's get into it:
```
require('rextract');

// extract all data except for undefined / null values
var data = user.rextract();
data.eat(data.house.location.city); // "nom nom, England!"

// extract first-level data only, including arrays but excluding objects in arrays (see options.arrayIsRecursion)
var flat = user.rextract(false);  
flat.eat(flat.house); // "nom nom, undefined!"

// extract 'public' values only, by defining private values by starting with '__'
var publicData = user.rextract('__');
data.eat(data.__userName); // "nom nom, undefined!"

// that's it for the easy part.
// rextract() doesnt just accept booleans or strings, but also the previously defined option object!
var hide = user.rextract({
    ignore: {
        prefix: '__', // hide all __private stuff, but what's that?
        keys: [ 'secretBasementStash' ], // our user forgot to add his prefix! easy, we just hide it manually.
        types: [ 'function' ]
    }
});
// hide now looks like this:
    {
        displayName: 'Creative Username',
        age: 27,
        friends: [ 'Jeff', 'Dave', 'Jane', 'Max', { name: 'Special Snowflake' } ],
        house: {
            door: undefined // door is now passed through because we have overwritten the default ignore.types option
        },
        bool: true
    }

// callbacks: pre & each
// the options object also accepts two callback functions:
//
// pre(key, value, object)
// pre is called before any filters are applied and for every single key. pre is expected to return a boolean.
// if true is returned, the current property will ignore all further checks (except for the each() callback) and be passed into the result data.
// see it as a whitelist as opposed to ignore.keys
//
// each(key, value, object)
// each is called after all checks are done and will only be invoked for valid items.
// other than pre, this callback is expected to return a value, which will be taken for that key.
//
// let's create our final config, which will...
//  * double all the things,
//  * concatinate all his friends into one big monster,
//  * and provide his house with a digestive system

var chaos = user.rextract({
    each: function(key, value, object) {
        if (typeof value == 'number') return value * 2;
        else if (key == 'friends') return value.slice(0, 4).join('').toUpperCase();
        else if (key == 'house') return object.eat;
        else return value;
    }
});

// this is what we get:
{ displayName: 'Creative Username',
  __userName: 'UserLoginName',
  age: 54,
  friends: 'JEFFDAVEJANEMAX',
  house: [Function: eat],
  eat: [Function: eat],
  bool: true }
```

Please don't call my package useless, that hurts my feelings.

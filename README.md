# rextract

Rextract is a very simple library written in JavaScript that provides a single function to extract data 
from any object, with
 - optional and smart recursion
 - simulated and customizable public/private behaviour using your own naming conventions (i.e. user.__privateName vs. user.displayName)
 - maximum configuration possibilities
 - an iteration callback to fully customize the extraction behaviour step by step.

### Important Notice
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

### Basic Usage
```
//
    
```

    

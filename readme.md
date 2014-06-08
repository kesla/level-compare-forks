# level-compare-forks

Automatically configure level-db (including choosing the best distribution)

[![NPM](https://nodei.co/npm/level-compare-forks.png?downloads&stars)](https://nodei.co/npm/level-compare-forks/)

[![NPM](https://nodei.co/npm-dl/level-compare-forks.png)](https://nodei.co/npm/level-compare-forks/)

## Installation

```
npm install level-compare-forks
```

## Example

### Input

```javascript
var async = require('async')
  , compare = require('./compare')

compare(
    {
        setup: function (db, callback) {
          var count = 0

          async.whilst(
              function () { return count < 1000 }
            , function (done) {
                count++
                db.put('hello-' + count, require('crypto').randomBytes(1000), done)
              }
            , callback
          )
        }
      , fn: function (db, callback) {
          var stream = db.createReadStream()

          stream.once('end', callback)
          stream.resume()
        }
    }
  , function (err, result) {
      console.log('Result')
      console.log(result.toString())
    }
)
```

### Output

```
Result
level-hyper x 17.35 ops/sec ±0.86% (52 runs sampled)
level       x 17.10 ops/sec ±0.78% (51 runs sampled)
level-basho x 17.46 ops/sec ±0.76% (52 runs sampled)
level-lmdb  x 19.05 ops/sec ±0.98% (47 runs sampled)
```

## Licence

Copyright (c) 2014 David Björklund

This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

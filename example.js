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
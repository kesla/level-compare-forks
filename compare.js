var async = require('async')
  , Benchmark = require('benchmark')
  , extend = require('xtend')
  , rimraf = require('rimraf')
  , tmpdir = require('os').tmpdir()

  , defaultOpts = {
        setup: function (db, callback) { callback(null) }
    }

  , pad = function (str) {
      while(str.length < 11)
        str = str + ' '

      return str
    }

  , setupDb = function (name, opts) {
      return function (callback) {
        var dbdir = tmpdir + '/level-autoconf-' + name

        rimraf(dbdir, function (err) {
          if (err) return callback(err)

          var db = require(name)(dbdir)

          db.once('ready', function () {
            opts.setup(db, function (err) {
              callback(err, db)
            })
          })
        })
      }
    }

  , setupDbs = function (opts, callback) {
      async.parallel({
          level: setupDb('level', opts)
        , 'level-basho': setupDb('level-basho', opts)
        , 'level-hyper': setupDb('level-hyper', opts)
        , 'level-lmdb': setupDb('level-lmdb', opts)
      }, callback)
    }

  , benchmark = function (dbs, opts, callback) {
      var tasks = {}

      Object.keys(dbs).forEach(function (key) {
        var db = dbs[key]
          , benchOpts = {
                defer: true
              , maxTime: 3
              , fn: function (deffered) {
                  opts.fn(db, deffered.resolve.bind(deffered))
                }
            }

        tasks[key] = function (done) {
          new Benchmark(pad(key), benchOpts)
            .on('complete', function (event) {
              done(null, event)
            })
            .run({
              async:true
            })
        }
      })

      async.series(tasks, callback)
    }

  , autoconf = function (opts, callback) {
      opts = extend(defaultOpts, opts)

      setupDbs(opts, function (err, dbs) {
        if (err) return callback(err)

        benchmark(dbs, opts, function (err, result) {
          if (err) return callback(err)

          callback(
              null
            , {
                  result: result
                , toString: function () {
                    return Object.keys(result).map(function (key) {
                      return result[key].target.toString()
                    }).join('\n')
                  }
              }
          )
        })
      })
    }

module.exports = autoconf
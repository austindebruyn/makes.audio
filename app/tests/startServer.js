const express = require('express')

module.exports = function startServer() {
  var server;

  beforeEach(function (done) {
    app = express()

    Promise.resolve(app)
      .then(require('../lib/middleware'))
      .then(require('../lib/routes'))
      .then(require('../lib/boot'))
      .then(function (s) {
        server = s
        return done()
      })
  })

  afterEach(function () {
    server.close()
  })
}

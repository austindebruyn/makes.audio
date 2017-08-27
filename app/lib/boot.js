const winston = require('winston')
const config = require('../config')

module.exports = function (app) {
  return new Promise(function (resolve) {
    app.listen(config.app.listenPort, function () {
      winston.log('info', `listening on ${config.app.listenPort}`)
    })

    resolve(app)
  })
}

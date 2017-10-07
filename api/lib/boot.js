const winston = require('winston')
const config = require('../config')

module.exports = function (app) {
  return app.listen(config.app.listenPort, function () {
    winston.log('info', `listening on ${config.app.listenPort}`)
  })
}

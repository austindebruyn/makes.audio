const winston = require('winston')
const config = require('../config')

module.exports = function (app) {
  return new Promise(function (resolve) {
    const server = app.listen(config.app.listenPort, function () {
      const transports = config.app.logging ? [new winston.transports.Console()] : []
      winston.configure({ transports })
      winston.log('info', `listening on ${config.app.listenPort}`)
    })

    resolve(server)
  })
}

const config = require('../config')
const Raven = require('raven')
const winston = require('winston')

module.exports = function errorHandler(err, req, res, next) {
  winston.log('error', err)

  if (config.app.sentry.secret) {
    Raven.captureException(err)
  }

  if (req.accepts('html')) {
    return next(err)
  }
  return res.status(500).json({ ok: false })
}

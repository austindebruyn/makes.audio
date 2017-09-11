const config = require('../config')
const Raven = require('raven')

module.exports = function errorHandler(err, req, res, next) {
  if (config.app.sentry.secret) {
    Raven.captureException(err)
  }

  if (req.accepts('html')) {
    return next(err)
  }
  return res.status(500).json({ ok: false })
}

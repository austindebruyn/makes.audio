const Raven = require('raven')

module.exports = function errorHandler(err, req, res, next) {
  Raven.captureException(err)

  if (req.accepts('html')) {
    return next(err)
  }
  return res.status(500).json({ ok: false })
}

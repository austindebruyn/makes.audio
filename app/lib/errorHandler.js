module.exports = function errorHandler(err, req, res, next) {
  if (req.accepts('html')) {
    return next(err)
  }
  return res.status(500).json({ ok: false })
}

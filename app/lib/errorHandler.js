module.exports = function errorHandler(err, req, res, next) {
  if (req.accepts('json')) {
    return res.status(500).json({ ok: false })
  }
  return next(err)
}

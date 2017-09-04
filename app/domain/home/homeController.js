module.exports.index = function (req, res, next) {
  if (req.user) {
    return req.user.toJSON().then(function (json) {
      return res.render('index', { user: json })
    }).catch(next)
  }
  return res.render('index')
}

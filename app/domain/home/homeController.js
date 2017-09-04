module.exports.index = function (req, res) {
  const promise = req.user ? req.user.toJSON : () => Promise.resolve(null)

  return promise().then(function (user) {
    return res.render('index', { user })
  })
}

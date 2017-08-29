module.exports.index = function (req, res) {
  const user = req.user ? { id: req.user.id, username: req.user.username } : null

  return res.render('index', {
    flash: req.session.flash || {},
    user: user
  })
}

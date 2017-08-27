const auth = require('../services/auth')

module.exports.create = function (req, res, next) {
  auth.authenticate(function (err, user, info) {
    if (err) throw err
    if (!user) {
      return res.status(400).json({
        ok: false,
        errors: ['Wrong username or password']
      })
    }
    req.login(user, function (err) {
      if (err) throw err

      return res.json({
        ok: true,
        user: {
          id: user.id,
          username: user.username
        }
      })
    })
  })(req, res, next)
}

module.exports.destroy = function (req, res) {
  req.logout()
  return res.json({ ok: true }) // .redirect('/')
}

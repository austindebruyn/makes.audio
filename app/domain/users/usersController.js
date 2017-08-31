const User = require('./User')
const createUser = require('./createUser')

module.exports.create = function (req, res) {
  const {
    inviteCode,
    username,
    password,
    password2,
  } = req.body

  createUser.createUser({
    username, password, password2, inviteCode
  }).then(function (user) {
    req.login(user, function (err) {
      if (err) throw err
      return res.json({
        ok: true,
        user: user.toJSON()
      })
    })
  }).catch(function (err) {
    if (err.name === 'UserCreationError') {
      return res.status(422).json({ ok: false, errors: [err.toJSON()] })
    }
    // throw to bug tracker
    return res.status(500).json({ ok: false })
  })
}

module.exports.get = function (req, res) {
  console.log('hey')
  return res.json(req.user.toJSON())
}

module.exports.update = function (req, res) {
  console.log('hey')

  return res.json('fuck u')
}

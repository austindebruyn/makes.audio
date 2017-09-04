const createUser = require('./createUser')
const updateUser = require('./updateUser')

module.exports.create = function (req, res, next) {
  const {
    inviteCode,
    username,
    password,
    password2
  } = req.body

  return createUser.createUser({
    username, password, password2, inviteCode
  })
    .then(function (user) {
      req.login(user, function (err) {
        if (err) throw err

        return user
          .toJSON()
          .then(json => res.json({ ok: true, user: json }))
          .catch(function (err) {
            throw err;
          })
      })
    })
    .catch(function (err) {
      if (err.name === 'UserCreationError') {
        return res.status(422).json({ ok: false, errors: [err.toJSON()] })
      }
      return next(err)
    })
}

module.exports.get = function (req, res, next) {
  return req.user.toJSON()
    .then(user => res.json(user))
    .catch(next)
}

module.exports.update = function (req, res, next) {
  return updateUser.updateUser({
    user: req.user,
    attributes: req.body
  })
    .then(user => user.toJSON())
    .then(function (user) {
      return res.json({ ok: true, user })
    })
    .catch(function (err) {
      if (err.name === 'UserUpdateError') {
        return res.status(422).json({ ok: false, errors: [err.toJSON()] })
      }
      return next(err)
    })
}

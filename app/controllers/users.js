const User = require('../models').User
const InviteCode = require('../models').InviteCode
const bcrypt = require('bcrypt')

module.exports.create = function (req, res) {
  var username = req.body.username
  var password = req.body.password
  var password2 = req.body.password2
  var inviteCode = req.body.inviteCode

  var inviteCodeModel = null
  var userModel = null

  new Promise(function (resolve, reject) {
    if (password !== password2) {
      return reject(new Error('match'))
    }
    return resolve()
  })
    .then(function () {
      return InviteCode.findOne({ where: { code: inviteCode } })
    })
    .then(function (invite) {
      if (invite == null) {
        throw new Error('bad invite')
      }
      if (invite.userId !== null) {
        throw new Error('invite taken')
      }
      inviteCodeModel = invite
    })
    .then(function () {
      return User.count({ where: { username: username } })
    })
    .then(function (ct) {
      if (ct > 0) {
        throw new Error('dupe')
      }
      return bcrypt.genSalt(10)
    })
    .then(function (salt) {
      return bcrypt.hash(password, salt)
    })
    .then(function (hash) {
      return User.create({ username: username, password: hash })
    })
    .then(function (user) {
      userModel = user
      return inviteCodeModel.update({ userId: userModel.id })
    })
    .then(function () {
      req.login(userModel, function (err) {
        if (err) throw err
        return res.json({
          ok: true,
          user: {
            id: userModel.id,
            username: userModel.username
          }
        })
      })
    })
    .catch(function (err) {
      const errors = []

      if (err.name === 'SequelizeValidationError') {
        err.errors.forEach(function (e) {
          errors.push(`Something was wrong with the ${e.path} you entered.`)
        })
      }
      if (err.message === 'dupe') {
        errors.push(`The username ${username} is taken!`)
      }
      if (err.message === 'match') {
        errors.push("Those passwords don't seem to match.")
      }
      if (err.message === 'bad invite') {
        errors.push(`Invite code ${inviteCode} isn't valid!`)
      }
      if (err.message === 'invite taken') {
        errors.push(`The invite code ${inviteCode} already taken!`)
      }
      return res.status(422).json({ errors: errors })
    })
}

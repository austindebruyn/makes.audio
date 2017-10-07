const _ = require('lodash')
const User = require('./User')
const EmailPreferences = require('../emailPreferences/EmailPreferences')
const InviteCode = require('../inviteCodes/InviteCode')
const hashPasswords = require('./passwords').hash
const sendVerificationEmail = require('../emailPreferences/sendVerificationEmail')
const uid = require('uid-safe')

class UserCreationError extends Error {
  constructor(code, data = {}) {
    super()
    this.name = 'UserCreationError'
    this.code = code
    Object.assign(this, data)
  }

  toJSON() {
    if (this.fields) {
      return { code: this.code, fields: this.fields }
    }
    return { code: this.code }
  }
}

module.exports.createUser = function createUser(data) {
  const {
    inviteCode,
    username,
    email,
    password,
    password2
  } = data

  return new Promise(function (resolve, reject) {
    var inviteCodeModel = null
    var state = {}

    return new Promise(function (resolve, reject) {
      if (password !== password2) {
        return reject(new UserCreationError('PASSWORDS_DONT_MATCH'))
      }
      if (!password) {
        return reject(new UserCreationError('MISSING_PASSWORD'))
      }
      if (!(email && email.match(/^.+@.+$/))) {
        return reject(new UserCreationError('BAD_EMAIL'))
      }
      return resolve()
    })
      .then(function () {
        return InviteCode.findOne({ where: { code: inviteCode } })
      })
      .then(function (invite) {
        if (invite == null) {
          throw new UserCreationError('NONEXISTANT_INVITE')
        }
        if (invite.userId !== null) {
          throw new UserCreationError('USED_INVITE')
        }
        inviteCodeModel = invite
      })
      .then(function () {
        return User.count({ where: { username } })
      })
      .then(function (ct) {
        if (ct > 0) {
          throw new UserCreationError('USERNAME_NOT_UNIQUE')
        }
        return hashPasswords(password)
      })
      .then(function (password) {
        return User.create({ username, email, password })
      })
      .then(function (user) {
        state.user = user
        return inviteCodeModel.update({ userId: state.user.id })
      })
      .then(() => uid(24))
      .then(function (verificationCode) {
        return EmailPreferences.create({ userId: state.user.id, verificationCode })
      })
      .then(function (model) {
        model.user = state.user
        return sendVerificationEmail.sendVerificationEmail(model)
      })
      .then(function () {
        return resolve(state.user)
      })
      .catch(function (err) {
        if (err.name === 'SequelizeValidationError') {
          return reject(new UserCreationError('VALIDATION', { fields: _.map(err.errors, 'path') }))
        }
        return reject(err)
      })
  })
}

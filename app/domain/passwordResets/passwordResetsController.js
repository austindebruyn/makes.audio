const User = require('../users/User')
const PasswordReset = require('./PasswordReset')
const uid = require('uid-safe')
const passwordUtils = require('../users/passwords')
const sendEmail = require('../../jobs/sendEmail')

class PasswordResetCreationError extends Error {
  constructor(code, data = {}) {
    super()
    this.name = 'PasswordResetCreationError'
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

module.exports.create = function (req, res, next) {
  const { email } = req.body

  return new Promise(function (resolve, reject) {
    if (typeof email !== 'string' || email.length < 1) {
      return reject(new PasswordResetCreationError('MISSING_EMAIL'))
    }

    const state = {}

    return User.findOne({ where: { email } })
      .then(function (user) {
        if (!user) {
          throw new PasswordResetCreationError('INVALID_EMAIL')
        }
        state.userId = user.id
        return uid(24)
      })
      .then(function (code) {
        return PasswordReset.create({ code, userId: state.userId })
      })
      .then(resolve)
      .catch(reject)
  })
    .then(function (model) {
      return sendEmail.queue(email, 'Password reset for makes.audio', 'password-reset', {
        passwordResetId: model.id
      })
    })
    .then(function () {
      return res.json({ ok: true })
    })
    .catch(function (err) {
      if (err.name === 'PasswordResetCreationError') {
        return res.status(422).json({ ok: false, errors: [err.toJSON()] })
      }
      return next(err)
    })
}

module.exports.complete = function (req, res, next) {
  const { code, password, password2 } = req.body

  const state = {}

  return new Promise(function (resolve, reject) {
    if (!code) {
      return reject(new PasswordResetCreationError('MISSING_CODE'))
    }
    if (!password) {
      return reject(new PasswordResetCreationError('MISSING_PASSWORD'))
    }
    if (password !== password2) {
      return reject(new PasswordResetCreationError('PASSWORDS_DONT_MATCH'))
    }

    return PasswordReset.findOne({ where: { code }, include: [User] })
      .then(function (model) {
        state.passwordReset = model
        if (!model) {
          throw new PasswordResetCreationError('INVALID_CODE')
        }
        if (model.claimedAt) {
          throw new PasswordResetCreationError('CODE_ALREADY_USED')
        }
        return model.user
      })
      .then(resolve)
      .catch(reject)
  })
    .then(function (user) {
      state.user = user
      return new Promise(function (resolve, reject) {
        req.login(user, function (err) {
          if (err) return reject(err)
          return resolve()
        })
      })
    })
    .then(function () {
      state.passwordReset.claimedAt = new Date()
      return state.passwordReset.save()
    })
    .then(function () {
      return passwordUtils.hash(password)
    })
    .then(function (hash) {
      state.user.password = hash
      return state.user.save()
    })
    .then(() => state.user.toJSON())
    .then(function (json) {
      return res.json({ ok: true, user: json })
    })
    .catch(function (err) {
      if (err.name === 'PasswordResetCreationError') {
        return res.status(422).json({ ok: false, errors: [err.toJSON()] })
      }
      return next(err)
    })
}

const EmailPreferences = require('./EmailPreferences')
const User = require('../users/User')
const sendVerificationEmail = require('./sendVerificationEmail')

class EmailPreferencesError extends Error {
  constructor(code, data = {}) {
    super()
    this.name = 'EmailPreferencesError'
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

module.exports.get = function (req, res, next) {
  return EmailPreferences.findOne({ where: { userId: req.user.id } })
    .then(function (record) {
      if (record === null) {
        throw new EmailPreferencesError('NOT_FOUND')
      }
      return record.toJSON()
    })
    .then(function (json) {
      return res.json({
        ok: true,
        record: json
      })
    })
    .catch(function (err) {
      if (err.name === 'EmailPreferencesError') {
        if (err.code === 'NOT_FOUND') {
          return res.status(404).json({
            ok: false
          })
        }
      }
      return next(err)
    })
}

module.exports.sendVerificationEmail = function (req, res, next) {
  return EmailPreferences.findOne({ where: { userId: req.user.id }, include: [User] })
    .then(function (model) {
      if (!model) {
        throw new EmailPreferencesError('NOT_FOUND')
      }
      return sendVerificationEmail.sendVerificationEmail(model)
    })
    .then(function () {
      return res.json({ ok: true })
    })
    .catch(function (err) {
      if (err.name === 'EmailPreferencesError') {
        if (err.code === 'NOT_FOUND') {
          return res.status(404).json({ ok: false })
        }
      }
      return next(err)
    })
}

module.exports.update = function (req, res, next) {
  const {
    action,
    verificationCode
  } = req.body

  const state = {}

  function errorHandler(err) {
    if (err.name === 'EmailPreferencesError') {
      return res.status(422).json({ ok: false, errors: [err.toJSON()] })
    }
    return next(err)
  }

  function successHandler() {
    return state.model.toJSON()
      .then(function (json) {
        return res.json({
          ok: true,
          record: json
        })
      })
  }

  switch (action) {
    case 'verify':
      return EmailPreferences.findOne({ where: { verificationCode } })
        .then(model => state.model = model)
        .then(() => verifyEmail(state.model, verificationCode))
        .then(successHandler)
        .catch(errorHandler)
    default:
      return errorHandler(new EmailPreferencesError('NO_ACTION'))
  }
}

/**
 * Promises to update the model with the provided verificationCode.
 * @param  {EmailPreferences} model
 * @param  {String}           verificationCode
 * @return {Promise}
 */
function verifyEmail(model, verificationCode) {
  return new Promise(function (resolve, reject) {
    if (typeof verificationCode === 'undefined') {
      return reject(new EmailPreferencesError('MISSING_CODE'))
    }
    if (!model) {
      return reject(new EmailPreferencesError('BAD_CODE'))
    }
    if (model.verificationCode !== verificationCode) {
      return reject(new EmailPreferencesError('BAD_CODE'))
    }
    if (model.verifiedAt) {
      return reject(new EmailPreferencesError('ALREADY_VERIFIED'))
    }

    model.verifiedAt = new Date()
    return model.save()
      .then(resolve)
      .catch(reject)
  })
}

const _ = require('lodash')
const passwordUtils = require('./passwords')
const User = require('./User')
const EmailPreferences = require('../emailPreferences/EmailPreferences')
const sendVerificationEmail = require('../emailPreferences/sendVerificationEmail')

class UserUpdateError extends Error {
  constructor(code, data = {}) {
    super()
    this.name = 'UserUpdateError'
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

/**
 * Promises to update the indicated field on the user model.
 * @param  {User}   user
 * @param  {String} key
 * @param  {any}    value
 * @param  {Object} [opts={}]
 * @return {Promise}
 */
module.exports.updateAttribute = function updateAttribute(user, key, value, opts = {}) {
  return new Promise(function (resolve, reject) {
    if (key === 'password') {
      if (!opts.verifiedCurrentPassword) {
        throw new UserUpdateError('WRONG_PASSWORD')
      }

      return passwordUtils.hash(value)
        .then(function (hash) {
          user[key] = hash
          return resolve(user)
        })
        .catch(reject)
    }

    user[key] = value
    return resolve(user)
  })
}

function verifyPassword(user, password) {
  if (!password) return Promise.resolve(false)
  return passwordUtils.verify(password, user.password)
}

module.exports.updateUser = function updateUser({ user, attributes = {} }) {
  return new Promise(function (resolve, reject) {
    const attributeKeys = Object.keys(attributes)

    if (attributeKeys.length < 1) {
      return reject(new UserUpdateError('NO_ATTRIBUTES'))
    }

    const allowedAttributes = [
      'username',
      'email',
      'password',
      'currentPassword'
    ]

    const forbiddenAttributes = _.difference(attributeKeys, allowedAttributes)
    if (forbiddenAttributes.length > 0) {
      return reject(new UserUpdateError('BAD_ATTRIBUTES', { fields: forbiddenAttributes }))
    }

    return verifyPassword(user, attributes.currentPassword)
      .then(function (verifiedCurrentPassword) {
        return Promise.all(attributeKeys.map(function (key) {
          return exports.updateAttribute(user, key, attributes[key], { verifiedCurrentPassword })
        }))
      })
      .then(function () {
        return user.save()
      })
      .then(function () {
        if (attributeKeys.includes('email')) {
          var emailPreferences = null

          return EmailPreferences.findOne({ where: { userId: user.id }, include: [ User ] })
            .then(function (record) {
              emailPreferences = record
              emailPreferences.verifiedAt = null
              return emailPreferences.save()
            })
            .then(function () {
              return sendVerificationEmail.sendVerificationEmail(emailPreferences)
            })
        }
        return null
      })
      .then(function () {
        return user
      })
      .then(resolve)
      .catch(reject)
  })
}

const EmailPreferences = require('./EmailPreferences')
const sendEmail = require('../../jobs/sendEmail')
const buildUrl = require('../../lib/buildUrl')
const uid = require('uid-safe')

function sendVerificationEmail(model) {
  return new Promise(function (resolve, reject) {
    const state = {}

    if (!model.user) {
      return reject(new Error('[sendVerificationEmail] EmailPreferences model does not have user preloaded')
    }

    return uid(24)
      .then(function (code) {
        model.verificationCode = code
        return model.save()
      })
      .then(function () {
        const href = buildUrl(`/users/me/emailPreferences/verify?code=${model.verificationCode}`)

        return sendEmail({
          to: email,
          subject: 'Please verify your email',
          template: 'verify-email',
          values: {
            username: model.user.username,
            href
          }
        })
      })
      .then(resolve)
      .catch(reject)
  })
}

module.exports = {
  sendVerificationEmail
}

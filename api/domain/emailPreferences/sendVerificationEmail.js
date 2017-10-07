const sendEmail = require('../../jobs/sendEmail')
const buildUrl = require('../../lib/buildUrl')

function sendVerificationEmail(model) {
  return new Promise(function (resolve, reject) {
    if (!model.user) {
      const msg = 'EmailPreferences model does not have user preloaded'
      return reject(new Error(`[sendVerificationEmail] ${msg}`))
    }

    const href = buildUrl(`/users/me/emailPreferences/verify?verificationCode=${model.verificationCode}`)

    return sendEmail({
      to: model.user.email,
      subject: 'Please verify your email',
      template: 'verify-email',
      values: {
        username: model.user.username,
        href
      }
    }).then(resolve).catch(reject)
  })
}

module.exports = {
  sendVerificationEmail
}

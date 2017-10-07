const config = require('../config')

module.exports.get = function get() {
  if (process.env.NODE_ENV !== 'test' && !config.app.mailgun.key) {
    throw new Error('No mailgun API key. Is the app in test mode?')
  }

  return require('mailgun-js')({
    apiKey: config.app.mailgun.key,
    domain: config.app.mailgun.domain
  })
}

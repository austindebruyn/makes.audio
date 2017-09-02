const querystring = require('querystring')
const Cookie = require('express-session/session/cookie')
const signature = require('cookie-signature')
const config = require('../config')
const sessionStore = require('../lib/sessionStore')
const User = require('../domain/users/User')
const cookiejar = require('./cookiejar')

function buildOrGetUser(user) {
  return new Promise(function (resolve) {
    if (user instanceof User.Instance) {
      return resolve(user)
    }
    return User.create(user).then(resolve)
  })
}

module.exports = function (user) {
  return buildOrGetUser(user).then(function (user) {
    return new Promise(function (resolve) {
      const signed = 's:' + signature.sign('magickey', config.app.sessionSecret)
      sessionStore.set('magickey', { passport: { user: user.id }, cookie: new Cookie() }, function (err) {
        cookiejar.add('connect.sid', signed)
        return resolve(signed)
      })
    })
  })
}

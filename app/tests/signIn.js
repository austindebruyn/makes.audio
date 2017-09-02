const Cookie = require('express-session/session/cookie')
const sessionStore = require('../lib/sessionStore')
const querystring = require('querystring')
const signature = require('cookie-signature')
const config = require('../config')
const User = require('../domain/users/User')
const cookiejar = require('./cookiejar')
const factory = require('./factory')
const uid = require('uid-safe')

function buildOrGetUser(user={}) {
  return new Promise(function (resolve, reject) {
    if (user instanceof User.Instance) {
      return resolve(user)
    }
    return factory.create('user', user)
      .then(resolve)
      .catch(reject)
  })
}

module.exports = function (userAttributes) {
  var userId

  return buildOrGetUser(userAttributes)
    .then(function (user) {
      userId = user.id
      return uid(24)
    })
    .then(function (sessionId) {
      return new Promise(function (resolve) {
        const signed = 's:' + signature.sign(sessionId, config.app.sessionSecret)

        sessionStore.set(sessionId, { passport: { user: userId }, cookie: new Cookie() }, function (err) {
          cookiejar.add('connect.sid', signed)
          return resolve(signed)
        })
      })
    })
    .catch(function (err) {
      console.error(err)
    })
}

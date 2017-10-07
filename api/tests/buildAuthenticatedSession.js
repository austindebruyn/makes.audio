const Cookie = require('express-session/session/cookie')
const sessionStore = require('../lib/sessionStore')
const signature = require('cookie-signature')
const config = require('../config')
const User = require('../domain/users/User')
const factory = require('./factory')
const uid = require('uid-safe')

function buildOrGetUser(user = {}) {
  return new Promise(function (resolve, reject) {
    if (user instanceof User) {
      return resolve(user)
    }
    return factory.create('user', user)
      .then(resolve)
      .catch(reject)
  })
}

function buildAuthenticatedSession(userAttributes) {
  var user

  return buildOrGetUser(userAttributes)
    .then(function (model) {
      user = model
      return uid(24)
    })
    .then(function (sessionId) {
      return new Promise(function (resolve, reject) {
        const signed = 's:' + signature.sign(sessionId, config.app.sessionSecret)

        sessionStore.set(sessionId, { passport: { user: user.id }, cookie: new Cookie() }, function (err) {
          if (err) return reject(err)

          return resolve({
            cookie: {
              name: 'connect.sid',
              value: signed
            },
            user
          })
        })
      })
    })
}

module.exports = buildAuthenticatedSession

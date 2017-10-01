/* global afterEach */

const cookiejar = require('./cookiejar')
const buildAuthenticatedSession = require('./buildAuthenticatedSession')

signIn.user = null

afterEach(function () {
  signIn.user = null
})

function signIn(userAttributes) {
  return buildAuthenticatedSession(userAttributes)
    .then(function ({ cookie, user }) {
      const { name, value } = cookie
      signIn.user = user
      cookiejar.add(name, value)
    })
    .catch(function (err) {
      console.error(err)
    })
}

module.exports = signIn

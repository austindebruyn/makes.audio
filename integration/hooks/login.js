const buildAuthenticatedSession = require('../../app/tests/buildAuthenticatedSession')

global.login = function login(userAttributes) {
  beforeEach(function () {
    return buildAuthenticatedSession(userAttributes)
      .then(function ({ user, cookie }) {
        browser.url('/')

        return browser.deleteCookie().then(function () {
        return browser.setCookie(cookie)
      })
    })
  })
}

const buildAuthenticatedSession = require('../../api/tests/buildAuthenticatedSession')

global.login = function login(userAttributes) {
  beforeEach(function () {
    return buildAuthenticatedSession(userAttributes)
      .then(function ({ user, cookie }) {
        login.user = user
        browser.url('/')

        return browser.deleteCookie().then(function () {
        return browser.setCookie(cookie)
      })
    })
  })
}

const { expect } = require('chai')
const factory = require('../api/tests/factory')
const User = require('../api/domain/users/User')

describe('settings', function () {
  describe('when already logged in', function () {
    login({ username: 'austin', email: 'austin@cool.net' })

    beforeEach(function () {
      return factory.create('emailPreferences', { userId: login.user.id })
    })
    
    it('should let me change username', function () {
      browser.url('/settings')
      browser.waitForExist('.user-form')

      const usernameTitleSelector = '.settings-page .user-info-card h2'
      const usernameInputSelector = '.user-form input[name=username]'

      const usernameTitle = browser.element(usernameTitleSelector)
      const usernameInputElement = browser.element(usernameInputSelector)

      expect(usernameTitle.getText()).to.eql('austin')

      usernameInputElement.setValue('brittney')
      expect(browser.click('.user-form form:first-child button'))

      browser.waitForEnabled(usernameInputSelector)

      expect(browser.getText('.alert')).to.eql('GREAT!You’ve been updated.')
      expect(usernameTitle.getText()).to.eql('brittney')

      return User.count({ where: { username: 'brittney' } })
        .then(function (count) {
          expect(count).to.eql(1)
        })
    })

    it('should let me change email', function () {
      browser.url('/settings')
      browser.waitForExist('.user-form')

      const emailInputSelector = '.user-form input[name=email]'
      const emailInputElement = browser.element(emailInputSelector)

      expect(emailInputElement.getValue()).to.eql('austin@cool.net')

      emailInputElement.setValue('naptime@zzz.com')
      expect(browser.click('.user-form form:first-child button'))

      browser.waitForEnabled(emailInputSelector)

      expect(browser.getText('.alert')).to.eql('GREAT!You’ve been updated.')
      expect(emailInputElement.getValue()).to.eql('naptime@zzz.com')

      return User.findOne({ where: { username: 'austin' } })
        .then(function (user) {
          expect(user.email).to.eql('naptime@zzz.com')
        })
    })
  })
})

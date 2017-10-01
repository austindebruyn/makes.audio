const { expect } = require('chai')

describe('dashboard', function () {
  describe('when already logged in', function () {
    login()

    it('should show me dashboard', function () {
      browser.url('/')

      browser.waitForExist('.dashboard')
    })
  })
})

const { expect } = require('chai')
const path = require('path')

const FIXTURES_FILE_PATH = path.join(__dirname, '../api/tests/fixtures/files')
const mp3filePath = path.join(FIXTURES_FILE_PATH, 'chicken.mp3')

describe('dashboard', function () {
  describe('when already logged in', function () {
    login()

    it('should show me dashboard', function () {
      browser.url('/')
      browser.waitForExist('.dashboard')
    })
    
    xit('should let me upload', function () {
      browser.url('/')

      browser.chooseFile('.dashboard-upload-card input[type=file]', mp3filePath)

      const value = browser.getValue('.dashboard-upload-card input[type=file]')
      expect(value).to.match(/chicken\.mp3$/)

      browser.waitForExist('.dashboard-audio-list-item')

      const expected = [
        'chicken.mp3',
        'no description',
        'UPLOADED A FEW SECONDS AGO4MIN 50SEC'
      ].join('\n')

      expect(browser.getText('.dashboard-audio-list-item')).to.eql(expected)
      expect(browser.getText('.alert')).to.eql('GREAT!chicken.mp3 is uploaded.')
    })

    xit('should not let me upload duplicate', function () {
      browser.url('/')
      browser.chooseFile('.dashboard-upload-card input[type=file]', mp3filePath)
      browser.waitForExist('.dashboard-audio-list-item')
      browser.chooseFile('.dashboard-upload-card input[type=file]', mp3filePath)

      browser.waitForExist('.alert.alert-danger')

      expect(browser.getText('.alert.alert-danger')).to.eql(
        'OOPS!You already have a file called that!')
      expect(browser.elements('.dashboard-audio-list-item').value)
        .to.have.length(1)
    })
  })
})

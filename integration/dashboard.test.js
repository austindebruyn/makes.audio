const { expect } = require('chai')
const path = require('path')
const factory = require('../api/tests/factory')
const Audio = require('../api/domain/audios/Audio')

const FIXTURES_FILE_PATH = path.join(__dirname, '../api/tests/fixtures/files')
const mp3filePath = path.join(FIXTURES_FILE_PATH, 'chicken.mp3')

describe('dashboard', function () {
  describe('when already logged in', function () {
    login()

    it('should show me dashboard', function () {
      browser.url('/')
      browser.waitForExist('.dashboard')

      const actual = browser.getText('.dashboard .dashboard-zero-data-state')
      const zdsText = [
        'NOTHING HERE',
        'You haven’t uploaded anything yet. Drag a file onto this page to ' +
        'get started!'
      ].join('\n')

      expect(actual).to.eql(zdsText)
    })
    
    xit('should let me upload', function () {
      browser.url('/')

      browser.chooseFile('.dashboard-upload-card input[type=file]', mp3filePath)

      browser.waitForExist('.dashboard-audio-list-item')

      const expected = [
        'chicken.mp3',
        'no description',
        'UPLOADED A FEW SECONDS AGO4MIN 50SEC'
      ].join('\n')

      expect(browser.getText('.dashboard-audio-list-item')).to.eql(expected)
      expect(browser.getText('.alert')).to.eql('GREAT!chicken.mp3 is uploaded.')
      
      const value = browser.getValue('.dashboard-upload-card input[type=file]')
      expect(value).to.eql('')
    })

    xit('should let me upload duplicate', function () {
      browser.url('/')
      browser.chooseFile('.dashboard-upload-card input[type=file]', mp3filePath)
      browser.waitForExist('.dashboard-audio-list-item')
      browser.chooseFile('.dashboard-upload-card input[type=file]', mp3filePath)

      browser.waitForExist('.dashboard-audio-list-item:nth-child(2)')

      const expected = [
        'chicken-1.mp3',
        'no description',
        'UPLOADED A FEW SECONDS AGO4MIN 50SEC'
      ].join('\n')

      expect(browser.getText('.dashboard-audio-list-item:nth-child(2)'))
        .to.eql(expected)

      expect(browser.getText('.alert')).to.eql([
        'GREAT!chicken-1.mp3 is uploaded.',
        'GREAT!chicken.mp3 is uploaded.'
      ])
    })

    describe('when already have audios', function () {
      beforeEach(function () {
        return factory.create('audio', {
          userId: login.user.id,
          url: 'elephant.mp3'
        })
      })

      it('should let me edit', function () {
        browser.url('/')
        browser.waitForExist('.dashboard')

        const audioTextSelector = '.dashboard-audio-list .title'
        expect(browser.getText(audioTextSelector)).to.include('elephant.mp3')

        const editPencilSelector = '.dashboard-audio-list-item a .fa-pencil'
        expect(browser.isVisible(editPencilSelector)).to.be.false

        browser.moveToObject(audioTextSelector)

        expect(browser.isVisible(editPencilSelector)).to.be.true

        browser.click(editPencilSelector)
        browser.waitForExist('.title input')

        browser.setValue('.title input', 'bigelephant.mp3')
        browser.submitForm('.title form')

        browser.waitForVisible('.alert')

        const expected = 'GREAT!bigelephant.mp3 has been updated.'
        expect(browser.getText('.alert')).to.eql(expected)
        expect(browser.isExisting('.title input')).to.be.false

        return Audio.findOne({ where: { userId: login.user.id } })
          .then(record => {
            expect(record.url).to.eql('bigelephant.mp3')
          })
      })
    })
  })
})

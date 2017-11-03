const getAudioLength = require('./getAudioLength')
const expect = require('chai').expect
const sinon = require('sinon')
const queue = require('kue').createQueue()
const ffprobe = require('../domain/audios/ffprobe')
const factory = require('../tests/factory')

describe.only('getAudioLength', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  describe('#process', function () {
    beforeEach(function () {
      return getAudioLength({ audioId: 100 })
        .then(() => {
          this.job = queue.testMode.jobs[0]
          this.sandbox.stub(this.job, 'log')
        })
    })

    it('should err if no audio', function () {
      return getAudioLength.process(this.job, function (err) {
        expect(err).to.include({
          message: 'no such audio 100'
        })
      })
    })

    describe('when audio exists', function () {
      beforeEach(function () {
        return factory.create('audio', { id: 100 })
          .then(record => {
            this.audio = record
          })
      })

      describe('when ffprobe fails', function () {
        beforeEach(function () {
          this.sandbox.stub(ffprobe, 'ffprobe').rejects({
            message: 'could not find file'
          })
        })

        it('should log', function () {
          return getAudioLength.process(this.job, function (err) {
            expect(err).to.include({
              message: 'could not find file'
            })
          })
        })
      })

      describe('when ffprobe succeeds', function () {
        describe('with wrong data', function () {
          beforeEach(function () {
            this.sandbox.stub(ffprobe, 'ffprobe').resolves({})
          })

          it('should log', function () {
            return getAudioLength.process(this.job, err => {
              expect(this.job.log).to.have.been.calledWith(sinon.match.object)
              expect(err).to.include({
                message: '`ffData.format.duration` does not exist.'
              })
            })
          })
        })

        describe('with correct data', function () {
          beforeEach(function () {
            this.sandbox.stub(ffprobe, 'ffprobe').resolves({
              format: {
                duration: 250
              }
            })
          })

          it('should log', function () {
            return getAudioLength.process(this.job, function (err) {
              expect(err).to.be.null
            })
            .then(() => {
              const expected = 'Setting audio.duration to 250'
              expect(this.job.log).to.have.been.calledWith(expected)

              return this.audio.reload()
            })
            .then(() => {
              expect(this.audio.duration).to.eql(250)
            })
          })
        })
      })
    })
  })
})

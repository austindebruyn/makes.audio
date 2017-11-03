const _ = require('lodash')
const expect = require('chai').expect
const Audio = require('./Audio')
const clock = require('../../tests/clock')
const createAudio = require('./createAudio')
const factory = require('../../tests/factory')
const path = require('path')
const fs = require('fs-extra')
const config = require('../../config')
const sinon = require('sinon')
const getUniqueUrl = require('./getUniqueUrl')
const queue = require('kue').createQueue()

describe('createAudio', function () {
  clock()

  const temporaryFilename = 'tmp/uploads/tempfile'
  const fixtureAudioFile = path.resolve(__dirname, '../..', 'tests/fixtures/files/chicken.mp3')

  const file = {
    fieldname: 'file',
    originalname: 'chicken.mp3',
    encoding: '7bit',
    mimetype: 'audio/mpeg',
    destination: 'tmp/uploads/',
    filename: 'tempfile',
    path: temporaryFilename,
    size: 7971
  }

  function cleanUpAudioFiles() {
    return Audio.findAll({})
      .then(function (audios) {
        return Promise.all(audios.map(function (audio) {
          const filename = path.resolve(__dirname, '../..', 'store', audio.hash)
          return fs.exists(filename)
            .then(exists => exists && fs.unlink(filename))
        }))
      })
  }

  beforeEach(function () {
    return factory.create('user')
      .then(model => this.user = model)
      .then(() => fs.copy(fixtureAudioFile, temporaryFilename))
  })

  afterEach(function () {
    return fs.exists(temporaryFilename)
      .then(exists => exists && fs.unlink(temporaryFilename))
      .then(() => cleanUpAudioFiles())
  })

  it('should return NO_FILE', function () {
    return createAudio.createAudio({
      user: this.user
    }).catch(function (err) {
      expect(err.code).to.eql('NO_FILE')
    })
  })

  it('should return FILE_TOO_LARGE', function () {
    return createAudio.createAudio({
      user: this.user,
      file: { ...file, size: 99999999 }
    }).catch(function (err) {
      expect(err.code).to.eql('FILE_TOO_LARGE')
      expect(err.maxSize).to.eql(20971520)
    })
  })

  it('should return BAD_MIMETYPE', function () {
    return createAudio.createAudio({
      user: this.user,
      file: Object.assign({}, file, { mimetype: 'text/html' })
    }).catch(function (err) {
      expect(err.code).to.eql('BAD_MIMETYPE')
      expect(err.allowedMimetypes).to.eql(config.audio.allowedMimetypes)
    })
  })

  it('should build a unique url', function () {
    return Audio.create({
      userId: this.user.id,
      hash: '761592f7b8525f3bbdc7c9ee4f6ede66c2f3cad5080f65007f08e62621796038',
      filename: 'ce1ab481bae4da836acb6e902554f0ed378742dc6687f906f26bdc7bca76fab1',
      originalName: 'chicken.mp3',
      url: 'chicken.mp3',
      mimetype: 'audio/mpeg',
      visible: true,
      size: 7971
    }).then(() => {
      return createAudio.createAudio({ user: this.user, file })
    })
    .then(function (audio) {
      expect(audio.url).to.eql('chicken-1.mp3')
    })
  })

  it('should create a model', function () {
    return createAudio.createAudio({
      file,
      user: this.user
    }).then(audio => {
      expect(_.pick(audio, audio.attributes)).to.eql({
        id: 1,
        createdAt: new Date('2017-08-31T00:00:00.000Z'),
        updatedAt: new Date('2017-08-31T00:00:00.001Z'),
        hash: '761592f7b8525f3bbdc7c9ee4f6ede66c2f3cad5080f65007f08e62621796038',
        filename: 'c8e48cbcc8cca0332186e9742330114ddbd5aa892b9f9513bcf79e2a142461fa',
        originalName: 'chicken.mp3',
        url: 'chicken.mp3',
        mimetype: 'audio/mpeg',
        visible: true,
        size: 7971,
        userId: this.user.id,
        duration: void 0
      })
    })
  })

  it('should queue job to fetch duration', function () {
    return createAudio.createAudio({ file, user: this.user }).then(audio => {
      const job = queue.testMode.jobs[0]

      expect(job).to.have.property('type', 'ffprobe')
      expect(job.data).to.eql({ audioId: audio.id })
    })
  })

  describe('when errors before processing the file', function () {
    it('should remove temporary file', function () {
      return createAudio.createAudio({
        file: Object.assign({}, file, { size: 99999999 }),
        user: this.user
      })
      .catch(_.noop)
      .then(function () {
        return fs.exists(temporaryFilename)
      })
      .then(function (exists) {
        expect(exists).to.be.false
      })
    })
  })

  describe('when errors during processing the file', function () {
    beforeEach(function () {
      sinon.stub(createAudio, 'hashTemporaryFile').rejects()
    })

    afterEach(function () {
      createAudio.hashTemporaryFile.restore()
    })

    it('should remove temporary file', function () {
      return createAudio.createAudio({
        file, user: this.user
      })
      .catch(_.noop)
      .then(function () {
        return fs.exists(temporaryFilename)
      })
      .then(function (exists) {
        expect(exists).to.be.false
      })
    })
  })
})

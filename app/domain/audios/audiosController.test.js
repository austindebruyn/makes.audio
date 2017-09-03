const audiosController = require('./audiosController')
const agent = require('../../tests/agent')
const clock = require('../../tests/clock')
const signIn = require('../../tests/signIn')
const expect = require('chai').expect
const sinon = require('sinon')
const factory = require('../../tests/factory')
const createAudio = require('./createAudio')
const path = require('path')
const fs = require('fs')
const Audio = require('./Audio')

describe('audiosController', function () {
  var sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  })

  afterEach(function () {
    sandbox.restore()
  })

  clock()

  describe('GET /api/AUDIOS', function () {
    it('when signed out should 403', function () {
      return agent()
        .get('/api/audios')
        .expect(403)
    })

    describe('when signed in', function () {
      beforeEach(function () {
        return signIn()
      })

      it('should return empty array', function () {
        return agent()
          .get('/api/audios')
          .cookiejar()
          .expect(200, {
            ok: true,
            records: []
          })
      })

      it('should return some audios', function () {
        return factory
          .createMany('audio', 5, { userId: signIn.user.id })
          .then(models => {
            return Promise.all(models.map(m => m.toJSON()))
          })
          .then(function (records) {
            return agent()
              .get('/api/audios')
              .cookiejar()
              .expect(200)
              .then(function (res) {
                expect(res.body.ok).to.be.true;
                expect(res.body.records).to.have.deep.members(records)
              })
        })
      })
    })
  })

  describe('POST /api/audios', function () {
    it('when signed out should 403', function () {
      return agent()
        .post('/api/audios')
        .expect(403)
    })

    describe('when signed in', function () {
      beforeEach(function () {
        return signIn()
      })

      it('should invoke createAudio', function () {
        sandbox.spy(createAudio, 'createAudio')

        const filename = path.resolve(__dirname, '../..', 'tests/fixtures/files/chicken.mp3')

        return agent()
          .post('/api/audios')
          .cookiejar()
          .attach('file', filename)
          .then(function () {
            expect(createAudio.createAudio).to.have.been.calledWith({
              user: sinon.match(actual => actual.id === signIn.user.id),
              file: {
                fieldname: 'file',
                originalname: 'chicken.mp3',
                encoding: '7bit',
                mimetype: 'audio/mpeg',
                destination: 'tmp/uploads/',
                filename: sinon.match.string,
                path: sinon.match.string,
                size: 7971
              }
            })
          })
      })

      it('should succeed', function () {
        const filename = path.resolve(__dirname, '../..', 'tests/fixtures/files/chicken.mp3')

        return agent()
          .post('/api/audios')
          .cookiejar()
          .attach('file', filename)
          .expect(201)
          .then(function (res) {
            expect(res.body.ok).to.be.true;
            expect(res.body.audio).to.include({
              id: 1,
              createdAt: 'Wed Aug 30 2017 17:00:00 GMT-0700 (PDT)',
              editUrl: '/audios/1/edit',
              formattedSize: '0.01MB',
              mimetype: 'audio/mpeg',
              originalName: 'chicken.mp3',
              size: 7971,
              updateUrl: '/api/audios/1',
              url: 'chicken.mp3',
              visible: true
            })
            expect(res.body.audio.downloadUrl).to.be.a('string');
            expect(res.body.audio.publicUrl).to.be.a('string');
            return Audio.findOne({ where: { id: res.body.audio.id } })
          })
          .then(function (audio) {
            const filename = path.resolve(__dirname, '../..', 'store', audio.hash)

            return new Promise(function (resolve, reject) {
              fs.stat(filename, function (err, stat) {
                if (err) return reject(err)
                return resolve(stat)
              })
            })
          })
          .then(function (stat) {
            expect(stat.size).to.eql(7971)
          })
      })

      it('should return errors', function () {
        return agent()
          .post('/api/audios')
          .cookiejar()
          .expect(422, {
            ok: false,
            errors: [{ code: 'NO_FILE' }]
          })
      })

      it('should 500 when createAudio errors', function () {
        sandbox.stub(createAudio, 'createAudio').rejects()

        return agent()
          .post('/api/audios')
          .accept('application/json')
          .cookiejar()
          .expect(500, {
            ok: false
          })
      })
    })
  })
})

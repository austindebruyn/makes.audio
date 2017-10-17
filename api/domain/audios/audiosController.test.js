const audiosController = require('./audiosController')
const agent = require('../../tests/agent')
const clock = require('../../tests/clock')
const signIn = require('../../tests/signIn')
const expect = require('chai').expect
const fs = require('fs-extra')
const sinon = require('sinon')
const factory = require('../../tests/factory')
const createAudio = require('./createAudio')
const path = require('path')
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

  describe('GET /api/audios', function () {
    it('when signed out should 403', function () {
      return agent()
        .get('/api/audios')
        .accept('application/json')
        .expect(403)
    })

    describe('when signed in', function () {
      beforeEach(function () {
        return signIn()
      })

      it('should return empty array', function () {
        return agent()
          .get('/api/audios')
          .accept('application/json')
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
              .accept('application/json')
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
        .accept('application/json')
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
          .accept('application/json')
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

      it('should return errors', function () {
        return agent()
          .post('/api/audios')
          .accept('application/json')
          .cookiejar()
          .expect(422, {
            ok: false,
            errors: [{ code: 'NO_FILE' }]
          })
      })

      describe('when createAudio succeeds', function () {
        beforeEach(function () {
          sandbox.spy(createAudio, 'createAudio')
        })

        it('should create', function () {
          const filename = path.resolve(__dirname, '../..', 'tests/fixtures/files/chicken.mp3')

          return agent()
            .post('/api/audios')
            .accept('application/json')
            .cookiejar()
            .attach('file', filename)
            .expect(201)
            .then(function (res) {
              expect(res.body.ok).to.be.true;
              expect(res.body.audio).to.include({
                id: 1,
                createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
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
              return fs.stat(path.resolve(__dirname, '../..', 'store', audio.filename))
            })
            .then(function (stat) {
              expect(stat.size).to.eql(7971)
            })
        })

        it('should remove temporary file', function () {
          const filename = path.resolve(__dirname, '../..', 'tests/fixtures/files/chicken.mp3')

          return agent()
            .post('/api/audios')
            .accept('application/json')
            .cookiejar()
            .attach('file', filename)
            .expect(201)
            .then(function () {
              const filepath = createAudio.createAudio.args[0][0].file.path
              const temporaryFilename = path.resolve(__dirname, '../../..', filepath)
              return fs.stat(temporaryFilename)
            })
            .catch(function (err) {
              expect(err.code).to.eql('ENOENT')
            })
        })
      })

      describe('when createAudio errors', function () {
        const filename = path.resolve(__dirname, '../..', 'tests/fixtures/files/chicken.mp3')

        beforeEach(function () {
          sandbox.spy(createAudio, 'createAudio')
          sandbox.stub(createAudio, 'hashTemporaryFile').rejects()
        })

        it('should 500', function () {
          return agent()
            .post('/api/audios')
            .accept('application/json')
            .cookiejar()
            .attach('file', filename)
            .expect(500, {
              ok: false
            })
        })

        it('should remove temporary file', function () {
          return agent()
            .post('/api/audios')
            .accept('application/json')
            .cookiejar()
            .attach('file', filename)
            .expect(500)
            .then(function () {
              const filepath = createAudio.createAudio.args[0][0].file.path
              const temporaryFilename = path.resolve(__dirname, '../../..', filepath)
              return fs.exists(temporaryFilename)
            })
            .then(function (exists) {
              expect(exists).to.be.false
            })
        })
      })
    })
  })

  // describe.only('GET /<url>', function () {
  //   beforeEach(function () {
  //     return factory.create('user', { username: 'ludwig' })
  //       .then(user => factory.create('audio', { url: 'ode', userId: user.id }))
  //   })

  //   it('should return the file', function () {
  //     // supertest does not support GETs with subdomains
  //     const req = {
  //       subdomains: ['ludwig'],
  //       host: 'test-makes.audio',
  //       port: 8000,
  //       path: '/ode'
  //     }
  //     const res = {
  //       download: sinon.spy(),
  //       writeHeader: sinon.spy()
  //     }
  //     const next = sinon.spy()

  //     audiosController.get(req, res, next)
  //   })
  // })
})

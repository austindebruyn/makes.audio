const audiosController = require('./audiosController')
const agent = require('../../tests/agent')
const clock = require('../../tests/clock')
const signIn = require('../../tests/signIn')
const expect = require('chai').expect
const fs = require('fs-extra')
const sinon = require('sinon')
const factory = require('../../tests/factory')
const AudioCreator = require('./AudioCreator')
const updateAudio = require('./updateAudio')
const deleteAudio = require('./deleteAudio')
const path = require('path')
const Audio = require('./Audio')
const User = require('../users/User')

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

      it('should not return deleted audios', function () {
        return factory
          .create('audio', { userId: signIn.user.id, deletedAt: new Date() })
          .then(function () {
            return agent()
              .get('/api/audios')
              .accept('application/json')
              .cookiejar()
              .expect(200)
              .then(function (res) {
                expect(res.body.ok).to.be.true;
                expect(res.body.records).to.be.empty
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

      it('should invoke AudioCreator', function () {
        sandbox.stub(AudioCreator.prototype, 'perform')

        const filename = path.resolve(__dirname, '../..', 'tests/fixtures/files/chicken.mp3')

        return agent()
          .post('/api/audios')
          .accept('application/json')
          .cookiejar()
          .attach('file', filename)
          .then(function () {
            expect(AudioCreator.prototype.perform).to.have.been.calledWith({
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

      describe('when AudioCreator succeeds', function () {
        beforeEach(function () {
          this.audio = factory.create('audio')
          sandbox.stub(AudioCreator.prototype, 'perform').resolves(this.audio)
        })

        it('should create', async function () {
          const filename = path.resolve(__dirname, '../..', 'tests/fixtures/files/chicken.mp3')

          const res = await agent()
            .post('/api/audios')
            .accept('application/json')
            .cookiejar()
            .attach('file', filename)
            .expect(201)
          expect(res.body.ok).to.be.true;
          expect(res.body.audio).to.include({
            id: 1,
            createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
          })
          const performArgs = AudioCreator.prototype.perform.args[0][0]
          expect(performArgs.file.originalname).to.eql('chicken.mp3')
          expect(performArgs.user.id).to.eql(signIn.user.id)
        })
      })

      describe('when AudioCreator errors', function () {
        const filename = path.resolve(__dirname, '../..', 'tests/fixtures/files/chicken.mp3')

        beforeEach(function () {
          sandbox.stub(AudioCreator.prototype, 'perform').rejects()
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
      })
    })
  })

  describe('PATCH /api/audios/:id', function () {
    beforeEach(function () {
      return factory.create('audio')
        .then(audio => this.audio = audio)
    })

    it('when signed out should 403', function () {
      return agent()
        .patch(`/api/audios/${this.audio.id}`, {})
        .accept('application/json')
        .expect(403)
    })

    describe('when signed in', function () {
      beforeEach(function () {
        return this.audio.getUser().then(signIn)
      })

      describe('when updateAudio succeeds', function () {
        beforeEach(function () {
          sandbox.spy(updateAudio, 'updateAudio')
        })
        
        it('should invoke updateAudio', function () {
          return agent()
            .patch(`/api/audios/${this.audio.id}`)
            .accept('application/json')
            .cookiejar()
            .send({ url: 'bones.wav' })
            .expect(202)
            .then(() => {
              expect(updateAudio.updateAudio).to.have.been.calledWith(
                sinon.match(actual => actual.id === signIn.user.id),
                sinon.match(actual => actual.id === this.audio.id),
                { url: 'bones.wav' }
              )
            })
        })
                
        it('should return user errors', function () {
          return factory.create('audio', { url: 'bones.wav', userId: signIn.user.id })
            .then(() => {
              return agent()
                .patch(`/api/audios/${this.audio.id}`)
                .accept('application/json')
                .cookiejar()
                .send({ url: 'bones.wav' })
                .expect(422, {
                  ok: false,
                  errors: [{ code: 'URL_NOT_UNIQUE' }]
                })
            })
        })
      })

      describe('when updateAudio errors', function () {
        beforeEach(function () {
          sandbox.stub(updateAudio, 'updateAudio').rejects()
        })

        it('should 500', function () {
          return agent()
            .patch(`/api/audios/${this.audio.id}`)
            .accept('application/json')
            .cookiejar()
            .send({ url: 'bones.wav' })
            .expect(500, {
              ok: false
            })
        })
      })
    })
  })

  describe('DELETE /api/audios/:id', function () {
    beforeEach(function () {
      return factory.create('audio')
        .then(audio => this.audio = audio)
    })

    it('when signed out should 403', function () {
      return agent()
        .delete(`/api/audios/${this.audio.id}`)
        .accept('application/json')
        .expect(403)
    })

    describe('when signed in', function () {
      beforeEach(function () {
        return this.audio.getUser().then(signIn)
      })

      describe('when deleteAudio succeeds', function () {
        beforeEach(function () {
          sandbox.spy(deleteAudio, 'deleteAudio')
        })
        
        it('should invoke deleteAudio', function () {
          return agent()
            .delete(`/api/audios/${this.audio.id}`)
            .accept('application/json')
            .cookiejar()
            .expect(202)
            .then(() => {
              expect(deleteAudio.deleteAudio).to.have.been.calledWith(
                sinon.match(actual => actual.id === signIn.user.id),
                sinon.match(actual => actual.id === this.audio.id)
              )
            })
        })
      })

      describe('when deleteAudio errors', function () {
        beforeEach(function () {
          sandbox.stub(deleteAudio, 'deleteAudio').rejects()
        })

        it('should 500', function () {
          return agent()
            .delete(`/api/audios/${this.audio.id}`)
            .accept('application/json')
            .cookiejar()
            .expect(500, {
              ok: false
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

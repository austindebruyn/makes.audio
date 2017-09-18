const passwordResetsController = require('./passwordResetsController')
const PasswordReset = require('./PasswordReset')
const passwordUtils = require('../users/passwords')
const agent = require('../../tests/agent')
const clock = require('../../tests/clock')
const signIn = require('../../tests/signIn')
const factory = require('../../tests/factory')
const queue = require('kue').createQueue()
const expect = require('chai').expect
const sinon = require('sinon')

describe('passwordResetsController', function () {
  var user

  clock()

  beforeEach(function () {
    return factory
      .create('user', { username: 'jhoffy', email: 'jhoffy@gmail.com' })
      .then(model => user = model)
  })

  describe('POST /api/passwordResets', function () {
    it('should 403 if signed in', function () {
      return signIn()
        .then(function () {
          return agent()
            .post('/api/passwordResets')
            .cookiejar()
            .accept('application/json')
            .expect(403)
        })
    })

    it('should error if no email', function () {
      return agent()
        .post('/api/passwordResets')
        .accept('application/json')
        .send({ email: '' })
        .expect(422, {
          ok: false,
          errors: [{ code: 'MISSING_EMAIL' }]
        })
    })

    it('should error if no user with that email', function () {
      return agent()
        .post('/api/passwordResets')
        .accept('application/json')
        .send({ email: 'ahofek@gmail.com' })
        .expect(422, {
          ok: false,
          errors: [{ code: 'INVALID_EMAIL' }]
        })
    })

    it('should create model', function () {
      return agent()
        .post('/api/passwordResets')
        .accept('application/json')
        .send({ email: 'jhoffy@gmail.com' })
        .expect(200, { ok: true })
        .then(function () {
          return PasswordReset.count({ where: { userId: user.id, claimedAt: null } })
            .then(ct => expect(ct).to.eql(1))
        })
    })

    it('should send the email', function () {
      return agent()
        .post('/api/passwordResets')
        .accept('application/json')
        .send({ email: 'jhoffy@gmail.com' })
        .then(function () {
          return PasswordReset.findOne({ where: {} })
        })
        .then(function (model) {
          expect(queue.testMode.jobs[0].data).to.eql({
            to: 'jhoffy@gmail.com',
            subject: 'Reset your makes.audio account',
            template: 'password-reset',
            values: {
              username: 'jhoffy',
              href: `https://makes.audio/passwordResets/complete?code=${model.code}`
            }
          })
        })
    })
  })

  describe('POST /api/passwordResets/complete', function () {
    it('should 403 if signed in', function () {
      return signIn()
        .then(function () {
          return agent()
            .post('/api/passwordResets')
            .cookiejar()
            .accept('application/json')
            .expect(403)
        })
    })

    it('should error if no code', function () {
      return agent()
        .post('/api/passwordResets/complete')
        .accept('application/json')
        .expect(422, {
          ok: false,
          errors: [{ code: 'MISSING_CODE' }]
        })
    })

    it('should error if missing password', function () {
      return agent()
        .post('/api/passwordResets/complete')
        .accept('application/json')
        .send({ code: 'PANDA' })
        .expect(422, {
          ok: false,
          errors: [{ code: 'MISSING_PASSWORD' }]
        })
    })

    it('should error if passwords dont match', function () {
      return agent()
        .post('/api/passwordResets/complete')
        .accept('application/json')
        .send({ code: 'PANDA', password: 'bananas88', password2: 'apricots!' })
        .expect(422, {
          ok: false,
          errors: [{ code: 'PASSWORDS_DONT_MATCH' }]
        })
    })

    it('should error if no such code', function () {
      return agent()
        .post('/api/passwordResets/complete')
        .accept('application/json')
        .send({ code: 'PANDA', password: 'bananas88', password2: 'bananas88' })
        .expect(422, {
          ok: false,
          errors: [{ code: 'INVALID_CODE' }]
        })
    })

    describe('when code exists but is used', function () {
      beforeEach(function () {
        return PasswordReset.create({ code: 'PANDA', claimedAt: new Date() })
      })

      it('should error if no such code', function () {
        return agent()
          .post('/api/passwordResets/complete')
          .accept('application/json')
          .send({ code: 'PANDA', password: 'bananas88', password2: 'bananas88' })
          .expect(422, {
            ok: false,
            errors: [{ code: 'CODE_ALREADY_USED' }]
          })
      })
    })

    describe('when code exists and hasnt been used', function () {
      beforeEach(function () {
        return PasswordReset.create({ code: 'MARIO', userId: user.id })
      })

      it('should return user and claim the model', function () {
        return agent()
          .post('/api/passwordResets/complete')
          .accept('application/json')
          .send({ code: 'MARIO', password: 'bananas88', password2: 'bananas88' })
          .expect(200, {
            ok: true,
            user: {
              id: 1,
              username: 'jhoffy',
              email: 'jhoffy@gmail.com',
              createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
              updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
            }
          })
          .then(function () {
            return PasswordReset.findOne({ where: { code: 'MARIO' }})
              .then(model => expect(model.claimedAt).to.eql(new Date()))
          })
      })

      it('should set the new password', function () {
        return agent()
          .post('/api/passwordResets/complete')
          .accept('application/json')
          .send({ code: 'MARIO', password: 'holidays', password2: 'holidays' })
          .then(function () {
            return user.reload()
              .then(({ password }) => passwordUtils.verify('holidays', password))
              .then(success => expect(success).to.be.true)
          })
      })

      it('should log me in', function () {
        return agent()
          .post('/api/passwordResets/complete')
          .accept('application/json')
          .send({ code: 'MARIO', password: 'holidays', password2: 'holidays' })
          .expect('Set-Cookie', /^connect.sid=/)
      })
    })
  })
})

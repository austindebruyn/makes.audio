const emailPreferencesController = require('./emailPreferencesController')
const EmailPreferences = require('./EmailPreferences')
const agent = require('../../tests/agent')
const clock = require('../../tests/clock')
const signIn = require('../../tests/signIn')
const queue = require('kue').createQueue()
const factory = require('../../tests/factory')
const expect = require('chai').expect
const sinon = require('sinon')

describe('emailPreferencesController', function () {
  clock()

  describe('GET /api/users/me/emailPreferences', function () {
    it('should 403 if signed out', function () {
      return agent()
        .get('/api/users/me/emailPreferences')
        .cookiejar()
        .accept('application/json')
        .expect(403)
    })

    it('should 404', function () {
      return signIn()
        .then(function () {
          return agent()
            .get('/api/users/me/emailPreferences')
            .cookiejar()
            .accept('application/json')
            .expect(404, { ok: false })
        })
    })

    describe('when emailPreferences exists', function () {
      beforeEach(function () {
        return factory.create('user').then(user => signIn(user)).then(function () {
          return factory.create('emailPreferences', { userId: signIn.user.id })
        })
      })

      it('should succeed', function () {
        return agent()
          .get('/api/users/me/emailPreferences')
          .cookiejar()
          .accept('application/json')
          .expect(200, {
            ok: true,
            record: {
              id: 1,
              userId: 1,
              createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
              updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
              optedOutAt: null,
              verifiedAt: null
            }
          })
      })
    })
  })

  describe('PATCH /api/users/me/emailPreferences', function () {
    var emailPreferences

    beforeEach(function () {
      return factory.create('user')
        .then(user => signIn(user))
        .then(function () {
          return factory.create('emailPreferences', { userId: signIn.user.id })
        })
        .then(function (model) {
          emailPreferences = model
        })
    })

    it('should error if no action', function () {
      return agent()
        .patch('/api/users/me/emailPreferences')
        .expect(422, {
          ok: false,
          errors: [{ code: 'NO_ACTION' }]
        })
    })

    describe('to verify email', function () {
      it('should error if bad code', function () {
        return agent()
          .patch('/api/users/me/emailPreferences')
          .accept('application/json')
          .send({ action: 'verify', verificationCode: 'asdfasdfasdfa' })
          .expect(422, {
            ok: false,
            errors: [{ code: 'BAD_CODE' }]
          })
      })

      it('should error if no code', function () {
        return agent()
          .patch('/api/users/me/emailPreferences')
          .accept('application/json')
          .send({ action: 'verify' })
          .expect(422, {
            ok: false,
            errors: [{ code: 'MISSING_CODE' }]
          })
      })

      describe('when verification code is correct', function () {
        beforeEach(function () {
          emailPreferences.verificationCode = 'jaksdfjlkasjdfksadf'
          return emailPreferences.save()
        })

        describe('but user has already verified email', function () {
          beforeEach(function () {
            emailPreferences.verifiedAt = new Date()
            return emailPreferences.save()
          })

          it('should error', function () {
            return agent()
              .patch('/api/users/me/emailPreferences')
              .accept('application/json')
              .send({ action: 'verify', verificationCode: 'jaksdfjlkasjdfksadf' })
              .expect(422, {
                ok: false,
                errors: [{ code: 'ALREADY_VERIFIED' }]
              })
          })
        })

        it('should succeed', function () {
          return agent()
            .patch('/api/users/me/emailPreferences')
            .accept('application/json')
            .send({ action: 'verify', verificationCode: 'jaksdfjlkasjdfksadf' })
            .expect(200, {
              ok: true,
              record: {
                id: 1,
                userId: 1,
                createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
                optedOutAt: null,
                updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
                verifiedAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
              }
            })
        })
      })
    })
  })

  describe('POST /api/users/me/emailPreferences/sendVerificationEmail', function () {
    it('should 403 if signed out', function () {
      return agent()
        .post('/api/users/me/emailPreferences/sendVerificationEmail')
        .cookiejar()
        .accept('application/json')
        .expect(403, { ok: false })
    })

    it('should 404 if no preferences', function () {
      return signIn()
        .then(function () {
          return agent()
            .post('/api/users/me/emailPreferences/sendVerificationEmail')
            .cookiejar()
            .accept('application/json')
            .expect(404, { ok: false })
        })
    })

    describe('when signed in', function () {
      var emailPreferences

      beforeEach(function () {
        return factory.create('user')
          .then(user => signIn(user))
          .then(function () {
            return factory.create('emailPreferences', { userId: signIn.user.id })
          })
          .then(function (model) {
            emailPreferences = model
          })
      })

      it('should send email', function () {
        return agent()
          .post('/api/users/me/emailPreferences/sendVerificationEmail')
          .cookiejar()
          .accept('application/json')
          .expect(200, { ok: true })
          .then(function () {
            const job = queue.testMode.jobs[0]

            expect(job).to.have.property('type', 'email')
            expect(job.data).to.eql({
              subject: 'Please verify your email',
              template: 'verify-email',
              to: signIn.user.email,
              values: {
                username: signIn.user.username,
                href: `https://makes.audio/users/me/emailPreferences/verify?verificationCode=${emailPreferences.verificationCode}`
              }
            })
          })
      })
    })
  })
})

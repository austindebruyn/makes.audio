const emailPreferencesController = require('./emailPreferencesController')
const EmailPreferences = require('./EmailPreferences')
const agent = require('../../tests/agent')
const clock = require('../../tests/clock')
const signIn = require('../../tests/signIn')
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
})

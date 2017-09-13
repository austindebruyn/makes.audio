const sessionsController = require('./sessionsController')
const signIn = require('../../tests/signIn')
const agent = require('../../tests/agent')
const User = require('../users/User')
const factory = require('../../tests/factory')
const clock = require('../../tests/clock')

describe('sessionsController', function () {
  clock()

  describe('POST /login', function () {
    it('should error for wrong username', function () {
      return agent()
        .post('/login')
        .send({ username: 'apples', password: 'bananas' })
        .expect(400, {
          ok: false,
          errors: [{ code: 'WRONG_USERNAME_OR_PASSWORD' }]
        })
    })

    describe('when username is right', function () {
      beforeEach(function () {
        return factory.create('user', {
          username: 'descarte',
          password: 'politics87',
          email: 'descarte@gov.gov'
        })
      })

      it('should error', function () {
        return agent()
          .post('/login')
          .send({ username: 'descarte', password: 'banana' })
          .expect(400, {
            ok: false,
            errors: [{ code: 'WRONG_USERNAME_OR_PASSWORD' }]
          })
      })

      it('should sign in', function () {
        return agent()
          .post('/login')
          .send({ username: 'descarte', password: 'politics87' })
          .expect(200, {
            ok: true,
            user: {
              id: 1,
              username: 'descarte',
              email: 'descarte@gov.gov',
              createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
              updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
            }
          })
      })
    })
  })

  describe('POST /logout', function () {
    beforeEach(function () {
      return signIn()
    })

    it('should sign user out', function () {
      return agent()
        .post('/logout')
        .expect(200)
    })
  })
})

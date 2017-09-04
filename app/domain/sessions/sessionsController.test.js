const sessionsController = require('./sessionsController')
const signIn = require('../../tests/signIn')
const agent = require('../../tests/agent')
const User = require('../users/User')

describe('sessionsController', function () {
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
        return User.create({
          username: 'descarte',
          password: '$2a$10$pJ.0U0o9fVzYQzlqMPNNXOyCEOCcTv1lQ7CrHVPx.5j6f32j.IB56'
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
              username: 'descarte'
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

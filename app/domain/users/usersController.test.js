const usersController = require('./usersController')
const createUser = require('./createUser')
const InviteCode = require('../inviteCodes/InviteCode')
const agent = require('../../tests/agent')
const clock = require('../../tests/clock')
const signIn = require('../../tests/signIn')
const request = require('supertest')
const expect = require('chai').expect
const sinon = require('sinon')

describe('usersController', function () {
  clock()

  beforeEach(function () {
    sinon.spy(createUser, 'createUser')
  })

  afterEach(function () {
    createUser.createUser.restore()
  })

  describe('POST /api/users', function () {
    it('should invoke createUser', function () {
      const postBody = {
        username: 'turkish',
        password: 'allegory',
        password2: 'fighter',
        inviteCode: 'cashmere'
      }
      return agent()
        .post('/api/users')
        .send(postBody)
        .then(function () {
          expect(createUser.createUser).to.have.been.calledWith(postBody)
        })
    })

    it('should return user and sign me in', function () {
      return InviteCode.create({ code: 'cashmere' })
        .then(function () {
          const postBody = {
            username: 'turkish',
            password: 'allegory',
            password2: 'allegory',
            inviteCode: 'cashmere'
          }
          return agent()
            .post('/api/users')
            .send(postBody)
            .expect(200, {
              ok: true,
              user: {
                id: 1,
                username:  'turkish',
                createdAt: '2017-08-31T00:00:00.000Z',
                updatedAt: '2017-08-31T00:00:00.001Z',
              }
            })
            .expect(function (res) {
              expect(res.headers).to.have.property('set-cookie')
            })
        })
    })

    it('should return errors', function () {
      return agent()
        .post('/api/users')
        .send({ username: 'hey', password: 'austin', password2: 'austin' })
        .expect(422, {
          ok: false,
          errors: [{ code: 'NONEXISTANT_INVITE' }]
        })
    })
  })

  describe('GET /api/users/me', function () {
    it('when signed out should 403', function () {
      return agent()
        .get('/api/users/me')
        .accept('application/json')
        .redirects(0)
        .expect(403)
    })

    describe('when signed in', function () {
      beforeEach(function () {
        return signIn({
          username: 'sasquatch',
          password: 'oogie',
          password2: 'oogie'
        })
      })

      it('should return my user on sign in', function () {
        return agent()
          .get('/api/users/me')
          .accept('application/json')
          .cookiejar()
          .redirects(0)
          .expect(200, {
              id: 1,
              createdAt: '2017-08-31T00:00:00.000Z',
              updatedAt: '2017-08-31T00:00:00.001Z',
              username: 'sasquatch'
            })
      })
    })
  })
})

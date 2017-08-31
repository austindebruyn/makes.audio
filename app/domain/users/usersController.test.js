const usersController = require('./usersController')
const createUser = require('./createUser')
const InviteCode = require('../inviteCodes/InviteCode')
const startServer = require('../../tests/startServer')
const clock = require('../../tests/clock')
const request = require('superagent')
const expect = require('chai').expect
const sinon = require('sinon')

describe('usersController', function () {
  clock()
  startServer()

  beforeEach(function () {
    sinon.spy(createUser, 'createUser')
  })

  afterEach(function () {
    createUser.createUser.restore()
  })

  describe('POST /api/users', function () {
    it('should invoke createUser', function (done) {
      const postBody = {
        username: 'turkish',
        password: 'allegory',
        password2: 'fighter',
        inviteCode: 'cashmere'
      }
      request.post('http://localhost:14141/api/users')
        .send(postBody)
        .end(function (err, res) {
          expect(createUser.createUser).to.have.been.calledWith(postBody)
          return done()
        })
    })

    it('should return errors', function (done) {
      request.post('http://localhost:14141/api/users')
        .send({ username: 'hey', password: 'austin', password2: 'austin' })
        .end(function (err, res) {
          expect(res.status).to.eql(422)
          expect(res.body).to.eql({
            ok: false,
            errors: [{ code: 'NONEXISTANT_INVITE' }]
          })
          done()
        })
    })

    it.only('should create a user and sign me in', function (done) {
      InviteCode.create({ code: 'polarbear' }).then(() => {
        request.post('http://localhost:14141/api/users')
          .send({ username: 'robin', password: 'egg', password2: 'egg', inviteCode: 'polarbear' })
          .end(function (err, res) {
            expect(res.status).to.eql(200)
            expect(res.body).to.eql({
              ok: true,
              user: {
                id: 1,
                createdAt: '2017-08-31T00:00:00.000Z',
                updatedAt: '2017-08-31T00:00:00.001Z',
                username: 'robin'
              }
            })
            expect(res.headers['set-cookie']).to.match(/^connect\.sid=/)
            done()
          })
        })
    })
  })

  describe('GET /api/users/me', function () {
    it('should 403 on signed out', function (done) {
      request.get('http://localhost:14141/api/users/me')
        .accept('application/json')
        .redirects(0)
        .end(function (err, res) {
          expect(res.status).to.eql(403)
          return done()
        })
    })

    // it('should return my user on sign in', function (done) {
    //   request.get('http://localhost:14141/api/users/me')
    //     .accept('application/json')
    //     .redirects(0)
    //     .end(function (err, res) {
    //       expect(res.status).to.eql(403)
    //       return done()
    //     })
    // })
  })
})

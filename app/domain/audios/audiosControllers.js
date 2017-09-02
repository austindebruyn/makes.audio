const audiosController = require('./audiosController')
const createUser = require('./createUser')
const InviteCode = require('../inviteCodes/InviteCode')
const agent = require('../../tests/agent')
const clock = require('../../tests/clock')
const signIn = require('../../tests/signIn')
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

const { createUser } = require('./createUser')
const InviteCode = require('../inviteCodes/InviteCode')
const User = require('../users/User')
const { expect } = require('chai')
const factory = require('../../tests/factory')

describe('createUser', function () {
  it('should reject non matching passwords', function () {
    return expect(createUser({ password: 'apples', password2: 'bananas' }))
      .to.eventually.be.rejected.and.have.property('code', 'PASSWORDS_DONT_MATCH')
  })

  it('should reject missing invite code', function () {
    return expect(createUser({
      username: '',
      password: 'a',
      password2: 'a',
      inviteCode: 'asdjflasdkf'
    })).to.eventually.be.rejected.and.have.property('code', 'NONEXISTANT_INVITE')
  })

  it('should reject missing password', function () {
    return expect(createUser({ username: '' }))
      .to.eventually.be.rejected.and.have.property('code', 'MISSING_PASSWORD')
  })

  describe('when a user exists', function () {
    beforeEach(function () {
      return factory.create('user', { username: 'man' }).then(user => {
        return InviteCode.create({ code: 'husky', userId: user.id })
      }).then(() => {
        return InviteCode.create({ code: 'polarbear' })
      })
    })

    it('should reject used invite code', function () {
      return expect(createUser({
        username: '',
        password: 'a',
        password2: 'a',
        inviteCode: 'husky'
      })).to.eventually.be.rejected.and.have.property('code', 'USED_INVITE')
    })

    it('should reject used username', function () {
      return expect(createUser({
        username: 'man',
        password: 'a',
        password2: 'a',
        inviteCode: 'polarbear'
      })).to.eventually.be.rejected.and.have.property('code', 'USERNAME_NOT_UNIQUE')
    })
  })

  describe('invite code is correct', function () {
    beforeEach(function () {
      return InviteCode.create({ code: 'polarbear' })
    })

    it('should validate model', function () {
      return expect(createUser({
        username: 'm',
        password: 'b',
        password2: 'b',
        inviteCode: 'polarbear'
      })).to.eventually.be.rejected.and.deep.include({
        code: 'VALIDATION',
        fields: ['username']
      })
    })

    it('should assign inviteCode to user', function () {
      return createUser({ username: 'man2', password: 'b', password2: 'b', inviteCode: 'polarbear' })
        .then(user => {
          return User.findOne({ where: { id: user.id }, include: [InviteCode] })
        }).then(user => {
          expect(user.inviteCode.code).to.eql('polarbear')
        })
    })
  })
})

const { createUser } = require('./createUser')
const InviteCode = require('../inviteCodes/InviteCode')
const User = require('../users/User')
const { expect } = require('chai')

describe('createUser', function () {
  it('should reject non matching passwords', function () {
    return createUser({ password: 'apples', password2: 'bananas' }).catch(err => {
      expect(err.code).to.eql('PASSWORDS_DONT_MATCH')
    })
  })

  it('should reject missing invite code', function () {
    return createUser({ username: '', password: 'a', password2: 'a', inviteCode: 'asdjflasdkf' }).catch(err => {
      expect(err.code).to.eql('NONEXISTANT_INVITE')
    })
  })

  it('should reject missing password', function () {
    return createUser({ username: '' }).catch(err => {
      expect(err.code).to.eql('MISSING_PASSWORD')
    })
  })

  describe('when a user exists', function () {
    beforeEach(function () {
      return User.create({
        username: 'man', password: '2$4'
      }).then(user => {
        return InviteCode.create({ code: 'husky', userId: user.id })
      }).then(() => {
        return InviteCode.create({ code: 'polarbear' })
      })
    })

    it('should reject used invite code', function () {
      return createUser({ username: '', password: 'a', password2: 'a', inviteCode: 'husky' })
        .catch(err => {
          expect(err.code).to.eql('USED_INVITE')
        })
    })

    it('should reject used username', function () {
      return createUser({ username: 'man', password: 'a', password2: 'a', inviteCode: 'polarbear' })
        .catch(err => {
          expect(err.code).to.eql('USERNAME_NOT_UNIQUE')
        })
    })
  })

  describe('invite code is correct', function () {
    beforeEach(function () {
      return InviteCode.create({ code: 'polarbear' })
    })

    it('should validate model', function () {
      return createUser({ username: 'm', password: 'b', password2: 'b', inviteCode: 'polarbear' })
        .catch(err => {
          expect(err.code).to.eql('VALIDATION')
          expect(err.fields).to.eql(['username'])
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

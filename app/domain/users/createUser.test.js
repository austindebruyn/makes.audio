const { createUser } = require('./createUser')
const InviteCode = require('../inviteCodes/InviteCode')
const EmailPreferences = require('../emailPreferences/EmailPreferences')
const User = require('../users/User')
const { expect } = require('chai')
const factory = require('../../tests/factory')
const clock = require('../../tests/clock')

describe('createUser', function () {
  it('should reject non matching passwords', function () {
    return expect(createUser({ password: 'apples', password2: 'bananas' }))
      .to.eventually.be.rejected.and.have.property('code', 'PASSWORDS_DONT_MATCH')
  })

  it('should reject missing invite code', function () {
    return expect(createUser({
      username: '',
      email: 'apple@banana.com',
      password: 'a',
      password2: 'a',
      inviteCode: 'asdjflasdkf'
    })).to.eventually.be.rejected.and.have.property('code', 'NONEXISTANT_INVITE')
  })

  it('should reject missing password', function () {
    return expect(createUser({ username: '' }))
      .to.eventually.be.rejected.and.have.property('code', 'MISSING_PASSWORD')
  })

  it('should reject missing email', function () {
    return expect(createUser({ username: '', password: 'hey', password2: 'hey', email: '' }))
      .to.eventually.be.rejected.and.have.property('code', 'BAD_EMAIL')
  })

  it('should reject bad format email', function () {
    return expect(createUser({ username: '', password: 'hey', password2: 'hey', email: '@kjsa' }))
      .to.eventually.be.rejected.and.have.property('code', 'BAD_EMAIL')
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
        email: 'apple@banana.com',
        password: 'a',
        password2: 'a',
        inviteCode: 'husky'
      })).to.eventually.be.rejected.and.have.property('code', 'USED_INVITE')
    })

    it('should reject used username', function () {
      return expect(createUser({
        username: 'man',
        email: 'apple@banana.com',
        password: 'a',
        password2: 'a',
        inviteCode: 'polarbear'
      })).to.eventually.be.rejected.and.have.property('code', 'USERNAME_NOT_UNIQUE')
    })
  })

  describe('invite code is correct', function () {
    clock()

    beforeEach(function () {
      return InviteCode.create({ code: 'polarbear' })
    })

    it('should validate model', function () {
      return expect(createUser({
        username: 'm',
        email: 'apple@banana.com',
        password: 'b',
        password2: 'b',
        inviteCode: 'polarbear'
      })).to.eventually.be.rejected.and.deep.include({
        code: 'VALIDATION',
        fields: ['username']
      })
    })

    it('should assign inviteCode to user', function () {
      return createUser({
        username: 'man2',
        email: 'peter@pan.com',
        password: 'b',
        password2: 'b',
        inviteCode: 'polarbear'
      })
        .then(user => {
          return User.findOne({ where: { id: user.id }, include: [InviteCode] })
        }).then(user => {
          expect(user.inviteCode.code).to.eql('polarbear')
        })
    })

    it('should create email preferences model', function () {
      return createUser({
        username: 'man2',
        email: 'peter@pan.com',
        password: 'b',
        password2: 'b',
        inviteCode: 'polarbear'
      })
        .then(user => {
          return User.findOne({ where: { id: user.id }, include: [EmailPreferences] })
        }).then(user => user.emailPreferences.toJSON())
          .then(emailPreferences => {
          expect(emailPreferences).to.include({
            id: 1,
            verifiedAt: null,
            optedOutAt: null,
            createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
            updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
            userId: 1
          })
        })
    })
  })
})

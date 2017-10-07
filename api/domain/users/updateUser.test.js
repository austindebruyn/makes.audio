const updateUser = require('./updateUser')
const EmailPreferences = require('../emailPreferences/EmailPreferences')
const sendVerificationEmail = require('../emailPreferences/sendVerificationEmail')
const factory = require('../../tests/factory')
const expect = require('chai').expect
const sinon = require('sinon')
const bcrypt = require('bcrypt')

describe('updateUser', function () {
  var user

  beforeEach(function () {
    return factory.create('user', { password: 'bananas' }).then(function (record) {
      user = record
      return factory.create('emailPreferences', {
        userId: user.id,
        verifiedAt: new Date()
      })
    })
  })

  it('throws NO_ATTRIBUTES', function () {
    return expect(updateUser.updateUser({ user }))
      .to.eventually.be.rejected.and.have.property('code', 'NO_ATTRIBUTES')
  })

  it('throws BAD_ATTRIBUTES', function () {
    return expect(updateUser.updateUser({
      user,
      attributes: { username: 'asjkdlfjasd', createdAt: null }
    })).to.eventually.be.rejected.and.deep.include({
      code: 'BAD_ATTRIBUTES',
      fields: ['createdAt']
    })
  })

  it('should throw WRONG_PASSWORD', function () {
    return expect(updateUser.updateUser({
      user,
      attributes: { password: 'chirithy' }
    })).to.eventually.be.rejected.and.deep.include({
      code: 'WRONG_PASSWORD'
    })
  })

  it('should update the username', function () {
    return updateUser.updateUser({
      user,
      attributes: { username: 'beelzebub' }
    }).then(function (user) {
      expect(user.username).to.eql('beelzebub')
      expect(user.previous('username')).to.eql('beelzebub')
    })
  })

  it('should update the email', function () {
    return updateUser.updateUser({
      user,
      attributes: { email: 'jonas@salk.com' }
    }).then(function (user) {
      expect(user.email).to.eql('jonas@salk.com')
      expect(user.previous('email')).to.eql('jonas@salk.com')
    })
  })

  it('should update the password', function () {
    return updateUser.updateUser({
      user,
      attributes: { password: 'cherubim', currentPassword: 'bananas' }
    }).then(function (user) {
      return expect(bcrypt.compare('cherubim', user.password)).to.eventually.be.true
    })
  })

  describe('changing email', function () {
    beforeEach(function () {
      sinon.stub(sendVerificationEmail, 'sendVerificationEmail')
    })

    afterEach(function () {
      sendVerificationEmail.sendVerificationEmail.restore()
    })

    it('should mark the email as un-verified if email is changed', function () {
      return updateUser.updateUser({
        user,
        attributes: { email: 'steve@jobs.com' }
      }).then(function (user) {
        return EmailPreferences.findOne({ where: { userId: user.id } })
      }).then(function (emailPreferences) {
        expect(emailPreferences.verifiedAt).to.be.null
        expect(sendVerificationEmail.sendVerificationEmail).to.have.been.called
        expect(sendVerificationEmail.sendVerificationEmail.args[0][0].id).to.eql(emailPreferences.id)
      })
    })

    it('should not mark the email as un-verified if email isnt changed', function () {
      return updateUser.updateUser({
        user,
        attributes: { username: 'steven' }
      }).then(function (user) {
        return EmailPreferences.findOne({ where: { userId: user.id } })
      }).then(function (emailPreferences) {
        expect(emailPreferences.verifiedAt).to.not.be.null
        expect(sendVerificationEmail.sendVerificationEmail).to.not.have.been.called
      })
    })
  })
})

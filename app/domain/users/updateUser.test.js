const updateUser = require('./updateUser')
const factory = require('../../tests/factory')
const expect = require('chai').expect
const bcrypt = require('bcrypt')

describe('updateUser', function () {
  var user

  beforeEach(function () {
    return factory.build('user', { password: 'bananas' }).then(function (record) {
      user = record
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
      return bcrypt.compare('cherubim', user.password)
    }).then(verified => expect(verified).to.be.true)
  })
})

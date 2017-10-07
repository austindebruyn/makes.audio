const sendVerificationEmail = require('./sendVerificationEmail')
const EmailPreferences = require('./EmailPreferences')
const factory = require('../../tests/factory')
const expect = require('chai').expect
const uid = require('uid-safe')
const queue = require('kue').createQueue()

describe('sendVerificationEmail', function () {
  it('should reject if no user', function () {
    return expect(EmailPreferences.create({}).then(function (model) {
      return sendVerificationEmail.sendVerificationEmail(model)
    })).to.eventually.be.rejected.and.have.property('message', '[sendVerificationEmail] EmailPreferences model does not have user preloaded')
  })

  describe('when user', function () {
    var emailPreferences, user

    beforeEach(function () {
      return factory.create('user', { username: 'charles' })
        .then(function (model) {
          user = model
          return factory.create('emailPreferences', { userId: user.id })
        }).then(function (model) {
          emailPreferences = model
          emailPreferences.user = user
        })
    })

    it('should send email', function () {
      return sendVerificationEmail.sendVerificationEmail(emailPreferences)
        .then(function () {
          const job = queue.testMode.jobs[0]

          expect(job).to.have.property('type', 'email')
          expect(job.data).to.eql({
            subject: 'Please verify your email',
            template: 'verify-email',
            to: user.email,
            values: {
              username: 'charles',
              href: `http://test-makes.audio:8000/users/me/emailPreferences/verify?verificationCode=${emailPreferences.verificationCode}`
            }
          })
      })
    })
  })
})

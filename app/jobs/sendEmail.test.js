const sendEmail = require('./sendEmail')
const mailgun = require('../services/mailgun')
const mockMailgun = require('../tests/mockMailgun')
const expect = require('chai').expect
const sinon = require('sinon')
const queue = require('kue').createQueue()

const DEFAULT_EMAIL = {
  to: 'ok@cool.net',
  subject: 'Test Email',
  template: 'test',
  values: {
    name: 'john'
  }
}

describe('sendEmail', function () {
  var mockMg

  beforeEach(function () {
    mockMg = mockMailgun({ succeeds: true })
    sinon.stub(mailgun, 'get').returns(mockMg)
  })

  afterEach(function () {
    mockMg.reset()
    mailgun.get.restore()
  })

  describe('#process', function () {
    var job

    beforeEach(function () {
      return sendEmail(DEFAULT_EMAIL)
        .then(function () {
          job = queue.testMode.jobs[0]
          sinon.stub(job, 'log')
        })
    })

    afterEach(function () {
      job.log.restore()
    })

    it('should work call mailgun#send', function () {
      return sendEmail.process(job, function (err) {
        expect(err).to.be.null
      })
      .then(function () {
        expect(mockMg.send).to.have.been.calledWith({
          from: 'makes.audio <donotreply@mg.makes.audio>',
          subject: 'Test Email',
          text: '<h1>Welcome, john!</h1><p>Hello.</p>',
          to: 'ok@cool.net'
        })
      })
    })

    it('should work log response', function () {
      return sendEmail.process(job, function (err) {
        expect(err).to.be.null
      })
      .then(function () {
        expect(job.log).to.have.been.calledWith({
          id: '<20170913061408.34260.78C88EA7BE247B5B@mg.makes.audio>',
          message: 'Queued. Thank you.'
        })
      })
    })
  })
})

const _ = require('lodash')
const defineJob = require('.')
const expect = require('chai').expect
const sinon = require('sinon')
const queue = require('kue').createQueue()

describe('defineJob', function () {
  it('should return functions', function () {
    const job = defineJob({
      queueName: 'someTask',
      perform: (data) => {}
    })

    expect(job).to.be.a('function')
    expect(job.process).to.be.a('function')
  })

  it('should enqueue the job in kue', function () {
    const job = defineJob({
      queueName: 'someTask',
      perform: (data) => {}
    })

    return job({ someVar: 2 }).then(function () {
      expect(queue.testMode.jobs).to.have.length(1)
      const kueJob = queue.testMode.jobs[0]
      expect(kueJob).to.have.property('type', 'someTask')
      expect(kueJob.data).to.eql({ someVar: 2 })
    })
  })

  describe('bad arguments', function () {
    it('should throw when any arg is missing', function () {
      expect(function () { defineJob({}) }).to.throw(Error)
      expect(function () { defineJob({ queueName: 'a' }) }).to.throw(Error)
      expect(function () { defineJob({
        queueName: 'a',
        perform: _.noop
      }) }).to.not.throw(Error)
    })
  })

  describe('argument validation', function () {
    it('should reject missing', function () {
      const job = defineJob({
        queueName: 'someJob',
        args: {
          someString: String
        },
        perform: _.noop
      })

      const expected = "kue job someJob was missing arg 'someString'"

      return expect(job({ }))
        .to.eventually.be.rejected.and.have.property('message', expected)
    })

    it('should reject bad type', function () {
      const job = defineJob({
        queueName: 'someJob',
        args: {
          someString: String
        },
        perform: _.noop
      })

      const expected = "kue job someJob expected arg 'someString' of type 'string' but got 'number'"

      return expect(job({ someString: 2 }))
        .to.eventually.be.rejected.and.have.property('message', expected)
    })
  })

  describe('process function', function () {
    it('should call process function', function () {
      const performSpy = sinon.spy()

      const job = defineJob({
        queueName: 'someTask',
        perform: performSpy
      })

      const kueJobObject = { data: { a: 1 } }

      return job.process(kueJobObject, function (err) {
        expect(err).to.be.null;
      }).then(function () {
        expect(performSpy).to.have.been.calledWith({ a: 1 }, kueJobObject)
      })
    })
  })
})

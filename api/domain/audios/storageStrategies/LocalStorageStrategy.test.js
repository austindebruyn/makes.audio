const fs = require('fs-extra')
const LocalStorageStrategy = require('./LocalStorageStrategy')
const { expect } = require('chai')
const sinon = require('sinon')

describe('LocalStorageStrategy', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()
    this.subject = new LocalStorageStrategy()
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  describe('#store', function () {
    it('should throw when when rename fails', async function () {
      const error = new Error('some filesystem error')
      this.sandbox.stub(fs, 'rename').rejects(error)
      await expect(this.subject.store({
        source: '/var/some/file',
        destination: '/var/some/other/file'
      })).to.eventually.be.rejected.and.include({
        message: 'some filesystem error'
      })
    })

    describe('when rename succeeds', function () {
      beforeEach(function () {
        this.sandbox.stub(fs, 'rename').resolves()
      })

      it('should call rename', async function () {
        await this.subject.store({
          source: '/var/some/file',
          destination: '/var/some/other/file'
        })

        expect(fs.rename).to.have.been.calledWith(
          '/var/some/file',
          '/var/some/other/file'
        )
      })
    })
  })
})

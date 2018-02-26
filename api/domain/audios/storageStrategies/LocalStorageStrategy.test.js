const fs = require('fs-extra')
const path = require('path')
const LocalStorageStrategy = require('./LocalStorageStrategy')
const { expect } = require('chai')
const sinon = require('sinon')
const factory = require('../../../tests/factory')

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

  describe('#getStream', function () {
    beforeEach(async function () {
      this.stream = {}
      this.sandbox.stub(fs, 'createReadStream').returns(this.stream)
      this.audio = await factory.create('audio', {
        filename: '2b39716a3ad19a8f84c5ec70353de4535bfa0'
      })
    })

    it('should build the right file path', async function () {
      const stream = await this.subject.getStream(this.audio)

      const expected = path.join(
        __dirname,
        '../../../../api/store',
        '2b39716a3ad19a8f84c5ec70353de4535bfa0'
      )
      expect(fs.createReadStream).to.have.been.calledWith(expected)

      expect(stream).to.eql(this.stream)
    })
  })
})

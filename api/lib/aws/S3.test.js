const AWS = require('aws-sdk')
const S3 = require('./S3')
const { expect } = require('chai')
const stubConfig = require('../../tests/stubConfig')
const fs = require('fs-extra')
const sinon = require('sinon')

describe('S3', function () {
  stubConfig('app.aws.s3.key', 'AWS_ACCESS_KEY')
  stubConfig('app.aws.s3.secret', 'AWS_SECRET')

  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it('should throw error when file not exist', async function () {
    this.sandbox.stub(fs, 'pathExists').resolves(false)

    await expect(new S3().upload('/var/some/file.txt'))
      .to.eventually.be.rejected.and.include({
        message: 'No such file /var/some/file.txt'
      })
  })

  describe('when file exists', function () {
    beforeEach(function () {
      this.sandbox.stub(fs, 'pathExists').resolves(true)
      this.sandbox.stub(fs, 'readFile').resolves(new Buffer('some text file'))
    })

    describe('when AWS SDK call fails', function () {
      it('should reject', async function () {
        const error = new Error('AWS bad')
        this.sandbox.stub(AWS.S3.prototype, 'makeRequest').yields(error)

        await expect(new S3().upload('/var/some/file.txt'))
          .to.eventually.be.rejected.and.include({
            message: 'AWS bad'
          })
      })
    })

    describe('when AWS SDK call succeeds', function () {
      beforeEach(function () {
        this.responseData = { success: true }
        this.sandbox.stub(AWS.S3.prototype, 'makeRequest').yields(
          null,
          this.responseData
        )
      })

      it('should call AWS SDK', async function () {
        await new S3().upload('/var/some/file.txt', 'new-file-name.txt')
        expect(AWS.S3.prototype.makeRequest)
          .to.have.been.calledWith('putObject', {
            ACL: 'public-read',
            Body: new Buffer('some text file'),
            Bucket: 'makesaudiocontent01',
            ContentType: 'text/plain',
            Key: 'new-file-name.txt'
          })
      })

      it('should use the source filename as the default for the object key', async function () {
        await new S3().upload('/var/some/file.txt')
        expect(AWS.S3.prototype.makeRequest.args[0][1].Key).to.eql('file.txt')
      })

      it('should return AWS response data', async function () {
        await expect(new S3().upload('/var/some/file.txt'))
          .to.eventually.eql(this.responseData)
      })
    })
  })
})

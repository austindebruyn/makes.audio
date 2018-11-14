const AWS = require('aws-sdk')
const fs = require('fs-extra')
const path = require('path')
const config = require('../../config')
// const mime = require('mime-types')

/**
 * Interfacing with the S3.
 */
class S3 {
  /**
   * @api
   */
  constructor() {
    const endpoint = new AWS.Endpoint('s3-us-west-1.amazonaws.com')

    this.s3 = new AWS.S3({
      endpoint: endpoint,
      accessKeyId: config.app.aws.s3.key,
      secretAccessKey: config.app.aws.s3.secret
    })
  }

  /**
   * @param {String} absFilename
   * @param {String} objectKey
   */
  async upload(absFilename, objectKey = null) {
    if (!await fs.pathExists(absFilename)) {
      throw new Error(`No such file ${absFilename}`)
    }

    const buffer = await fs.readFile(absFilename)
    if (!objectKey) {
      objectKey = path.basename(absFilename)
    }

    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: 'makesaudiocontent01',
      ContentType: 'text/plain', // mime.lookup(filename),
      Key: objectKey
    }

    return new Promise((resolve, reject) => {
      this.s3.putObject(params, function (err, data) {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }

  /**
   * @param {String} objectKey
   * @returns {Stream}
   */
  download(objectKey) {
    const params = {
      Bucket: 'makesaudiocontent01',
      Key: objectKey
    }

    return this.s3.getObject(params).createReadStream()
  }

  /**
   * @param {String} objectKey
   * @returns {Stream}
   */
  async delete(objectKey) {
    const params = {
      Bucket: 'makesaudiocontent01',
      Key: objectKey
    }

    await new Promise((resolve, reject) => {
      this.s3.deleteObject(params, function (err) {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}

module.exports = S3

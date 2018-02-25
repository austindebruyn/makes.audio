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
   * @param {String} absFilename
   */
  async upload(absFilename) {
    const endpoint = new AWS.Endpoint('s3-us-west-1.amazonaws.com')

    const s3 = new AWS.S3({
      endpoint: endpoint,
      accessKeyId: config.app.aws.s3.key,
      secretAccessKey: config.app.aws.s3.secret
    })

    if (!await fs.pathExists(absFilename)) {
      throw new Error(`No such file ${absFilename}`)
    }

    const buffer = await fs.readFile(absFilename)
    const filename = path.basename(absFilename)

    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: 'makesaudiocontent01',
      ContentType: 'text/plain', // mime.lookup(filename),
      Key: filename
    }

    return new Promise(function (resolve, reject) {
      s3.putObject(params, function (err, data) {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }
}

module.exports = S3

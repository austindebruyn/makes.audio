const hashFiles = require('hash-files')
const fs = require('fs-extra')
const path = require('path')
const config = require('../../config')
const Audio = require('./Audio')
const getUniqueUrl = require('./getUniqueUrl')
const crypto = require('crypto')
const getAudioLength = require('../../jobs/getAudioLength')
const pify = require('pify')

class AudioCreationError extends Error {
  constructor(code, data = {}) {
    super()
    this.name = 'AudioCreationError'
    this.code = code
    Object.assign(this, data)
  }

  toJSON() {
    if (this.fields) {
      return { code: this.code, fields: this.fields }
    }
    return { code: this.code }
  }
}

/**
 * An AudioCreator is responsible for turning a temporary upload file into an
 * S3 stored object.
*/
class AudioCreator {
  /**
   * Promises to retrieve the sha256 hash of the given temporary file.
   * @param {String} filename
   * @returns {Promise<String>}
   */
  async hashTemporaryFile(filename) {
    return pify(hashFiles)({
      files: [filename],
      noGlob: true,
      algorithm: 'sha256'
    })
  }

  /**
   * Build a hashed, nonced filename for the temporary object.
   * @param {String} hash
   * @returns {String}
   */
  getFilename(hash) {
    const sha256 = crypto.createHash('sha256')
    sha256.update(`${hash}${+new Date()}`)

    return sha256.digest('hex')
  }

  /**
   * Ensures that the given file object is acceptable for upload.
   * @param {Object} file
   * @throws {AudioCreationError} on rejection
   */
  verifyAudioFile(file) {
    const MAXIMUM_FILE_SIZE = config.audio.maxSizeInMB * 1024 * 1024

    if (!file) {
      throw new AudioCreationError('NO_FILE')
    }

    if (file.size > MAXIMUM_FILE_SIZE) {
      throw new AudioCreationError('FILE_TOO_LARGE', {
        maxSize: MAXIMUM_FILE_SIZE
      })
    }

    if (!config.audio.allowedMimetypes.includes(file.mimetype)) {
      throw new AudioCreationError('BAD_MIMETYPE', {
        allowedMimetypes: config.audio.allowedMimetypes
      })
    }
  }

  /**
   * @typedef CreateAudioParams
   * @property {Object} file
   * @property {User} user
   */
  /**
   * Promises to upload the given file object for the user.
   * @api
   * @param {CreateAudioParams} params 
   */
  async perform({ file, user }) {
    try {
      await this.verifyAudioFile(file)
      const hash = await this.hashTemporaryFile(file.path)
      const permanentFilename = await this.getFilename(hash)

      const absPermanentFilename = path.resolve(
        __dirname,
        '../../store',
        permanentFilename
      )

      await fs.rename(file.path, absPermanentFilename)
      const desiredUrl = file.originalname
        .replace(/[^.\w]/g, '-')
        .slice(0, 128)
        .toLowerCase()

      const url = await getUniqueUrl.getUniqueUrl({
        userId: user.id,
        url: desiredUrl
      })
      const record = await Audio.create({
        userId: user.id,
        hash: hash,
        filename: permanentFilename,
        originalName: file.originalname,
        url,
        size: file.size,
        mimetype: file.mimetype
      })
      await getAudioLength({ audioId: record.id })

      return record
    } catch (err) {
      if (!file) throw err

      const exists = await fs.exists(file.path)

      if (exists) {
        await fs.unlink(file.path)
      }

      throw err
    }
  }
}

module.exports = AudioCreator

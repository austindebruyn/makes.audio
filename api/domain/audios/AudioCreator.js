const fs = require('fs-extra')
const pify = require('pify')
const crypto = require('crypto')
const hashFiles = require('hash-files')
const config = require('../../config')
const getUniqueUrl = require('./getUniqueUrl')
const getAudioLength = require('../../jobs/getAudioLength')
const Audio = require('./Audio')
const { getStorageStrategy } = require('./storageStrategies')

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
 * An AudioCreator is responsible for turning a temporary upload file into a
 * persisted object
 */
class AudioCreator {
  /**
   * @api
   */
  constructor() {
    this.storageStrategy = getStorageStrategy()
  }

  /**
   * Promises to retrieve the sha256 hash of the given temporary file.
   * @param {String} filename
   * @returns {Promise<String>}
   */
  async getHash(filename) {
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
  buildFilename(hash) {
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
   * Promises to remove the temporary file.
   */
  async cleanup(file) {
    if (file && await fs.exists(file.path)) {
      await fs.unlink(file.path)
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
      const hash = await this.getHash(file.path)
      const permanentFilename = await this.buildFilename(hash)

      await this.storageStrategy.store({
        source: file.path,
        destination: permanentFilename
      })
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
        description: null,
        size: file.size,
        mimetype: file.mimetype
      })
      await getAudioLength({ audioId: record.id })
      return record
    } catch (err) {
      throw err
    } finally {
      await this.cleanup(file)
    }
  }
}

module.exports = AudioCreator

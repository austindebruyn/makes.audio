const hashFiles = require('hash-files')
const fs = require('fs-extra')
const path = require('path')
const config = require('../../config')
const Audio = require('./Audio')
const getUniqueUrl = require('./getUniqueUrl')

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

exports.hashTemporaryFile = function hashTemporaryFile(filename) {
  return new Promise(function (resolve, reject) {
    hashFiles({
      files: [filename],
      noGlob: true,
      algorithm: 'sha256'
    }, function (err, hash) {
      if (err) return reject(err)
      return resolve(hash)
    })
  })
}

exports.verifyAudioFile = function verifyAudioFile(file) {
  const MAXIMUM_FILE_SIZE = config.audio.maxSizeInMB * 1024 * 1024

  return new Promise(function (resolve, reject) {
    if (!file) {
      return reject(new AudioCreationError('NO_FILE'))
    }

    if (file.size > MAXIMUM_FILE_SIZE) {
      return reject(new AudioCreationError('FILE_TOO_LARGE', {
        maxSize: MAXIMUM_FILE_SIZE
      }))
    }

    if (!config.audio.allowedMimetypes.includes(file.mimetype)) {
      return reject(new AudioCreationError('BAD_MIMETYPE', {
        allowedMimetypes: config.audio.allowedMimetypes
      }))
    }

    return resolve()
  })
}

exports.createAudio = function createAudio({ file, user }) {
  return new Promise(function (resolve, reject) {
    var state = {}

    return exports.verifyAudioFile(file)
      .then(() => exports.hashTemporaryFile(file.path))
      .then(function (hash) {
        state.hash = hash
        const permanentFilename = path.resolve(__dirname, '../../store', hash)
        return fs.rename(file.path, permanentFilename)
      })
      .then(function () {
        state.url = file.originalname
          .replace(/[^.\w]/g, '-')
          .slice(0, 128)
          .toLowerCase()

        return getUniqueUrl.getUniqueUrl({
          userId: user.id,
          url: state.url
        })
      })
      .then(function (url) {
        return Audio.create({
          userId: user.id,
          hash: state.hash,
          originalName: file.originalname,
          url,
          size: file.size,
          mimetype: file.mimetype
        })
      })
      .then(resolve)
      .catch(function (err) {
        if (!file) return reject(err)
        return fs.exists(file.path)
          .then(exists => exists && fs.unlink(file.path))
          .then(() => reject(err))
      })
  })
}

const hashFiles = require('hash-files')
const fs = require('fs')
const path = require('path')
const config = require('../../config')
const Audio = require('./Audio')

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

module.exports.removeTemporaryFile = function removeTemporaryFile(filename) {
  return new Promise(function (resolve, reject) {
    fs.unlink(temporaryFilename, function (err) {
      if (err) return reject(err)
      return resolve()
    })
  })
}

function hashTemporaryFile(filename) {
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

function renameFiles(source, destination) {
  return new Promise(function (resolve, reject) {
    fs.rename(source, destination, function (err) {
      if (err) return reject(err)
      return resolve()
    })
  })
}

module.exports.createAudio = function createAudio({ file, user }) {
  return new Promise(function (resolve, reject) {
    /*
    { fieldname: 'file',
    originalname: '1f1fa-1f1f8.png',
    encoding: '7bit',
    mimetype: 'image/png',
    destination: 'uploads/',
    filename: '27c831699f35a2033fc089029c2ae783',
    path: 'uploads/27c831699f35a2033fc089029c2ae783',
    size: 903 }
    */
    const MAXIMUM_FILE_SIZE = config.audio.maxSizeInMB * 1024 * 1024

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

    const temporaryFilename = file.path
    var state = {}

    hashTemporaryFile(temporaryFilename)
      .then(function (hash) {
        state.hash = hash
        const permanentFilename = path.resolve(__dirname, '../..', 'store', hash)
        return renameFiles(temporaryFilename, permanentFilename)
      })
      .then(function () {
        state.url = file.originalname
          .replace(/[^.\w]/g, '-')
          .slice(0, 128)
          .toLowerCase()

        return Audio.count({ where: { userId: user.id, url: state.url } })
      })
      .then(function (count) {
        if (count !== 0) {
          throw new AudioCreationError('URL_NOT_UNIQUE')
        }

        return Audio.create({
          userId: user.id,
          hash: state.hash,
          originalName: file.originalname,
          url: state.url,
          size: file.size,
          mimetype: file.mimetype
        }, { include: [ Audio.User ] })
      })
      .then(resolve)
      .catch(reject)
  })
}

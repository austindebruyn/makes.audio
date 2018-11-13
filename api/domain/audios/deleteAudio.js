const _ = require('lodash')
const Audio = require('./Audio')

class AudioDeleteError extends Error {
  constructor(code, data = {}) {
    super()
    this.name = 'AudioDeleteError'
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
 * Attempts to mark the given audio model as deleted.
 * @param {User}   user 
 * @param {Audio}  audio 
 */
function deleteAudio(user, audio) {
  return new Promise(function (resolve, reject) {
    if (audio.userId !== user.id) {
      throw new AudioDeleteError('UNAUTHORIZED')
    }

    return audio.update({ deletedAt: new Date() })
      .then(resolve)
      .catch(reject)
  })
}

module.exports = {
  deleteAudio
}

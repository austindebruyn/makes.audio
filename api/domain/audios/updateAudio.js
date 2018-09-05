const _ = require('lodash')
const Audio = require('./Audio')

class AudioUpdateError extends Error {
  constructor(code, data = {}) {
    super()
    this.name = 'AudioUpdateError'
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
 * Updates the given audio record with the json body provided, acting as the
 * authenticated user.
 * @param {User}   user 
 * @param {Audio}  audio 
 * @param {object} body 
 */
function updateAudio(user, audio, body) {
  return new Promise(function (resolve, reject) {
    if (audio.userId !== user.id) {
      throw new AudioUpdateError('UNAUTHORIZED')
    }

    const allowedAttributes = [
      'url',
      'description',
      'visible'
    ]

    const attributeKeys = Object.keys(body)
    const forbiddenAttributes = _.difference(attributeKeys, allowedAttributes)

    if (forbiddenAttributes.length > 0) {
      return reject(new AudioUpdateError('BAD_ATTRIBUTES', {
        fields: forbiddenAttributes
      }))
    }

    _.assign(audio, body)

    return Audio.findOne({ where: { url: audio.url, userId: audio.userId } })
      .then(function (record) {
        if (record && record.id !== audio.id) {
          throw new AudioUpdateError('URL_NOT_UNIQUE')
        }

        return audio.save()
      })
      .then(function () {
        return resolve(audio)
      })
      .catch(reject)
  })
}

module.exports = {
  updateAudio
}

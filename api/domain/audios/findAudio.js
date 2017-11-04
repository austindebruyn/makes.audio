const Audio = require('./Audio')
const User = require('../users/User')

class AudioNotFoundError extends Error {
  constructor() {
    super()
    this.name = 'AudioNotFoundError'
  }
}

/**
 * @typedef FindAudioParams
 * @property {String} username
 * @property {String} url
 * @property {User?} user current user 
 */

/**
 * Attempts to locate an Audio record from the username and url provided. The
 * current user is passed to ensure that only the owner can view invisible
 * Audios.
 * @param {FindAudioParams} opts 
 * @returns {Promise}
 */
function findAudio(opts) {
  const { url, username, user } = opts
  const query = { url }

  if (!(user && user.username === username)) {
    query.visible = true
  }

  return new Promise(function (resolve, reject) {
    var audio

    return Audio.findOne({ where: query, includes: [ User ] })
      .then(function (model) {
        audio = model

        if (!audio) {
          throw new AudioNotFoundError()
        }

        return audio.getUser()
      })
      .then(function (audioOwner) {
        if (username === audioOwner.username) {
          return audio
        } else {
          throw new AudioNotFoundError()
        }
      })
      .then(resolve)
      .catch(reject)
  })
}

module.exports = { findAudio }

const ffmpeg = require('fluent-ffmpeg')
const config = require('../../config')

if (config.audio.ffprobePath) {
  ffmpeg.setFfprobePath(config.audio.ffprobePath)
}

function ffprobe(filename) {
  return new Promise(function (resolve, reject) {
    ffmpeg(filename)
      .on('error', err => reject(err))
      .ffprobe(function (err, data) {
        if (err) return reject(err)
        return resolve(data)
      })
  })
}

module.exports = {
  ffprobe
}

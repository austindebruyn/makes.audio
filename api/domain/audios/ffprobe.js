const ffmpeg = require('fluent-ffmpeg')

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

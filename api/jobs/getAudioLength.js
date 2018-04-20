const defineJob = require('./defineJob')
const path = require('path')
const fs = require('fs-extra')
const Audio = require('../domain/audios/Audio')
const ffprobe = require('../domain/audios/ffprobe')
const randomstring = require('randomstring')
const { getStorageStrategy } = require('../domain/audios/storageStrategies')

module.exports = defineJob({
  queueName: 'ffprobe',

  args: {
    audioId: Number
  },

  /**
   * Promises to process a fulfill the audio length job.
   * @param  {Object}  data
   * @param  {Object}  job
   * @return {Promise}
   */
  perform: function perform(data, job) {
    var audio
    var temporaryFilename
    const { audioId } = data

    return Audio.findOne({ where: { id: audioId } })
      .then(function (record) {
        audio = record

        if (!audio) {
          throw new Error(`no such audio ${audioId}`)
        }

        const garbage = randomstring.generate({
          length: 24,
          charset: 'alphabetic'
        })

        temporaryFilename = path.resolve(
          __dirname,
          '../../tmp/downloads',
          garbage
        )

        return getStorageStrategy().getStream(audio)
      })
      .then(function (inn) {
        const out = fs.createWriteStream(temporaryFilename)

        return new Promise(function (resolve, reject) {
          inn.on('end', resolve).on('err', reject).pipe(out)
        })
      })
      .then(function () {
        return ffprobe.ffprobe(temporaryFilename)
      })
      .then(function (ffData) {
        if (!ffData.format || typeof ffData.format.duration !== 'number') {
          job.log(ffData)

          const message = '`ffData.format.duration` does not exist.'
          throw new Error(message)
        }

        const duration = Math.round(ffData.format.duration)

        job.log(`Setting audio.duration to ${duration}`)
        audio.duration = duration

        return audio.save()
      })
      .then(function () {
        return fs.unlink(temporaryFilename)
      })
  }
})

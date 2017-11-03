const defineJob = require('./defineJob')
const path = require('path')
const Audio = require('../domain/audios/Audio')
const ffprobe = require('../domain/audios/ffprobe')

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
    const { audioId } = data

    return Audio.findOne({ where: { id: audioId } })
      .then(function (record) {
        audio = record

        if (!audio) {
          throw new Error(`no such audio ${audioId}`)
        }

        const filename = path.resolve(
          __dirname,
          '../store',
          audio.filename
        )

        return ffprobe.ffprobe(filename)
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
  }
})

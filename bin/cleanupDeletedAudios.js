const Audio = require('../api/domain/audios/Audio')
const db = require('../api/services/db')
const S3 = require('../api/lib/aws/S3')

Audio.findAll({ where: { deletedAt: { $ne: null } }, limit: 10 }).then(async function (audios) {
  console.log(`Audios found: ${audios.length}`)

  if (audios.length > 0) {
    const s3 = new S3()

    for (const audio of audios) {
      console.log(`Deleting #${audio.id}/${audio.filename}`)
      await s3.delete(audio.filename)
    }
  }

  db.close()
})

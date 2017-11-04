const Audio = require('./Audio')
const serve = require('../../services/serve')
const createAudio = require('./createAudio')
const updateAudio = require('./updateAudio')
const findAudio = require('./findAudio')

module.exports.index = function (req, res, next) {
  Audio.findAll({ where: { userId: req.user.id } })
    .then(function (records) {
      return Promise.all(records.map(r => r.toJSON()))
    })
    .then(function (records) {
      return res.status(200).json({ ok: true, records })
    })
    .catch(next)
}

module.exports.get = function (req, res, next) {
  if (req.path === '/favicon.ico') {
    return next()
  }
  const pathComponents = req.path.split('/')

  if (req.subdomains.length === 1) {
    const url = pathComponents[1]
    const isDownload = pathComponents[2] && pathComponents[2] === 'download'
    const username = req.subdomains[0]

    return findAudio({
      url,
      username,
      user: req.user
    })
      .then(function (audio) {
        return serve(audio, res, isDownload)
      })
      .catch(function (err) {
        if (err.name !== 'AudioNotFoundError') {
          throw err
        }
        return next()
      })
  } else {
    return next()
  }
}

// module.exports.delete = function (req, res, next) {
//   let audio
//   const id = parseInt(req.params.id, 10)

//   Audio.findOne({ where: { id: id } }, { include: [ Audio.User ] })
//     .then(function (record) {
//       audio = record
//       return audio
//     })
//     .then(function () {
//       console.log(audio)
//     })
// }

module.exports.create = function (req, res, next) {
  return createAudio
    .createAudio({ file: req.file, user: req.user })
    .then(audio => audio.toJSON())
    .then(function (audio) {
      return res.status(201).json({ ok: true, audio })
    })
    .catch(function (err) {
      if (err.name === 'AudioCreationError') {
        return res.status(422).json({ ok: false, errors: [err.toJSON()] })
      }
      return next(err)
    })
}

module.exports.update = function (req, res, next) {
  const id = parseInt(req.params.id, 10)

  Audio.findOne({ where: { id: id } })
    .then(record => updateAudio.updateAudio(req.user, record, req.body))
    .then(audio => audio.toJSON())
    .then(function (audio) {
      return res.status(202).json({ ok: true, audio })
    })
    .catch(function (err) {
      if (err.name === 'AudioUpdateError') {
        return res.status(422).json({ ok: false, errors: [err.toJSON()] })
      }
      return next(err)
    })
}

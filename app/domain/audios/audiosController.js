const Audio = require('./Audio')
const User = require('../users/User')
const serve = require('../../services/serve')
const compact = require('lodash.compact')
const createAudio = require('./createAudio')

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
    let audio = null

    Audio.findOne({ where: { url: url, visible: true }, includes: [ User ] })
      .then(function (model) {
        audio = model
        if (!audio) throw new Error('none')
        return audio.getUser()
      })
      .then(function (user) {
        if (username === user.username) {
          serve(audio, res, isDownload)
        } else {
          throw new Error('none')
        }
      })
      .catch(function (err) {
        if (err.message !== 'none') {
          throw err
        }
        return next()
      })
  } else {
    return next()
  }
}

module.exports.delete = function (req, res, next) {
  let audio
  const id = parseInt(req.params.id, 10)

  Audio.findOne({ where: { id: id } }, { include: [ Audio.User ] })
    .then(function (record) {
      audio = record
      return audio
    })
    .then(function () {
      console.log(audio)
    })
}

module.exports.create = function (req, res, next) {
  createAudio
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
  let audio
  const id = parseInt(req.params.id, 10)

  Audio.findOne({ where: { id: id } }, { include: [ Audio.User ] })
    .then(function (record) {
      audio = record
      return audio
    })
    .then(function () {
      if (req.user.id !== audio.userId) {
        throw new Error('unauthorized')
      }
    })
    .then(function () {
      if (req.body.url) {
        audio.url = req.body.url.toLowerCase()
      }
      if (typeof req.body.visible !== 'undefined') {
        audio.visible = req.body.visible
      }
      return audio.validate()
    })
    .then(function (err) {
      if (err) throw err

      return audio.save()
    })
    .then(function () {
      return audio.toJSON()
    })
    .then(function (json) {
      return res.status(200).json(json)
    })
    .catch(function (err) {
      let errors = []

      if (err.name === 'SequelizeValidationError') {
        const validationErrors = compact(err.errors.map(function (propertyError) {
          if (propertyError.path === 'url' && propertyError.message === 'Validation len failed') {
            return 'Please keep url less than 128 characters.'
          } else if (propertyError.path === 'url' && propertyError.message === 'Validation is failed') {
            return "Only URL safe characters allowed - letters, numbers, and any of `-', `_', `.'"
          } else {
            return null
          }
        }))

        if (validationErrors.length < 1) {
          validationErrors.push('Something went wrong with what you entered.')
        }

        errors = validationErrors
      } else if (err.name === 'SequelizeUniqueConstraintError') {
        errors.push(`You already have a upload with the url "${err.errors[0].value}"`)
      } else if (err.message === 'unauthorized') {
        return res.status(403).json({ errors: ["That isn't your upload!"] })
      } else if (err.message === 'required param `url`') {
        errors.push('Missing required param `url`.')
      }
      console.log(err)
      return res.status(422).json({
        errors: errors.length ? errors : ['Something went wrong.']
      })
    })
}

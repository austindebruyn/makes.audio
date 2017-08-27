const Audio = require('../models').Audio
const User = require('../models').User
const hashFiles = require('hash-files')
const fs = require('fs')
const path = require('path')
const serve = require('../services/serve')
const compact = require('lodash.compact')
const config = require('../config')
const pick = require('lodash.pick')

module.exports.index = function (req, res, next) {
  Audio.findAll({ where: { userId: req.user.id }})
  .then(function (records) {
    return Promise.all(records.map(r => r.toJSON()))
  })
  .then(function (records) {
    return res.status(200).json(records)
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

    Audio.findOne({ where: { url: url, visible: true }, includes: [ User ]})
    .then(function (model) {
      audio = model
      if (!audio) throw new Error('none')
      return audio.getUser()
    })
    .then(function (user) {
      if (username === user.username) {
        serve(audio, res, isDownload)
      }
      else {
        throw new Error('none')
      }
    })
    .catch(function (err) {
      if (err.message !== 'none') {
        throw err
      }
      return next()
    })
  }
  else {
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
  /*
  { fieldname: 'file',
  originalname: '1f1fa-1f1f8.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'uploads/',
  filename: '27c831699f35a2033fc089029c2ae783',
  path: 'uploads/27c831699f35a2033fc089029c2ae783',
  size: 903 }
  */
  const errors = []
  const MAXIMUM_FILE_SIZE = 1024 * 1024 * 20

  if (!req.file) {
    return res.status(422).json({ errors: ['Looks like you didnt upload anything.'] })
  }
  else {
    if (req.file.size > MAXIMUM_FILE_SIZE) {
      errors.push('File is too large! 1MB max please!')
    }
    // if (!['audio/mpeg', 'audio/mp3'].includes(req.file.mimetype)) {
    //   errors.push('File is not an mp3!')
    // }
  }

  const filename = req.file.path

  if (errors.length > 0) {
    fs.unlink(filename, function (err) {
      if (err) throw err

      return res.status(422).json({
        errors: errors
      })
    })
  }
  else {
    hashFiles({ files: [filename], noGlob: true, algorithm: 'sha256' }, function (err, hash) {
      if (err) throw err

      fs.rename(filename, path.resolve(__dirname, '..', 'store', hash), function (err) {
        if (err) throw err

        url = req.file.originalname.replace(/[^\w\.\-]/g, '')
        url = url.slice(0, 128)
        url = url.toLowerCase()

        Audio.count({ where: { userId: req.user.id, url: url } })
        .then(function (count) {
          if (count !== 0) {
            throw new Error('url not unique')
          }

          return Audio.create({
            userId: req.user.id,
            hash: hash,
            originalName: req.file.originalname,
            url: url,
            size: req.file.size,
            mimetype: req.file.mimetype
          }, { include: [ Audio.User ] })
        })
        .then(function (audio) {
          return audio.toJSON()
        })
        .then(function (json) {
          return res.status(201).json(json)
        })
        .catch(function (err) {
          if (err.message === 'url not unique') {
            return res.status(422).json({ errors: [`You already have an upload named '${url}'!`] })
          }
          return next(err)
        })
      })
    })
  }
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
      return
    })
    .then(function () {
      if (req.body.url) {
        audio.url = req.body.url.toLowerCase()
      }
      if ('undefined' !== typeof req.body.visible) {
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
          }
          else if (propertyError.path === 'url' && propertyError.message === 'Validation is failed') {
            return "Only URL safe characters allowed - letters, numbers, and any of `-', `_', `.'"
          }
          else {
            return null
          }
        }))

        if (validationErrors.length < 1) {
          validationErrors.push('Something went wrong with what you entered.')
        }

        errors = validationErrors
      }
      else if (err.name === 'SequelizeUniqueConstraintError') {
        errors.push(`You already have a upload with the url "${err.errors[0].value}"`);
      }
      else if (err.message === 'unauthorized') {
        return res.status(403).json({ errors: ["That isn't your upload!"] })
      }
      else if (err.message === 'required param `url`') {
        errors.push('Missing required param `url`.')
      }
      console.log(err)
      return res.status(422).json({
        errors: errors.length ? errors : ['Something went wrong.']
      })
    })
}

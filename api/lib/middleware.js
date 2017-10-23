const _ = require('lodash')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const express = require('express')
const config = require('../config')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const sessionStore = require('./sessionStore')
const winston = require('winston')
const Raven = require('raven')
const cors = require('cors')

module.exports = function (app) {
  app.root = path.resolve(__dirname, '..', '..')

  if (config.app.sentry.secret) {
    const dsn = `https://${config.app.sentry.public}:${config.app.sentry.secret}@sentry.io/213755`
    Raven.config(dsn).install()
  }

  const transports = config.app.logging ? [new winston.transports.Console()] : []
  winston.configure({ transports })

  app.set('views', path.resolve(app.root, 'api', 'views'))
  app.set('view engine', 'pug')

  app.use(cors({
    origin: function (origin, next) {
      return next(null, true)
    }
  }))

  app.use(require('body-parser').urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(cookieParser(config.app.cookieSecret))
  app.use(express.static(path.resolve(app.root, 'public')))

  app.use(session({ secret: config.app.sessionSecret, resave: true, saveUninitialized: true, store: sessionStore }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use(function (req, res, next) {
    res.setHeader('X-Hello', 'Have A Good time')
    next()
  })

  app.use(function (req, res, next) {
    if (config.app.sentry.secret) {
      const user = {
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }
      if (req.user) {
        Object.assign(user, _.pick(req.user, 'id', 'username', 'email'))
      }

      Raven.setContext({ user })
    }
    next()
  })
}

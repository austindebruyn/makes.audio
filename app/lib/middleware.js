const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const express = require('express')
const expressFlash = require('express-flash')
const config = require('../config')
const db = require('../services/db')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const sessionStore = require('./sessionStore')
const winston = require('winston')

module.exports = function (app) {
  return new Promise(function (resolve, reject) {
    app.root = path.resolve(__dirname, '..', '..')
    app.db = db

    const transports = config.app.logging ? [new winston.transports.Console()] : []
    winston.configure({ transports })

    app.set('views', path.resolve(app.root, 'app', 'views'))
    app.set('view engine', 'pug')

    app.use(require('body-parser').urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(cookieParser(config.app.cookieSecret))
    app.use(express.static(path.resolve(app.root, 'public')))

    app.use(session({ secret: config.app.sessionSecret, resave: true, saveUninitialized: true, store: sessionStore }))
    app.use(expressFlash())
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(function (req, res, next) {
      res.setHeader('X-Hello', 'Have A Good time')
      next()
    })

    app.use(function (err, req, res, next) {
      if (err.message === 'unauthorized') {
        if (!req.user) {
          req.flash('err', 'You need to sign in for that.')
          return res.redirect('/')
        } else {
          req.flash('err', "You aren't authorized to be doing that.")
          return res.redirect('/dashboard')
        }
      }
      return next(err)
    })

    resolve(app)
  })
}

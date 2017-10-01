const upload = require('multer')({ dest: 'tmp/uploads/' })
const usersController = require('../domain/users/usersController')
const audiosController = require('../domain/audios/audiosController')
const sessionsController = require('../domain/sessions/sessionsController')
const passwordResetsController = require('../domain/passwordResets/passwordResetsController')
const emailPreferencesController = require('../domain/emailPreferences/emailPreferencesController')
const homeController = require('../domain/home/homeController')
const errorHandler = require('./errorHandler')

function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    if (req.accepts('html')) {
      return res.redirect('/')
    }
    return res.status(403).json({ ok: false })
  }
  return next()
}

function ensureAnonymous(req, res, next) {
  if (req.user) {
    if (req.accepts('html')) {
      return res.redirect('/')
    }
    return res.status(403).json({ ok: false })
  }
  return next()
}

module.exports = function (app) {
  app.get('/', homeController.index)

  app.use(audiosController.get)

  app.post('/login', sessionsController.create)
  app.post('/logout', sessionsController.destroy)
  app.post('/api/users', usersController.create)
  app.post('/api/passwordResets', ensureAnonymous, passwordResetsController.create)
  app.post('/api/passwordResets/complete', ensureAnonymous, passwordResetsController.complete)
  app.get('/api/users/me', ensureAuthenticated, usersController.get)
  app.put('/api/users/me', ensureAuthenticated, usersController.update)
  app.get('/api/users/me/emailPreferences', ensureAuthenticated, emailPreferencesController.get)
  app.patch('/api/users/me/emailPreferences', emailPreferencesController.update)
  app.post('/api/users/me/emailPreferences/sendVerificationEmail', ensureAuthenticated, emailPreferencesController.sendVerificationEmail)
  app.get('/api/audios', ensureAuthenticated, audiosController.index)
  app.post('/api/audios', ensureAuthenticated, upload.single('file'), audiosController.create)
  app.put('/api/audios/:id', ensureAuthenticated, audiosController.update)
  app.get('*', homeController.index)

  app.use(errorHandler)
}

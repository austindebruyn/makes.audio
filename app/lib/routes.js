const upload = require('multer')({ dest: 'uploads/' })
const usersController = require('../domain/users/usersController')
const audiosController = require('../domain/audios/audiosController')
const sessionsController = require('../domain/sessions/sessionsController')
const homeController = require('../domain/home/homeController')

function ensureAuthenticated(req, res, next) {
  if (!req.user) return res.redirect('/')
  return next()
}

module.exports = function (app) {
  return new Promise(function (resolve, reject) {
    app.get('/', homeController.index)

    app.use(audiosController.get)

    app.post('/login', sessionsController.create)
    app.post('/logout', sessionsController.destroy)
    app.post('/api/users', usersController.create)
    app.put('/api/users/me', usersController.update)
    app.get('/api/audios', ensureAuthenticated, audiosController.index)
    app.post('/api/audios', ensureAuthenticated, upload.single('file'), audiosController.create)
    app.put('/api/audios/:id', ensureAuthenticated, audiosController.update)
    app.get('*', homeController.index)

    resolve(app)
  })
}
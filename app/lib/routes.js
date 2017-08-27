const upload = require('multer')({ dest: 'uploads/' })

function ensureAuthenticated(req, res, next) {
  if (!req.user) return res.redirect('/')
  return next()
}

module.exports = function (app) {
  return new Promise(function (resolve, reject) {
    app.get('/', app.controllers.home.index)

    app.use(app.controllers.audios.get)

    app.post('/login', app.controllers.sessions.create)
    app.post('/logout', app.controllers.sessions.destroy)
    app.post('/api/users', app.controllers.users.create)
    app.get('/api/audios', ensureAuthenticated, app.controllers.audios.index)
    app.post('/api/audios', ensureAuthenticated, upload.single('file'), app.controllers.audios.create)
    app.put('/api/audios/:id', ensureAuthenticated, app.controllers.audios.update)
    app.get('*', app.controllers.home.index)

    resolve(app)
  })
}

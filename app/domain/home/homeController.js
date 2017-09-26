const config = require('../../config')

module.exports.index = function (req, res, next) {
  const context = {
    sentry: {
      public: config.app.sentry.public
    }
  }

  if (req.user) {
    return req.user.toJSON().then(function (json) {
      return res.render('index', {
        user: json,
        context
      })
    }).catch(next)
  }

  return res.render('index', {
    context
  })
}

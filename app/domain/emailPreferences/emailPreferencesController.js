const EmailPreferences = require('./EmailPreferences')

class EmailPreferencesError extends Error {
  constructor(code, data = {}) {
    super()
    this.name = 'EmailPreferencesError'
    this.code = code
    Object.assign(this, data)
  }

  toJSON() {
    if (this.fields) {
      return { code: this.code, fields: this.fields }
    }
    return { code: this.code }
  }
}

module.exports.get = function (req, res, next) {
  return EmailPreferences.findOne({ where: { userId: req.user.id } })
    .then(function (record) {
      if (record === null) {
        throw new EmailPreferencesError('NOT_FOUND')
      }
      return record.toJSON()
    })
    .then(function (json) {
      return res.json({
        ok: true,
        record: json
      })
    })
    .catch(function (err) {
      if (err.name === 'EmailPreferencesError') {
        if (err.code === 'NOT_FOUND') {
          return res.status(404).json({
            ok: false
          })
        }
      }
      return next(err)
    })
}

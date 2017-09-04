const bcrypt = require('bcrypt')

module.exports.hash = function hashPassword(password) {
  return new Promise(function (resolve, reject) {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(resolve)
      .catch(reject)
  })
}

module.exports.verify = function verifyPassword(attempt, actual) {
  return bcrypt.compare(attempt, actual)
}

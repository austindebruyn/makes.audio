const db = require('../../services/db')
const User = require('../users/User')

const PasswordReset = db.define('password_resets', {
  code: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  claimedAt: {
    type: db.Sequelize.DATE
  }
})

PasswordReset.belongsTo(User)
User.hasOne(PasswordReset)

module.exports = PasswordReset

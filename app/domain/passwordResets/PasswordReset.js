const db = require('../../services/db')
const User = require('../users/User')

const PasswordReset = db.define('passwordResets', {
  code: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  claimedAt: {
    type: db.Sequelize.DATE
  }
}, {
  tableName: 'password_resets'
})

PasswordReset.belongsTo(User)
User.hasOne(PasswordReset)

module.exports = PasswordReset

const db = require('../../services/db')
const User = require('../users/User')

const InviteCode = db.define('inviteCodes', {
  createdAt: { type: db.Sequelize.DATE, defaultValue: db.Sequelize.NOW },
  code: { type: db.Sequelize.STRING, allowNull: false, unique: true }
}, {
  tableName: 'invite_codes'
})

InviteCode.belongsTo(User)
User.hasOne(InviteCode)

module.exports = InviteCode

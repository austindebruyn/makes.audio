const db = require('../services/db')
const User = require('./User')

const InviteCode = db.define('inviteCodes', {
  createdAt: { type: db.Sequelize.DATE, defaultValue: db.Sequelize.NOW },
  code: { type: db.Sequelize.STRING, allowNull: false, unique: true }
})

InviteCode.belongsTo(User)

module.exports = InviteCode

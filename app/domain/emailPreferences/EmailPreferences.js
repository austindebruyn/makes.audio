const db = require('../../services/db')
const User = require('../users/User')

const EmailPreferences = db.define('emailPreferences', {
  verificationCode: {
    type: db.Sequelize.STRING,
    allowNull: true
  },
  verifiedAt: {
    type: db.Sequelize.DATE,
    allowNull: true
  },
  optedOutAt: {
    type: db.Sequelize.DATE,
    allowNull: true
  }
}, {
  tableName: 'email_preferences',
  freezeTableName: true,
  name: {
    singular: 'emailPreferences'
  }
})

EmailPreferences.prototype.toJSON = function () {
  return new Promise(resolve => {
    const {
      id,
      userId,
      createdAt,
      updatedAt,
      optedOutAt,
      verifiedAt
    } = this.get()

    return resolve({
      id,
      userId,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString(),
      optedOutAt: optedOutAt && optedOutAt.toUTCString(),
      verifiedAt: verifiedAt && verifiedAt.toUTCString()
    })
  })
}

EmailPreferences.belongsTo(User)
User.hasOne(EmailPreferences)

module.exports = EmailPreferences

const User = require('../domain/users/User')
const EmailPreferences = require('../domain/emailPreferences/EmailPreferences')
const uid = require('uid-safe')

module.exports = {
  up: function (q, Sequelize) {
    return q.createTable('email_preferences', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      verificationCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      verifiedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      optedOutAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    }).then(function () {
      return User.findAll({})
    }).then(function (users) {
      return Promise.all(users.map(u => {
        return uid(24).then(function (verificationCode) {
          return EmailPreferences.create({
            userId: u.id,
            verificationCode
          })
        })
      }))
    })
  },
  down: function (q, Sequelize) {
    return q.dropTable('email_preferences')
  }
}

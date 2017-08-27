const db = require('../services/db')

const User = db.define('user', {
  createdAt: { type: db.Sequelize.DATE, defaultValue: db.Sequelize.NOW },

  username: {
    type: db.Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 64],
      is: {
        args: /^[\w\-]*$/i,
        msg: 'Only use letters and numbers!'
      }
    }
  },
  password: { type: db.Sequelize.STRING }
})

module.exports = User

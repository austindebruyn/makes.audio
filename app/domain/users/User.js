const db = require('../../services/db')

const User = db.define('user', {
  email: {
    type: db.Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  username: {
    type: db.Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 64],
      is: {
        args: /^[\w-]*$/i,
        msg: 'Only use letters and numbers!'
      }
    }
  },
  password: {
    type: db.Sequelize.STRING,
    allowNull: false
  }
})

User.prototype.toJSON = function () {
  return new Promise(resolve => {
    return resolve({
      id: this.get('id'),
      username: this.get('username'),
      email: this.get('email'),
      createdAt: this.get('createdAt').toUTCString(),
      updatedAt: this.get('updatedAt').toUTCString()
    })
  })
}

module.exports = User

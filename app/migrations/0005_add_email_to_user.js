module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('users', 'email', { type: Sequelize.STRING, allowNull: false, unique: true })
  },
  down: function (q, Sequelize) { console.log(q)
    return q.removeColumn('users', 'email')
  }
}

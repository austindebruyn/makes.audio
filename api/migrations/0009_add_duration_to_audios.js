module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('audios', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  },
  down: function (q, Sequelize) {
    return q.removeColumn('audios', 'duration')
  }
}

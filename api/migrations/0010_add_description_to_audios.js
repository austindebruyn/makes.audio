module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('audios', 'description', Sequelize.STRING)
  },
  down: function (q, Sequelize) {
    return q.removeColumn('audios', 'description')
  }
}

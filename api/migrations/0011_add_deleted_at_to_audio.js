module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('audios', 'deletedAt', Sequelize.DATE)
  },
  down: function (q, Sequelize) {
    return q.removeColumn('audios', 'deletedAt')
  }
}

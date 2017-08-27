module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('audios', 'visible', { type: Sequelize.BOOLEAN, defaultValue: true })
  },
  down: function (q, Sequelize) {
    return q.removeColumn('audios', 'visible')
  }
}

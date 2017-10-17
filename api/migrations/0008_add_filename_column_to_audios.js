module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('audios', 'filename', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },
  down: function (q, Sequelize) {
    return q.removeColumn('audios', 'filename')
  }
}

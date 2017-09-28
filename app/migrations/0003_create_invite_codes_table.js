module.exports = {
  up: function (q, Sequelize) {
    return q.createTable('inviteCodes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      code: { type: Sequelize.STRING, allowNull: false, unique: true },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    })
  },
  down: function (q, Sequelize) {
    return q.dropTable('inviteCodes')
  }
}

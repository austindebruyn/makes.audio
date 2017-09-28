module.exports = {
    up: function (q, Sequelize) {
      return q.createTable('audios', {
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
        hash: { type: Sequelize.STRING, allowNull: false },
        originalName: { type: Sequelize.STRING, allowNull: false },
        size: { type: Sequelize.DOUBLE, allowNull: false },
        mimetype: { type: Sequelize.STRING, allowNull: false },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false
        } }, {
        indexes: [ {
          unique: true,
          fields: [ 'userId', 'url' ]
        } ],
      })
    },
    down: function (q, Sequelize) {
      return q.dropTable('audios')
    }
  }
  
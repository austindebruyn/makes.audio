const Sequelize = require('sequelize')
const config  = require('../config')

module.exports = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: 'mysql',
  logging: false,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

module.exports.Sequelize = Sequelize

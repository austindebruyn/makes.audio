const Umzug = require('umzug')
const Sequelize = require('sequelize')
const sequelize = require('../app/services/db')
const program = require('commander')
program
  .option('-r, --rollback', 'Rollback migrations')
  .parse(process.argv)

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
    modelName: 'Migration',
    tableName: 'migrations',
    columnName: 'name',
    columnType: new Sequelize.STRING(255)
  },
  migrations: {
    path: 'app/migrations',
    params: [ sequelize.getQueryInterface(), sequelize.constructor ]
  }
})

if (program.rollback) {
  umzug.down().then(function (migrations) {
    migrations.forEach(function (m) {
      console.log(`Rolled back ${m.file}!`)
    })
    console.log('Done!')
    process.exit()
  })
}
else {
  umzug.up().then(function (migrations) {
    migrations.forEach(function (m) {
      console.log(`Ran ${m.file}!`)
    })
    console.log('Done!')
    process.exit()
  })
}

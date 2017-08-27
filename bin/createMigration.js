const fs = require('fs')
const path = require('path')
const leftPad = require('left-pad')
const inquirer = require('inquirer')

const migrationsDir = path.join(__dirname, '..', 'app', 'migrations')
const migrationFilenames = fs.readdirSync(migrationsDir)

const DEFAULT_MIGRATION = `module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('audios', 'column_name', Sequelize.STRING)
  },
  down: function (q, Sequelize) {
    return q.removeColumn('audios', 'column_name')
  }
}
`

let currentIndex = 1
migrationFilenames.forEach(function (fname) {
  const match = fname.match(/^(\d\d\d\d)_[\.\w]+$/)

  if (!match) {
    throw new Error(`Bad filename ${fname}`)
  }
  if (parseInt(match[1]) !== currentIndex) {
    throw new Error(`Migration ${fname} should be ${leftPad(currentIndex, 4, '0')}`)
  }
  currentIndex++
})

inquirer.prompt([{
  type: 'string',
  name: 'name',
  message: 'Name the file:'
 }])
.then(function (answers) {
  const newFilename = `${leftPad(currentIndex, 4, '0')}_${answers.name.replace(' ', '_')}.js`
  const fullFilename = path.join(migrationsDir, newFilename)

  console.log(`Creating ${newFilename}`)

  fs.writeFileSync(fullFilename, DEFAULT_MIGRATION)

  console.log('Done!')
})
.catch(function (err) {
  console.error(err)
})

const config = require('../api/config')
const mysql = require('mysql2/promise')

var connection

function query(sql) {
  return function () {
    console.log(sql)
    return connection.query(sql)
  }
}

mysql.createConnection({
  user: config.db.username,
  host: config.db.host,
  password: config.db.password
})
  .then(function (con) {
    connection = con
    console.log(`Connected to mySQL ${config.db.username}@${config.db.host}:${config.db.database}`)

    return query(`CREATE DATABASE IF NOT EXISTS ${config.db.database}`)()
  })
  .then(query(`USE ${config.db.database}`))
  .then(query(`CREATE TABLE IF NOT EXISTS migrations (name VARCHAR(255))`))
  .then(function () {
    console.log('Done!')
  })
  .catch(function (err) {
    console.error(err)
  })
  .then(function () {
    return connection.end()
  })

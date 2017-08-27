const config = require('../app/config')
const mysql = require('mysql')

const con = mysql.createConnection({
  user: config.db.username,
  host: config.db.host,
  password: config.db.password,
  database: config.db.database
})

con.connect(function(err) {
  if (err) throw err

  const sql = `CREATE TABLE migrations (name VARCHAR(255))`
  console.log(`Connected to mySQL ${config.db.username}@${config.db.host}:${config.db.database}`)
  console.log(`Running: ${sql}`)

  con.query(sql, function (err, result) {
    if (err) throw err

    console.log('Done!')
    con.end()
  })
})

const express = require('express')
const app = express()

Promise.resolve(app)
  .then(require('./app/lib/middleware'))
  .then(require('./app/lib/routes'))
  .then(require('./app/lib/boot'))
  .catch(function (err) {
    console.log(err)
    process.exit(1)
  })

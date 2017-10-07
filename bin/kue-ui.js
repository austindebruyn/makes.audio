const express = require('express')
const app = express()
const config = require('../api/config')
const basicAuth = require('basic-auth-connect')
const kue = require('kue')

if (config.kue.ui.username) {
  const { username, password } = config.kue.ui
  app.use(basicAuth(username, password))
}

app.use(kue.app)
app.listen(config.kue.ui.port)

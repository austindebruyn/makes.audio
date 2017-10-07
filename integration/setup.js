const fs = require('fs')
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
chai.use(chaiAsPromised)

const express = require('express')
const app = express()
const db = require('../api/services/db')
var server

before(function () {  
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('NODE_ENV is not test')
  }

  require('../api/lib/middleware')(app)
  require('../api/lib/routes')(app)
  server = require('../api/lib/boot')(app)
})

after(function () {
  return server.close()
})

beforeEach(function () {
  return db.sync({ force: true })
})

for (const file of fs.readdirSync(path.resolve(__dirname, 'hooks'))) {
  if (file.match(/\.js$/)) {
    require(path.resolve(__dirname, 'hooks', file))
  }
}

for (const file of fs.readdirSync(__dirname)) {
  if (file.match(/\.test\.js$/)) {
    require(path.resolve(__dirname, file))
  }
}

const fs = require('fs')
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
chai.use(chaiAsPromised)

const express = require('express')
const app = express()
const db = require('../app/services/db')
var server

before(function () {  
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('NODE_ENV is not test')
  }

  require('../app/lib/middleware')(app)
  require('../app/lib/routes')(app)
  server = require('../app/lib/boot')(app)
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

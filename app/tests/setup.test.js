const db = require('../services/db')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

beforeEach(function () {
  return db.sync({ force: true })
})

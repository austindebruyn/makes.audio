const db = require('../services/db')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
chai.use(chaiAsPromised)

beforeEach(function () {
  return db.sync({ force: true })
})

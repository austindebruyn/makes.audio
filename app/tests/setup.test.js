const db = require('../services/db')
const getKue = require('../jobs/getKue')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
chai.use(chaiAsPromised)

beforeEach(function () {
  return db.sync({ force: true })
})

before(function() {
  getKue.q = { create: () => { return { save: c => { setTimeout(c, 100); return { id: 1 }} }}}
})

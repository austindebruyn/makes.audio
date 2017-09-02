/* eslint-disable */

const _ = require('lodash')
const supertest = require('supertest')

var cookies = {}

supertest.Test.prototype.cookiejar = function cookiejar(agent) {
  const cookieString = _(cookies)
    .toPairs()
    .map(pair => pair.join('='))
    .join(';')
  return this.set('Cookie', cookieString)
}

beforeEach(function () {
  clear()
})

function add(key, val) {
  cookies[key] = val
}

function clear() {
  cookies = {}
}

module.exports = {
  add,
  clear
}

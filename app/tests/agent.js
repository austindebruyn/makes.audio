/* eslint-disable */

const express = require('express')
const supertest = require('supertest')

var _agent

function boot() {
  if (_agent) {
    return Promise.resolve(_agent)
  }

  return Promise.resolve(express())
    .then(require('../lib/middleware'))
    .then(require('../lib/routes'))
    .then(function (app) {
      _agent = supertest(app)
      return null
    })
    .catch(function (err) {
      console.error(err)
    })
}

before(function () {
  return boot()
})

module.exports = function () {
  return _agent
}

/* eslint-disable */

const sinon = require('sinon')

module.exports = function () {
  var clock

  beforeEach(function () {
    clock = sinon.useFakeTimers({
      now: new Date('2017-08-31T00:00:00.001Z'),
      toFake: [ 'Date' ]
    })
  })

  afterEach(function () {
    clock.restore()
  })
}

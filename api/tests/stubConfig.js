/* global afterEach, beforeEach */
const config = require('../config')
const dotProp = require('dot-prop')

function stubConfig(key, val) {
  var oldValue

  beforeEach(function () {
    oldValue = dotProp.get(config, key)
    dotProp.set(config, key, val)
  })

  afterEach(function () {
    dotProp.set(config, key, oldValue)
  })
}

module.exports = stubConfig

const NodeCache = require('node-cache')
const config = require('../config')

module.exports = new NodeCache({
  stdTTL: config.app.cache.defaultTimeout
})

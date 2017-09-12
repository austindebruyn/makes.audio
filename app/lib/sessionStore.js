const _ = require('lodash')
const config = require('../config')
const session = require('express-session')

var SessionStoreClass = null
var options = {}

switch (config.app.sessionDriver) {
  case 'file':
    SessionStoreClass = require('session-file-store')(session)
    break
  case 'redis':
    SessionStoreClass = require('connect-redis')(session)
    options = _.pick(config.redis, 'host', 'port')
    break
}

module.exports = new SessionStoreClass(options)

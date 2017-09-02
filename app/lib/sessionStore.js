const config = require('../config')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

module.exports = new FileStore({})

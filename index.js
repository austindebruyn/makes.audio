const express = require('express')
const app = express()

require('./api/lib/middleware')(app)
require('./api/lib/routes')(app)
require('./api/lib/boot')(app)

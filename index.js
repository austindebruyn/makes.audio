const express = require('express')
const app = express()

require('./app/lib/middleware')(app)
require('./app/lib/routes')(app)
require('./app/lib/boot')(app)

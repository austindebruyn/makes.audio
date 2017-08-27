const fs = require('fs')
const path = require('path')

fs.readdirSync(__dirname).forEach(function (filename) {
  if (filename !== 'index.js') {
    module.exports[path.basename(filename, '.js')] = require(path.resolve(__dirname, filename))
  }
})

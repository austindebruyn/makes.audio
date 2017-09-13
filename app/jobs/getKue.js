const kue = require('kue')

getKue.q = null

function getKue() {
  getKue.q = getKue.q || kue.createQueue()
  return getKue.q
}

module.exports = getKue

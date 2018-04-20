const stream = require('stream')
const util = require('util')

function MockReadableStream() {
  stream.Readable.call(this)
}

util.inherits(MockReadableStream, stream.Readable)

MockReadableStream.prototype._read = function (size) {
  // return null
  this.emit('end')
}

module.exports = MockReadableStream

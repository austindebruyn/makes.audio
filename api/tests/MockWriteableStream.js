const stream = require('stream')
const util = require('util')

function MockWriteableStream() {
  stream.Writable.call(this);
}

util.inherits(MockWriteableStream, stream.Writable)

MockWriteableStream.prototype._write = function (chunk, encoding, done) {
  done()
}

module.exports = MockWriteableStream

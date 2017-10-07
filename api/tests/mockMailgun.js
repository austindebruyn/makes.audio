const sinon = require('sinon')

function mockMailgun(opts) {
  const mockMg = {
    messages: function () {
      return {
        send: function () {
          mockMg.send.apply(null, arguments)

          if (opts.succeeds) {
            return Promise.resolve({
              id: '<20170913061408.34260.78C88EA7BE247B5B@mg.makes.audio>',
              message: 'Queued. Thank you.'
            })
          } else {
            return Promise.reject(new Error('getaddrinfo EAI_AGAIN api.mailgun.net:443'))
          }
        }
      }
    },

    reset: function () {
      mockMg.send.reset()
    }
  }

  mockMg.send = sinon.spy()

  return mockMg
}

module.exports = mockMailgun

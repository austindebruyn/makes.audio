const audiosController = require('./audiosController')
const agent = require('../../tests/agent')
const clock = require('../../tests/clock')
const signIn = require('../../tests/signIn')
const expect = require('chai').expect
const sinon = require('sinon')

describe('audiosController', function () {
  clock()

  describe('get /api/AUDIOS', function () {
    it('should 403', function () {
      return agent()
        .get('/api/audios')
        .expect(403)
    })
  })
})

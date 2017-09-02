const audiosController = require('./audiosController')
const agent = require('../../tests/agent')
const clock = require('../../tests/clock')
const signIn = require('../../tests/signIn')
const expect = require('chai').expect
const sinon = require('sinon')
const factory = require('../../tests/factory')

describe('audiosController', function () {
  clock()

  describe('get /api/AUDIOS', function () {
    it('when signed out should 403', function () {
      return agent()
        .get('/api/audios')
        .expect(403)
    })

    describe('when signed in', function () {
      beforeEach(function () {
        return signIn()
      })

      it('should return empty array', function () {
        return agent()
          .get('/api/audios')
          .cookiejar()
          .expect(200, {
            ok: true,
            records: []
          })
      })

      it('should return some audios', function () {
        return factory
          .createMany('audio', 5, { userId: signIn.currentUser.id })
          .then(models => {
            return Promise.all(models.map(m => m.toJSON()))
          })
          .then(function (records) {
            return agent()
              .get('/api/audios')
              .cookiejar()
              .expect(200)
              .then(function (res) {
                expect(res.body.ok).to.be.true;
                expect(res.body.records).to.have.deep.members(records)
              })
        })
      })
    })
  })
})

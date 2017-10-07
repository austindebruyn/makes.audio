const homeController = require('./homeController')
const agent = require('../../tests/agent')
const signIn = require('../../tests/signIn')
const expect = require('chai').expect

describe('homeController', function () {
  describe('GET /', function () {
    describe('when signed out', function () {
      it('should render template without', function () {
        return agent()
          .get('/')
          .expect(200)
          .then(function (resp) {
            expect(resp.text).not.to.include('data-user')
          })
      })
    })

    describe('when signed in', function () {
      beforeEach(function () {
        return signIn()
      })

      it('should render template with user', function () {
        return agent()
          .get('/')
          .cookiejar()
          .expect(200)
          .then(function (resp) {
            expect(resp.text).to.include('data-user')
          })
      })
    })
  })
})

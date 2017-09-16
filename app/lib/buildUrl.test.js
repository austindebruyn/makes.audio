const config = require('../config')
const buildUrl = require('./buildUrl')
const expect = require('chai').expect

describe('buildUrl', function () {
  it('should return root', function () {
    expect(buildUrl()).to.eql('https://makes.audio')
  })

  it('should include path', function () {
    expect(buildUrl('/route')).to.eql('https://makes.audio/route')
    expect(buildUrl('route')).to.eql('https://makes.audio/route')
  })

  it('should include subdomain', function () {
    expect(buildUrl('/route.jpg', 'dallas')).to.eql('https://dallas.makes.audio/route.jpg')
    expect(buildUrl('route/thing', 'dallas')).to.eql('https://dallas.makes.audio/route/thing')
  })

  describe('when app listening on port', function () {
    var oldPort = null

    beforeEach(function () {
      oldPort = config.app.port
      config.app.port = 3000
    })

    afterEach(function () {
      config.app.port = oldPort
    })

    it('should include port', function () {
      expect(buildUrl('route')).to.eql('https://makes.audio:3000/route')
    })
  })
})

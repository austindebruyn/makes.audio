const config = require('../config')
const buildUrl = require('./buildUrl')
const expect = require('chai').expect

function stubConfig(key, val) {
  var oldValue

  beforeEach(function () {
    oldValue = config.app[key]
    config.app[key] = val
  })

  afterEach(function () {
    config.app[key] = oldValue
  })
}

describe('buildUrl', function () {
  stubConfig('host', 'makes.audio')
  stubConfig('protocol', 'https')
  stubConfig('port', null)

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
    stubConfig('port', 3000)

    it('should include port', function () {
      expect(buildUrl('route')).to.eql('https://makes.audio:3000/route')
    })
  })
})

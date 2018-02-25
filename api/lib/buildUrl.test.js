const buildUrl = require('./buildUrl')
const expect = require('chai').expect
const stubConfig = require('../tests/stubConfig');

describe('buildUrl', function () {
  stubConfig('app.host', 'makes.audio')
  stubConfig('app.protocol', 'https')
  stubConfig('app.port', null)

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
    stubConfig('app.port', 3000)

    it('should include port', function () {
      expect(buildUrl('route')).to.eql('https://makes.audio:3000/route')
    })
  })
})

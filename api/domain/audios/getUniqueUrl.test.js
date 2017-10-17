const _ = require('lodash')
const expect = require('chai').expect
const factory = require('../../tests/factory')
const getUniqueUrl = require('./getUniqueUrl')

describe('#increment', function () {
  it('should add extension', function () {
    expect(getUniqueUrl.increment('cookies.mp3')).to.eql('cookies-1.mp3')
  })
  
  it('should increment extension', function () {
    expect(getUniqueUrl.increment('cookies-1.mp3')).to.eql('cookies-2.mp3')
  })
  
  it('should work with no filetype', function () {
    expect(getUniqueUrl.increment('cookies')).to.eql('cookies-1')
  })
  
  it('should only recognize hyphen + numbers', function () {
    expect(getUniqueUrl.increment('cookies_1')).to.eql('cookies_1-1')
  })
  
  it('should work with big numbers', function () {
    expect(getUniqueUrl.increment('cookies-9999.wav'))
      .to.eql('cookies-10000.wav')
  })
})

describe.only('#getUniqueUrl', function () {
  var user

  beforeEach(function () {
    return factory.create('user').then(function (record) {
      user = record
    })
  })
  
  it('should return the url', function () {
    return expect(getUniqueUrl.getUniqueUrl({
      userId: user.id,
      url: 'apples.mp3'
    })).to.eventually.eql('apples.mp3')
  })
  
  describe('when apples.mp3 already exists', function () {
    beforeEach(function () {
      return factory.create('audio', { userId: user.id, url: 'apples.mp3' })
    })

    it('should return a unique url', function () {
      return expect(getUniqueUrl.getUniqueUrl({
        userId: user.id,
        url: 'apples.mp3'
      })).to.eventually.eql('apples-1.mp3')
    })
  })
  
  describe('recursing', function () {
    beforeEach(function () {
      const userId = user.id

      return factory.create('audio', { userId, url: 'apples.mp3' })
        .then(() => factory.create('audio', { userId, url: 'apples-1.mp3' }))
        .then(() => factory.create('audio', { userId, url: 'apples-2.mp3' }))
        .then(() => factory.create('audio', { userId, url: 'apples-3.mp3' }))
        .then(() => factory.create('audio', { userId, url: 'apples-4.mp3' }))
    })

    it('should return a unique url', function () {
      return expect(getUniqueUrl.getUniqueUrl({
        userId: user.id,
        url: 'apples.mp3'
      })).to.eventually.eql('apples-5.mp3')
    })
  })
})

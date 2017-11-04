const { expect } = require('chai')
const findAudio = require('./findAudio')
const factory = require('../../tests/factory')

describe('findAudio', function () {
  beforeEach(function () {
    return Promise.all([
      factory.create('user', { username: 'justin' }),
      factory.create('user', { username: 'adele' })
    ]).then(users => {
      this.justin = users[0]
      this.adele = users[1]

      return Promise.all([
        factory.create('audio', {
          userId: this.justin.id,
          url: 'friends',
          visible: false
        }),
        factory.create('audio', { userId: this.adele.id, url: 'hello' })
      ])
    }).then(audios => {
      this.friends = audios[0]
      this.hello = audios[1]
    })
  })

  it('should not find missing audio', function () {
    return expect(findAudio.findAudio({
      username: 'banana',
      url: 'whatever',
      user: null
    })).to.eventually.rejected.and.include({ name: 'AudioNotFoundError' })
  })

  it('should not find wrong username', function () {
    return expect(findAudio.findAudio({
      username: 'justin',
      url: 'hello',
      user: null
    })).to.eventually.rejected.and.include({ name: 'AudioNotFoundError' })
  })

  it('should not find wrong username 2', function () {
    return expect(findAudio.findAudio({
      username: 'adele',
      url: 'username',
      user: null
    })).to.eventually.rejected.and.include({ name: 'AudioNotFoundError' })
  })

  it('should find audios', function () {
    return expect(findAudio.findAudio({
      username: 'adele',
      url: 'hello',
      user: null
    })).to.eventually.include({ id: this.hello.id })
  })

  it('should not find invisible audio', function () {
    return expect(findAudio.findAudio({
      username: 'justin',
      url: 'hello',
      user: null
    })).to.eventually.rejected.and.include({ name: 'AudioNotFoundError' })
  })

  describe('when signed in as owner', function () {
    it('should find invisible audio', function () {
      return expect(findAudio.findAudio({
        username: 'justin',
        url: 'friends',
        user: this.justin
      })).to.eventually.include({ id: this.friends.id })
    })
  })
})

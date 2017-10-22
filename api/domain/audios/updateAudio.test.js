const _ = require('lodash')
const expect = require('chai').expect
const Audio = require('./Audio')
const updateAudio = require('./updateAudio')
const factory = require('../../tests/factory')

describe('updateAudio', function () {
  beforeEach(function () {
    return factory.create('audio')
      .then(record => this.audio = record)
      .then(() => this.audio.getUser())
      .then(user => {
        this.user = user
      })
  })
  
  it('should return UNAUTHORIZED', function () {
    return factory.create('user')
      .then(newUser => {
        return expect(updateAudio.updateAudio(newUser, this.audio, {}))
          .to.eventually.be.rejected.and.have.property('code', 'UNAUTHORIZED')
      })
  })
  
  it('should return BAD_ATTRIBUTES', function () {
    const subject = updateAudio.updateAudio(
      this.user,
      this.audio,
      { id: 11 }
    )

    return expect(subject)
      .to.eventually.be.rejected.and.deep.include({
        'code': 'BAD_ATTRIBUTES',
        'fields': ['id']
      })
  })
  
  it('should validate unique', function () {
    return factory.create('audio', { url: 'chicken.mp3' })
      .then(() => {
        const subject = updateAudio.updateAudio(
          this.user,
          this.audio,
          { url: 'chicken.mp3' }
        )

        return expect(subject)
          .to.eventually.be.rejected.and.have.property('code', 'URL_NOT_UNIQUE')
      })
  })

  it('should work', function () {
    const subject = updateAudio.updateAudio(
      this.user,
      this.audio,
      { url: 'bananas.mp3', visible: false }
    )

    return subject.then(() => {
      return expect(Audio.find({ where: { id: this.audio.id } }))
        .to.eventually.include({
          url: 'bananas.mp3',
          visible: false
        })
    })
  })
})

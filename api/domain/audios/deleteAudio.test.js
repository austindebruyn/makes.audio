const _ = require('lodash')
const expect = require('chai').expect
const Audio = require('./Audio')
const deleteAudio = require('./deleteAudio')
const factory = require('../../tests/factory')
const clock = require('../../tests/clock')

describe('deleteAudio', function () {
  clock(new Date('2018-11-13T07:57:33.530Z'))

  beforeEach(function () {
    return factory.create('audio')
      .then(record => this.audio = record)
      .then(() => this.audio.getUser())
      .then(user => {
        this.user = user
      })
  })
  
  it('should return UNAUTHORIZED', async function () {
    const newUser = await factory.create('user')
    await expect(deleteAudio.deleteAudio(newUser, this.audio))
      .to.eventually.be.rejected.and.have.property('code', 'UNAUTHORIZED')
  })

  it('should work', async function () {
    await deleteAudio.deleteAudio(this.user, this.audio);
    const audio = await Audio.find({ where: { id: this.audio.id } })
    expect(audio.deletedAt).to.eql(new Date());
  })
})

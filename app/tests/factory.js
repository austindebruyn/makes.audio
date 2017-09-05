/* global afterEach */

const FactoryGirl = require('factory-girl')
const hashPassword = require('../domain/users/passwords').hash
const User = require('../domain/users/User')
const Audio = require('../domain/audios/Audio')
const adapter = new FactoryGirl.SequelizeAdapter()
const uid = require('uid-safe')

const { factory } = FactoryGirl

factory.setAdapter(adapter)

factory.define('user', User, {
  username: () => uid(10),
  password: () => uid(24),
  email: factory.chance('email')
}, {
  afterBuild: function (model, attrs) {
    return hashPassword(attrs.password || model.password).then(function (hash) {
      model.password = hash
      return model
    })
  }
})

factory.define('audio', Audio, {
  user: factory.assoc('user', 'userId'),
  hash: factory.chance('hash'),
  originalName: () => `${factory.chance('word')()}.mp3`,
  size: 10000,
  mimetype: 'audio/mpeg',
  url: factory.seq('Audio.url', n => `${factory.chance('word')()}${n}`)
})

afterEach(function () {
  return factory.cleanUp()
})

module.exports = factory

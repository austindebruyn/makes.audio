const FactoryGirl = require('factory-girl')
const User    = require('../domain/users/User')
const Audio   = require('../domain/audios/Audio')
const adapter = new FactoryGirl.SequelizeAdapter()
const uid = require('uid-safe')

const { factory } = FactoryGirl

factory.setAdapter(adapter)

factory.define('user', User, {
  username: () => uid(10),
  password: '$2a$10$11Y7AU9HoyKiRjpiqy/Hve9nhfqmedjjzMOwOMdaX82TYZ.4cntX2'
})

factory.define('audio', Audio, {
  user: factory.assoc('user', 'userId'),
  hash: factory.chance('hash'),
  originalName: () => `${factory.chance('word')()}.mp3`,
  size: 10000,
  mimetype: 'audio/mpeg',
  url: factory.seq('Audio.url', n => `${factory.chance('word')()}${n}`),
})

afterEach(function () {
  return factory.cleanUp()
})

module.exports = factory

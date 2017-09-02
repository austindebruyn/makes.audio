const FactoryGirl = require('factory-girl')
const User    = require('../domain/users/User')
const adapter = new FactoryGirl.SequelizeAdapter()
const uid = require('uid-safe')

const { factory } = FactoryGirl

factory.setAdapter(adapter)

factory.define('user', User, {
  username: factory.sequence('User.username', () => uid(10)),
  password: '$2a$10$11Y7AU9HoyKiRjpiqy/Hve9nhfqmedjjzMOwOMdaX82TYZ.4cntX2'
})

module.exports = factory

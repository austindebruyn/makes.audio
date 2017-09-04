const db = require('../../services/db')
const User = require('../users/User')
const config = require('../../config')

const Audio = db.define('audio', {
  createdAt: { type: db.Sequelize.DATE, defaultValue: db.Sequelize.NOW },
  hash: { type: db.Sequelize.STRING, allowNull: false },
  originalName: { type: db.Sequelize.STRING, allowNull: false },
  size: { type: db.Sequelize.DOUBLE, allowNull: false },
  mimetype: { type: db.Sequelize.STRING, allowNull: false },
  visible: { type: db.Sequelize.BOOLEAN, defaultValue: true },
  url: {
    type: db.Sequelize.STRING,
    allowNull: false,
    validate: {
      isLowercase: true,
      is: /^[\w.-]*$/i,
      len: [1, 128]
    }
  } }, {
  indexes: [{
    unique: true,
    fields: [ 'userId', 'url' ]
  } ],
  instanceMethods: {
    ensureUserLoaded: function () {
      if (this.user) {
        return new Promise(resolve => resolve(this.user))
      }
      return User.findOne({ where: { id: this.userId } }).then(user => {
        this.user = user
      })
    },
    toJSON: function () {
      return this.ensureUserLoaded().then(() => {
        const portWithColon = config.app.port ? `:${config.app.port}` : ''
        const url = `${config.app.protocol}://${this.user.username}.${config.app.host}${portWithColon}/${this.url}`
        const formattedSize = (this.size / 1024 / 1024).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'MB'

        return new Promise((resolve, reject) => {
          return resolve({
            id: this.id,
            url: this.url,
            publicUrl: url,
            downloadUrl: `${url}/download`,
            editUrl: `/audios/${this.id}/edit`,
            updateUrl: `/api/audios/${this.id}`,
            formattedSize: formattedSize,
            size: this.size,
            originalName: this.originalName,
            mimetype: this.mimetype,
            createdAt: this.createdAt.toUTCString(),
            visible: this.visible
          })
        })
      })
    }
  }
}
)

Audio.User = Audio.belongsTo(User, { as: 'user' })
User.Audio = User.hasMany(Audio)

module.exports = Audio

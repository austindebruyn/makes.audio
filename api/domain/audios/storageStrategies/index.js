const config = require('../../../config')
const LocalStorageStrategy = require('./LocalStorageStrategy')
const S3StorageStrategy = require('./S3StorageStrategy')

module.exports = {
  LocalStorageStrategy,

  S3StorageStrategy,

  /**
   * @typedef IStorageStrategy
   * @property {Function} store
   */
  /**
   * @returns {IStorageStrategy}
   */
  getStorageStrategy: function () {
    return module.exports[config.audio.storageStrategy]
  }
}

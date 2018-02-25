const fs = require('fs-extra')
const path = require('path')

/**
 * Store files locally as blobs in the api/store dir.
 */
class LocalStorageStrategy {
  /**
   * @typedef StoreParams
   * @property {String} source
   * @property {String} destination
   */
  /**
   * Moves the file to api/store.
   * @param {String} filename 
   */
  async store(params) {
    const absPermanentFilename = path.resolve(
      __dirname,
      '../../../store',
      params.destination
    )

    await fs.rename(params.source, absPermanentFilename)
  }
}

module.exports = LocalStorageStrategy

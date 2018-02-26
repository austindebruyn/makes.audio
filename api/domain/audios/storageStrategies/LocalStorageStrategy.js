const fs = require('fs-extra')
const path = require('path')

/**
 * Store files locally as blobs in the api/store dir.
 */
class LocalStorageStrategy {
  /**
   * @typedef StoreParams
   * @property {String} source
   * @property {String} destination the objectName
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

  /**
   * Returns a Node stream.
   * @param {Audio} audio
   * @param {Boolean} isDownload
   * @returns {Stream}
  */
  async getStream(audio, isDownload = false) {
    const filePath = path.join(__dirname, '../../..', 'store', audio.filename)

    if (isDownload) {
      throw new Error('not implemented')
      // return res.download(filePath, audio.url, function (err) {
      //   if (err) throw err
      // })
    }

    return fs.createReadStream(filePath)
  }
}

module.exports = LocalStorageStrategy

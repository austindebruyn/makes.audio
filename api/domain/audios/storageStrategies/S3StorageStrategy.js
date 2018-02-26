const S3 = require('../../../lib/aws/S3')

/**
 * Store files as blobs up in S3.
 */
class S3StorageStrategy {
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
    await new S3().upload(params.source, params.destination)
  }

  /**
   * Returns a Node stream.
   * @param {Audio} audio
   * @param {Boolean} isDownload
   * @returns {Stream}
  */
  async getStream(audio, isDownload = false) {
    return new S3().download(audio.filename)
  }
}

module.exports = S3StorageStrategy

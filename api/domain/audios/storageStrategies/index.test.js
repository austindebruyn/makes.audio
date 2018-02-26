const index = require('.')
const stubConfig = require('../../../tests/stubConfig')
const { expect } = require('chai')

const { getStorageStrategy } = index

describe('storageStrategies', function () {
  describe('#getStorageStrategy', function () {
    it('should return local by default', function () {
      const Class = getStorageStrategy().__proto__.constructor
      expect(Class.name).to.eql('LocalStorageStrategy')
    })

    describe('in production', function () {
      stubConfig('audio.storageStrategy', 'S3StorageStrategy')

      it('should return s3', function () {
        const Class = getStorageStrategy().__proto__.constructor
        expect(Class.name).to.eql('S3StorageStrategy')
      })
    })
  })
})

const createUser = require('./createUser')
const { expect } = require('chai')

describe('createUser', function () {
  it('should be 4', function () {
    expect(createUser()).to.eql(4)
  })
})

import one_of from 'lib/one_of'

describe 'one_of', ->
  it 'should return true if value is included', ->
    rule = one_of ['tony stark', 'thor']
    expect(rule.validator('thor')).to.be.true

  it 'should return false if value not included', ->
    rule = one_of ['tony stark', 'thor']
    expect(rule.validator('captain america')).to.be.false

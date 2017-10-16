import sinon from 'sinon'

export default {
  stub_date: ->
    @clock = sinon.useFakeTimers
      now: new Date('2017-08-31T00:00:00.001Z'),
      toFake: [ 'Date' ]

  restore_stub_date: ->
    @clock.restore()
}

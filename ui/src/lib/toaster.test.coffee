import Toaster from 'lib/toaster'
import sinon from 'sinon'

describe 'toaster', ->
  beforeEach ->
    Toaster.DEFAULT_TIMEOUT = 50

  afterEach ->
    Toaster.destroy_all_toasts()

  describe '#count', ->
    it 'should increase', ->
      expect(Toaster.count()).to.eql 0
      Toaster.create 'info', 'message'
      expect(Toaster.count()).to.eql 1

  describe '#at', ->
    it 'should return positional', ->
      Toaster.create 'info', 'message'
      expect(Toaster.at(0)).to.eql Toaster._toasts[0]

    it 'should return undefined', ->
      expect(Toaster.at(0)).to.be.undefined

  describe '#create', ->
    beforeEach ->
      sinon.stub Toaster, '$emit'

    afterEach ->
      Toaster.$emit.restore()

    it 'appends to list', ->
      Toaster.create 'info', 'message'
      expect(Toaster.at(0)).to.eql
        id: 0
        level: 'info'
        message: 'message'
        dismissable: true
        title: null

    it 'returns toast', ->
      value = Toaster.create 'info', 'message'
      expect(value).to.eql Toaster.at 0

    it 'should use unique ids', ->
      Toaster.create 'warning', 'your laundry is done'
      Toaster.create 'danger', 'now it is on fire'
      expect(Toaster.at(0).id).to.eql 1
      expect(Toaster.at(1).id).to.eql 0

    it 'emits event', ->
      Toaster.create 'info', 'message'
      expect(Toaster.$emit).to.have.been.calledWith 'create', Toaster.at 0

    it 'allows title', ->
      Toaster.create 'info', 'message', 'Title'
      expect(Toaster.at(0).title).to.eql 'Title'

    it 'clears toast automatically', (done) ->
      Toaster.create 'info', 'i will be gone soon'
      setTimeout ->
        expect(Toaster.count()).to.eql 0
        done()
      , Toaster.DEFAULT_TIMEOUT + 1

    it 'should forbid bad argument', ->
      expect(-> Toaster.create('apples', 'message')).to.throw Error

  describe '#destroy_toast', ->
    beforeEach ->
      sinon.stub Toaster, '$emit'

    afterEach ->
      Toaster.$emit.restore()

    it 'should remove toast', ->
      Toaster.create 'info', 'message'
      id = Toaster.at(0).id
      Toaster.destroy id
      expect(Toaster.at(0)).to.be.undefined
      expect(Toaster.count()).to.eql 0

    it 'should emit event', ->
      Toaster.create 'info', 'message'
      toast = Toaster.at(0)
      Toaster.destroy toast.id
      expect(Toaster.$emit).to.have.been.calledWith 'dismiss', toast

  describe 'event emitting', ->
    it 'should subscribe', (done) ->
      Toaster.$on 'create', ->
        done()
      Toaster.$emit 'create'

    it 'should unsubscribe', ->
      throw_error = -> throw new Error
      Toaster.$on 'create', throw_error
      Toaster.$off 'create', throw_error
      Toaster.$emit 'create'

  describe '#destroy_all_toasts', ->
    beforeEach ->
      Toaster.create 'info', 'message' for i in [0, 1, 2, 3, 4]
      sinon.stub Toaster, 'destroy'

    afterEach ->
      Toaster.destroy.restore()

    it 'should reset id', ->
      Toaster.destroy_all_toasts()
      new_toast = Toaster.create 'info', 'message'
      expect(new_toast.id).to.eql 0

    it 'should clear list', ->
      Toaster.destroy_all_toasts()
      expect(Toaster.all()).to.eql []

    it 'should clear all handlers', ->
      Toaster.destroy_all_toasts()
      expect(Toaster._handlers.create).to.have.length 0
      expect(Toaster._handlers.dismiss).to.have.length 0
      expect(Toaster._handlers.timeouts).to.have.length 0

    it 'should kill timeouts', (done) ->
      Toaster.destroy_all_toasts()
      setTimeout ->
        expect(Toaster.destroy).to.not.have.been.called
        done()
      , Toaster.DEFAULT_TIMEOUT + 1

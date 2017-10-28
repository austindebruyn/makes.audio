import { shallow, mount } from 'avoriaz'
import sinon from 'sinon'
import Vuex from 'vuex'
import toggle_chevron from './toggle-chevron'

describe 'toggle-chevron', ->
  beforeEach ->
    @wrapper = shallow toggle_chevron

  it 'should start angle 0', ->
    fa = @wrapper.first '.fa'
    expect(fa.hasStyle('transform', 'rotate(0deg)')).to.be.true

  it 'should tween when updated', ->
    @wrapper.setProps open: true
    expect(@tween_spy).to.have.been.calledWith angle: 180, 100

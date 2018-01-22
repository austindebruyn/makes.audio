import dashboard_sort_control from './dashboard_sort_control'
import { shallow } from 'avoriaz'
import sinon from 'sinon'

describe 'dashboard_sort_control', ->
  factory = (label, value) ->
    shallow dashboard_sort_control, propsData: (label: label, value: value)

  it 'should render inactive', ->
    wrapper = factory 'filename', null
    expect(wrapper.first('button').hasClass('active')).to.be.false

  it 'should render active when value', ->
    wrapper = factory 'filename', 'asc'
    expect(wrapper.first('button').hasClass('active')).to.be.true

  it 'should fire event cycling through values when clicked', ->
    this_should_turn_into_that = (THIS, THAT) ->
      wrapper = factory 'filename', THIS
      emit_spy = sinon.spy wrapper.vm, '$emit'
      wrapper.trigger 'click'
      expect(emit_spy).to.have.been.calledOnce
      expect(emit_spy).to.have.been.calledWith 'changed', 'filename', THAT

    this_should_turn_into_that null, 'asc'
    this_should_turn_into_that 'asc', 'dsc'
    this_should_turn_into_that 'dsc', null

  it 'should display label', ->
    wrapper = factory 'filename', null
    expect(wrapper.first('.name').text()).to.eql 'Filename'

  it 'should display no value or icon when inactive', ->
    wrapper = factory 'filename', null
    expect(wrapper.find('.value')).to.be.empty
    expect(wrapper.find('.fa')).to.be.empty

  it 'should display value', ->
    wrapper = factory 'filename', 'asc'
    expect(wrapper.first('.value').text()).to.eql 'A to Z'
    wrapper = factory 'filename', 'dsc'
    expect(wrapper.first('.value').text()).to.eql 'Z to A'

  it 'shows the right icon', ->
    wrapper = factory 'filename', 'asc'
    expect(wrapper.first('.fa').hasClass('fa-chevron-down')).to.be.true
    wrapper = factory 'filename', 'dsc'
    expect(wrapper.first('.fa').hasClass('fa-chevron-up')).to.be.true

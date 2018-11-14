import confirm_delete_popup from './confirm_delete_popup'
import { shallow } from 'avoriaz'
import sinon from 'sinon'

describe 'confirm_delete_popup', ->
  beforeEach ->
    @wrapper = shallow confirm_delete_popup, propsData:
      audio_name: 'cool.mp3'
    sinon.spy @wrapper.vm, '$emit'

  it 'should print audio name', ->
    expect(@wrapper.text()).to.contain 'The audio cool.mp3 will be deleted'

  it 'should render two buttons', ->
    expect(@wrapper.first('.btn-primary').text()).to.eql 'Confirm'
    expect(@wrapper.first('.btn').text()).to.eql 'Cancel'

  it 'should emit confirm when clicking confirm', ->
    @wrapper.first('.btn-primary').trigger 'click'
    expect(@wrapper.vm.$emit).to.have.been.calledOnce
    expect(@wrapper.vm.$emit).to.have.been.calledWith 'confirm'

  it 'should emit cancel when clicking cancel', ->
    @wrapper.first('.btn').trigger 'click'
    expect(@wrapper.vm.$emit).to.have.been.calledOnce
    expect(@wrapper.vm.$emit).to.have.been.calledWith 'close'

  it 'should emit cancel when clicking ouside', ->
    @wrapper.first('.fill-window-size').trigger 'click'
    expect(@wrapper.vm.$emit).to.have.been.calledOnce
    expect(@wrapper.vm.$emit).to.have.been.calledWith 'close'

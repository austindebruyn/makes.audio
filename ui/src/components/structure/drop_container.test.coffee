import drop_container from './drop_container'
import { mount } from 'avoriaz'
import UploadService from 'lib/upload_service'
import sinon from 'sinon'

describe 'drop_container', ->
  it 'should render', ->
    wrapper = mount drop_container
    expect(wrapper.text()).to.eql 'Drop Your Audio Here'

  describe 'drop', ->
    beforeEach ->
      @wrapper = mount drop_container
      sinon.stub UploadService, 'start'
      sinon.spy @wrapper.vm, '$emit'
    
    afterEach ->
      UploadService.start.restore()
    
    it 'should upload', ->
      @wrapper.vm.handle_drop
        dataTransfer: files: []
        preventDefault: ->
        stopPropagation: ->
      expect(UploadService.start).to.have.been.called
      expect(UploadService.start.args[0][0]).to.have.property 'length', 0
    
    it 'should emit dropfinished', ->
      @wrapper.first('.drop-container').trigger 'drop'
      expect(@wrapper.vm.$emit).to.have.been.calledWith 'dropfinished'

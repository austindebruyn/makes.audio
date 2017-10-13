import { mount } from 'avoriaz'
import audios_fixture from 'fixtures/audios'
import upload from 'components/dashboard/upload'
import UploadService from 'lib/upload_service'
import sinon from 'sinon'
import Vuex from 'vuex'

describe 'upload', ->
  beforeEach ->
    @store = new Vuex.Store
      state:
        uploads: []
    @wrapper = mount upload, store: @store

    sinon.stub UploadService, 'start'

  afterEach ->
    UploadService.start.restore()

  it 'should start upload when a file is picked', ->
    @wrapper.first('input[type=file]').trigger 'change'
    expect(UploadService.start).to.have.been.called
    expect(UploadService.start.args[0][0]).to.have.property 'length', 0

  it 'should start upload on form submit', ->
    @wrapper.first('form').trigger 'submit'
    expect(UploadService.start).to.have.been.called
    expect(UploadService.start.args[0][0]).to.have.property 'length', 0

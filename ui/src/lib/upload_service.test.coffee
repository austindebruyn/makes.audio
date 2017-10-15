import UploadService from 'lib/upload_service'
import store from 'state/store'
import sinon from 'sinon'
import Toaster from 'lib/toaster'
import errors from 'i18n/errors'

describe 'UploadService', ->
  beforeEach ->
    sinon.stub Toaster, 'create'
    sinon.stub store, 'commit'

    @xhr_stub = sinon.useFakeXMLHttpRequest()
    @xhrs = []
    @xhr_stub.onCreate = (xhr) => @xhrs.push xhr

  afterEach ->
    Toaster.create.restore()
    store.commit.restore()
    @xhr_stub.restore()

  describe '.start', ->
    beforeEach ->
      @upload = UploadService.start([name: 'cool.mp3'])

    it 'should return the upload', ->
      expect(@upload.id).to.be.a.string
      expect(@upload).to.have.property 'name', 'cool.mp3'

    it 'should commit with a new upload', ->
      expect(store.commit).to.have.been.calledWith 'create_upload', @upload
      
    it 'start an upload', ->
      expect(@xhrs).to.have.length 1
      xhr = @xhrs[0]
      expect(xhr).to.include method: 'post', url: '/api/audios', status: 0
      expect(xhr.requestHeaders).to.eql Accept: 'application/json'

  describe 'uploading', ->
    beforeEach ->
      @upload = UploadService.start([name: 'cool.mp3'])
      @xhr = @xhrs[0]

    it 'should commit error', ->
      @xhr.status = 500
      @xhr.onerror()
      expect(store.commit).to.have.been.calledWith 'update_upload',
        id: sinon.match.string
        error: true

    it 'should commit progress', ->
      @xhr.upload.onprogress
        lengthComputable: true
        loaded: 1024
        total: 2048
      expect(store.commit).to.have.been.calledWith 'update_upload',
        id: sinon.match.string
        progress: 50

    it 'should commit success', ->
      response =
        ok: true
        audio:
          id: 1
          url: 'cool.mp3'
      @xhr.onload
        target:
          status: 200
          responseText: JSON.stringify response
      expect(Toaster.create).to.have.been
        .calledWith 'success', 'cool.mp3 is uploaded.'
      expect(store.commit).to.have.been
        .calledWith 'create_audio', response.audio
      expect(store.commit).to.have.been.calledWith 'update_upload',
        id: sinon.match.string
        progress: 100

    it 'should commit server error', ->
      @xhr.onload
        target:
          status: 500
          responseText: JSON.stringify(ok: false)
      expect(Toaster.create).to.have.been
        .calledWith 'danger', 'Something went wrong. Please try again.', 'Oops!'
      expect(store.commit).to.have.been.calledWith 'update_upload',
        id: sinon.match.string
        error: true

    it 'should commit client error', ->
      @xhr.onload
        target:
          status: 422
          responseText: JSON.stringify
            ok: false
            errors: [( code: 'BAD_MIMETYPE' )]
      expect(Toaster.create).to.have.been
        .calledWith 'danger', errors.create_upload.BAD_MIMETYPE, 'Oops!'
      expect(store.commit).to.have.been.calledWith 'update_upload',
        id: sinon.match.string
        error: true

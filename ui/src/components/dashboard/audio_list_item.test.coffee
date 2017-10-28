import audio_list_item from './audio_list_item'
import { mount, shallow } from 'avoriaz'
import audios_fixture from 'fixtures/audios'
import sinon from 'sinon'
import Toaster from 'lib/toaster'
import Vuex from 'vuex'

describe 'audio-list-item', ->
  beforeEach ->
    sinon.stub Toaster, 'create'
    @mutations =
      update_audio: sinon.spy()
    @store = new Vuex.Store
      state: {}
      mutations: @mutations
    @wrapper = mount audio_list_item, globals: ($store: @store), propsData:
      audio: audios_fixture.chicken
      q: null

  afterEach ->
    Toaster.create.restore()

  it 'should render title', ->
    title_link = @wrapper.first '.public-link'
    expect(title_link.element.getAttribute('href')).to.eql '/chicken.mp3'
    expect(title_link.text()).to.eql 'chicken.mp3'

    hover_title = 'Open up chicken.mp3 in a new tab'
    expect(title_link.element.getAttribute('title')).to.eql hover_title

  it 'should render details', ->
    expect(@wrapper.first('.description').text()).to.eql 'A chick bok-bok'
    meta = 'Uploaded a month ago' + '4min 50sec'
    expect(@wrapper.first('.meta').text()).to.eql meta

  it 'should have download link', ->
    download_link = @wrapper.first('a[title=Download]').element
    expect(download_link.getAttribute('href')).to.eql '/chicken.mp3/download'

  it 'should not have an invisible icon', ->
    expect(@wrapper.find('.fa.fa-eye-slash')).to.have.length 0

  describe 'when the audio is invisible', ->
    beforeEach ->
      @wrapper = mount audio_list_item, globals: ($store: @store), propsData:
        audio: audios_fixture.invisible
        q: null

    it 'should have an invisible icon', ->
      expect(@wrapper.find('.fa.fa-eye-slash')).to.have.length 1

  it 'should open drawer when clicked', ->
    root = @wrapper.first '.dashboard-audio-list-item'
    expect(root.hasClass('open')).to.be.false
    @wrapper.first('.top-section').trigger 'click'
    expect(root.hasClass('open')).to.be.true
    
  it 'should enable editing when click pencil', ->
    expect(@wrapper.vm.edit_mode).to.be.false
    expect(@wrapper.contains('form input.edit-url-input')).to.be.false
    @wrapper.find('.controls a')[1].trigger 'click'
    expect(@wrapper.vm.edit_mode).to.be.true
    expect(@wrapper.contains('form input.edit-url-input')).to.be.true

  describe 'editing url', ->
    beforeEach ->
      @wrapper.find('.controls a')[1].trigger 'click'
      @fill_in(@wrapper.first('form input.edit-url-input')).with 'apple.mp3'
      @wrapper.first('form').trigger 'submit'

    it 'should set loading state', ->
      expect(@wrapper.vm.loading).to.be.true

    it 'should fetch', ->
      expect(@fetches.first).to.include
        method: 'PATCH'
        url: '/api/audios/1'
        credentials: 'same-origin'
      expect(@fetches.first.headers).to.eql
        'Accept': 'application/json'
        'Content-Type': 'application/json'
      expect(@fetches.first.body).to.eql
        url: 'apple.mp3'

    describe 'on success', ->
      beforeEach (done) ->
        @new_audio = Object.assign {}, audios_fixture.chicken, url: 'apples.mp3'
        @fetches.first.respond_with
          status: 200
          body:
            ok: true
            audio: @new_audio
        setImmediate done

      it 'should clear loading state', ->
        expect(@wrapper.vm.loading).to.be.false
      
      it 'should commit', ->
        expect(@mutations.update_audio).to.have.been
          .calledWith sinon.match.object, @new_audio

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'success', 'apples.mp3 has been updated.', 'Great!'

      it 'should clear edit mode', ->
        expect(@wrapper.vm.edit_mode).to.be.false

    describe 'on server error', ->
      beforeEach (done) ->
        @fetches.first.respond_with
          body:
            ok: false
        setImmediate done

      it 'should turn off loading state', ->
        expect(@wrapper.vm.loading).to.be.false

      it 'should not turn off edit mode', ->
        expect(@wrapper.vm.edit_mode).to.be.true

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'danger', 'Something went wrong!'

    describe 'on client error', ->
      beforeEach (done) ->
        @fetches.first.respond_with
          body:
            ok: false
            errors: [( code: 'URL_NOT_UNIQUE' )]
        setImmediate done

      it 'should turn off loading state', ->
        expect(@wrapper.vm.loading).to.be.false

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'danger', 'You already have a file called that!'


import audio_list_item from './audio_list_item'
import { mount, shallow } from 'avoriaz'
import audios_fixture from 'fixtures/audios'
import sinon from 'sinon'

describe 'audio-list-item', ->
  beforeEach ->
    @wrapper = mount audio_list_item, propsData:
      audio: audios_fixture.chicken
      q: null

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

  it 'should have an edit link', ->
    edit_link = @wrapper.first(router_link)
    expect(edit_link.vm.to).to.eql '/audios/1/edit'

  it 'should not have an invisible icon', ->
    expect(@wrapper.find('.fa.fa-eye-slash')).to.have.length 0

  describe 'when the audio is invisible', ->
    beforeEach ->
      @wrapper = mount audio_list_item, propsData:
        audio: audios_fixture.invisible
        q: null

    it 'should have an invisible icon', ->
      expect(@wrapper.find('.fa.fa-eye-slash')).to.have.length 1

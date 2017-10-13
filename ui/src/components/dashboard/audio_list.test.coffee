import audio_list from './audio_list'
import { mount, shallow } from 'avoriaz'
import audios_fixture from 'fixtures/audios'
import audio_list_item from 'components/dashboard/audio_list_item'

describe 'audio-list', ->
  beforeEach ->
    @wrapper = shallow audio_list, propsData:
      q: 'c'
      audios: [
        audios_fixture.chicken
        audios_fixture.crunch
      ]

  it 'should render list items', ->
    items = @wrapper.find(audio_list_item)
    expect(items).to.have.length 2
    expect(items[0].vm.$props).to.eql
      q: 'c'
      audio: audios_fixture.chicken
    expect(items[1].vm.$props).to.eql
      q: 'c'
      audio: audios_fixture.crunch

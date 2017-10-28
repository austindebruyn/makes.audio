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
        audios_fixture.invisible
      ]

  it 'should render list items', ->
    items = @wrapper.find audio_list_item
    expect(items).to.have.length 2
    expect(items[0].vm.$props).to.eql
      q: 'c'
      audio: audios_fixture.chicken
    expect(items[1].vm.$props).to.eql
      q: 'c'
      audio: audios_fixture.invisible

  it 'should sort by newest', ->
    create_audio_with = (id, createdAt) ->
      Object.assign {}, audios_fixture.chicken,
        id: id
        createdAt: createdAt.toUTCString()

    oldest = create_audio_with 1, new Date('Feb 24 2005')
    newest = create_audio_with 2, new Date('May 10 2009')
    middle = create_audio_with 3, new Date('Oct 03 2007')

    @wrapper = mount audio_list, propsData:
      audios: [ oldest, newest, middle ]

    items = @wrapper.find audio_list_item
    expect(items).to.have.length 3
    expect(items.map((i) -> i.vm.audio.id)).to.eql [ 2, 3, 1]

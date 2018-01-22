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

  describe 'sorting', ->
    create_audio_with = (id, data) ->
      Object.assign {}, audios_fixture.chicken, (id: id), data

    describe 'filename:', ->
      beforeEach ->

        @a = create_audio_with 2, url: 'auckland.mp3'
        @b = create_audio_with 3, url: 'brussels.mp3'
        @z = create_audio_with 1, url: 'zanzibar.mp3'

      it 'asc should sort from A-Z', ->
        @wrapper = mount audio_list, propsData:
          audios: [ @z, @a, @b ]
          sort: (filename: 'asc')

        items = @wrapper.find audio_list_item
        expect(items.map((i) -> i.vm.audio.url))
          .to.eql [ 'auckland.mp3', 'brussels.mp3', 'zanzibar.mp3' ]

      it 'dsc should sort from Z-A', ->
        @wrapper = mount audio_list, propsData:
          audios: [ @z, @a, @b ]
          sort: (filename: 'dsc')

        items = @wrapper.find audio_list_item
        expect(items.map((i) -> i.vm.audio.url))
          .to.eql [ 'zanzibar.mp3', 'brussels.mp3', 'auckland.mp3' ]

    describe 'date:', ->
      beforeEach ->
        @oldest = create_audio_with 1,
          createdAt: new Date('Feb 24 2005').toUTCString()
        @newest = create_audio_with 2,
          createdAt: new Date('May 10 2009').toUTCString()
        @middle = create_audio_with 3,
          createdAt: new Date('Oct 03 2007').toUTCString()

      it 'dsc should sort by newest', ->
        @wrapper = mount audio_list, propsData:
          audios: [ @oldest, @newest, @middle ]
          sort: (date: 'dsc')

        items = @wrapper.find audio_list_item
        expect(items.map((i) -> i.vm.audio.id)).to.eql [ 2, 3, 1 ]

      it 'asc should sort by oldest', ->
        @wrapper = mount audio_list, propsData:
          audios: [ @oldest, @newest, @middle ]
          sort: (date: 'asc')

        items = @wrapper.find audio_list_item
        expect(items.map((i) -> i.vm.audio.id)).to.eql [ 1, 3, 2 ]

    describe 'length:', ->
      beforeEach ->
        @one_sec = create_audio_with 2, duration: 1
        @two_sec = create_audio_with 1, duration: 2
        @minutes = create_audio_with 3, duration: 120

      it 'dsc should sort by longest first', ->
        @wrapper = mount audio_list, propsData:
          audios: [ @one_sec, @minutes, @two_sec ]
          sort: (length: 'dsc')

        items = @wrapper.find audio_list_item
        expect(items.map((i) -> i.vm.audio.duration)).to.eql [ 120, 2, 1 ]

      it 'asc should sort by shortest first', ->
        @wrapper = mount audio_list, propsData:
          audios: [ @one_sec, @minutes, @two_sec ]
          sort: (length: 'asc')

        items = @wrapper.find audio_list_item
        expect(items.map((i) -> i.vm.audio.duration)).to.eql [ 1, 2, 120 ]

    describe 'combining sorts', ->
      beforeEach ->
        @short_a = create_audio_with 1, duration: 5, url: 'apples.mp3'
        @short_z = create_audio_with 2, duration: 5, url: 'zebras.mp3'
        @long_a = create_audio_with 3, duration: 90, url: 'apples-long.mp3'
        @long_z = create_audio_with 4, duration: 90, url: 'zebras-long.mp3'

      it 'should respect both', ->
        @wrapper = mount audio_list, propsData:
          audios: [ @short_a, @short_z, @long_a, @long_z ]
          sort:
            filename: 'dsc'
            length: 'dsc'

        items = @wrapper.find audio_list_item
        expect(items.map((i) -> [i.vm.audio.url, i.vm.audio.duration]))
          .to.eql [
            ['zebras-long.mp3', 90]
            ['apples-long.mp3', 90]
            ['zebras.mp3', 5]
            ['apples.mp3', 5]
          ]

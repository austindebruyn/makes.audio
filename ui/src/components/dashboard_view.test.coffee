import dashboard_view from './dashboard_view'
import { mount, shallow } from 'avoriaz'
import Toaster from 'lib/toaster'
import sinon from 'sinon'
import Vuex from 'vuex'
import { nextTick } from 'vue'
import loading from 'components/loading'
import dashboard_audio_list from 'components/dashboard/audio_list'
import dashboard_upload from 'components/dashboard/upload'
import dashboard_zds from 'components/dashboard/zero_data_state'

describe 'dashboard_view', ->
  beforeEach ->
    @actions =
      fetch_audios: sinon.spy()
    @store = new Vuex.Store
      state: {}
      actions: @actions

  describe 'if audios are not loaded', ->
    it 'should fetch audios', ->
      @wrapper = mount dashboard_view, store: @store
      expect(@actions.fetch_audios).to.have.been.called
    
    it 'should show loading', ->
      expect(@wrapper.contains(loading)).to.be.true
      expect(@wrapper.contains(dashboard_audio_list)).to.not.be.true
    
    it 'should upload', ->
      expect(@wrapper.contains(dashboard_upload)).to.be.true

  describe 'if audios are loaded', ->
    describe 'and there are none', ->
      beforeEach ->
        @store.state.audios = []
        @wrapper = mount dashboard_view, store: @store

      it 'shows a zero state', ->
        expect(@wrapper.contains(dashboard_zds)).to.be.true

    describe 'and there are audios', ->
      beforeEach ->
        @store.state.audios = [( url: 'hey.mp3' ), ( url: 'no.mp3' )]
        @wrapper = mount dashboard_view, store: @store

      it 'does not show a zero state', ->
        expect(@wrapper.contains(dashboard_zds)).to.be.false

      it 'should show upload', ->
        expect(@wrapper.contains(dashboard_upload)).to.be.true

      it 'should fetch audios', ->
        expect(@actions.fetch_audios).to.not.have.been.called

      it 'should not show loading', ->
        expect(@wrapper.contains(loading)).to.not.be.true

      it 'renders dashboard audio list', ->
        list = @wrapper.first dashboard_audio_list
        expect(list.vm.$props).to.eql
          q: null
          audios: [( url: 'hey.mp3' ), ( url: 'no.mp3' )]
          sort: @wrapper.vm.sort

      describe 'searching', ->
        beforeEach ->
          @search_input = @wrapper.first('input[type=search]')
          @fill_in(@search_input).with 'hey'
          @search_input.trigger 'keyup'
          nextTick()

        it 'sets state', ->
          expect(@wrapper.vm.search.q).to.eql 'hey'

        it 'filters list', ->
          expect(@wrapper.vm.filtered_audios).to.eql [( url: 'hey.mp3' )]

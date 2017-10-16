import uploads_progress from './uploads_progress'
import { mount } from 'avoriaz'
import Vue, { nextTick } from 'vue'
import Vuex from 'vuex'

Vue.use Vuex

describe 'uploads_progress', ->
  beforeEach ->
    @store = new Vuex.Store
      state:
        uploads: []

  it 'should set active', ->
    wrapper = mount uploads_progress, store: @store
    expect(wrapper.hasClass('active')).to.be.false
    @store.state.uploads = [(id: 0, name: 'cool.mp3', progress: 50)]
    nextTick().then ->
      expect(wrapper.hasClass('active')).to.be.true

  it 'should set width to upload progress if active', ->
    wrapper = mount uploads_progress, store: @store
    progress_bar = wrapper.first('.progress-bar')
    expect(progress_bar.hasStyle('width', '0')).to.be.true
    @store.state.uploads = [(id: 0, name: 'cool.mp3', progress: null)]
    nextTick().then =>
      expect(progress_bar.hasStyle('width', '0')).to.be.true
      @store.state.uploads = [(id: 0, name: 'cool.mp3', progress: 50)]
      nextTick()
    .then =>
      expect(progress_bar.hasStyle('width', '50%')).to.be.true
      @store.state.uploads = [(id: 0, name: 'cool.mp3', progress: 100)]
      nextTick()
    .then ->
      expect(progress_bar.hasStyle('width', '100%')).to.be.true

  it 'should have correct text', ->
    wrapper = mount uploads_progress, store: @store
    expect(wrapper.text()).to.eql ''
    @store.state.uploads = [(id: 0, name: 'cool.mp3', progress: null)]
    nextTick().then =>
      expect(wrapper.text()).to.eql 'Uploading cool.mp3'
      @store.state.uploads = [(id: 0, name: 'cool.mp3', progress: 100)]
      nextTick()
    .then ->
      expect(wrapper.text()).to.eql ''

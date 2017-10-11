import settings from '.'
import { mount } from 'avoriaz'
import Vue, { nextTick } from 'vue'
import Vuex from 'vuex'
import sinon from 'sinon'
import loading from 'components/loading'
import user_form from 'components/settings/user_form'
import users_fixture from 'fixtures/users'
import email_preferences_fixture from 'fixtures/email_preferences'

Vue.use Vuex

describe 'settings', ->
  beforeEach ->
    @actions =
      fetch_email_preferences: sinon.spy()
    @store = new Vuex.Store
      state:
        user: users_fixture.austin
        email_preferences: null
      actions: @actions

  it 'should show username', ->
    wrapper = mount settings, store: @store
    expect(wrapper.first('h2').text()).to.eql 'austin'

  it 'should show spinner if loading', ->
    wrapper = mount settings, store: @store
    expect(wrapper.contains(loading)).to.be.true

  it 'should show not spinner after loading', ->
    wrapper = mount settings, store: @store
    @store.state.email_preferences = email_preferences_fixture.verified
    nextTick().then ->
      expect(wrapper.contains(loading)).to.be.false

  it 'should show user form after loading', ->
    wrapper = mount settings, store: @store
    expect(wrapper.contains(user_form)).to.be.false
    @store.state.email_preferences = email_preferences_fixture.verified
    nextTick().then ->
      expect(wrapper.contains(user_form)).to.be.true

import Vue from 'vue'
import Revue from 'revue'
import { createStore } from 'redux'
import actions from './actions'
import pick from 'lodash.pick'

redux_store = createStore (state, action) ->
  if typeof state is 'undefined'
    return ( user: null, audios: null )
  if action.type is 'LOGIN'
    state.user = action.user
  if action.type is 'SET_EMAIL_PREFERENCES'
    state.email_preferences = action.record
  if action.type is 'LOGOUT'
    state.user = null
  if action.type is 'SET_AUDIOS'
    state.audios = action.audios
  if action.type is 'UPDATE_AUDIO'
    for a in state.audios
      if a.id is action.audio.id
        Object.assign a, action.audio
        break
  if action.type is 'ADD_AUDIO'
    new_audios = state.audios.slice 0
    new_audios.push action.audio
    state.audios = new_audios
  state

store = new Revue Vue, redux_store, actions

export default store

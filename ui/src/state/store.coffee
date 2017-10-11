import Vue from 'vue'
import pick from 'lodash.pick'
import find from 'lodash.find'
import remove from 'lodash.remove'

import Vuex from 'vuex'

Vue.use Vuex

initial_state =
  user: null
  audios: null
  email_preferences: null
  uploads: []

store = new Vuex.Store
  strict: process.env.NODE_ENV != 'production'

  state: initial_state

  mutations:
    reset: (state) ->
      Object.assign state, initial_state

    set_user: (state, user) ->
      state.user = user

    set_email_preferences: (state, email_preferences) ->
      state.email_preferences = email_preferences

    set_audios: (state, audios) ->
      state.audios = audios

    create_audio: (state, audio) ->
      new_audios = state.audios.slice(0)
      new_audios.push audio
      state.audios = new_audios

    create_upload: (state, payload) ->
      upload =
        id:       payload.id
        name:     payload.name
        error:    false
        progress: null
      new_uploads = state.uploads.slice(0)
      new_uploads.push upload
      state.uploads = new_uploads

    update_upload: (state, upload) ->
      id = upload.id
      target_upload = find state.uploads, id: id
      throw new Error("cannot update upload #{id}") unless target_upload
      new_upload = Object.assign {}, target_upload, upload
      new_uploads = state.uploads.slice 0
      remove new_uploads, target_upload
      new_uploads.push new_upload
      state.uploads = new_uploads

  actions:
    fetch_audios: ({ state, commit }) ->
      fetch('/api/audios', credentials: 'same-origin', headers: headers)
        .then (data) -> data.json()
        .then (json) ->
          if json.ok
            commit 'set_audios', json.records

    fetch_email_preferences: ({ state, commit }) ->
      headers =
        'Content-Type': 'application/json'
        'Accept': 'application/json'
      url = '/api/users/me/emailPreferences'
      fetch(url, credentials: 'same-origin', headers: headers)
        .then (data) -> data.json()
        .then (json) ->
          if json.ok
            commit 'set_email_preferences', json.record

export default store

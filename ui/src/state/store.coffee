import Vue from 'vue'
import pick from 'lodash.pick'
import find from 'lodash.find'
import without from 'lodash.without'

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

    update_audio: (state, audio) ->
      target_audio = find state.audios, id: audio.id
      throw new Error("cannot update audio #{id}") unless target_audio
      new_audio = Object.assign {}, target_audio, audio
      new_audios = without state.audios, target_audio
      new_audios.push new_audio
      state.audios = new_audios

    delete_audio: (state, target_audio_id) ->
      state.audios = state.audios.filter (audio) ->
        audio.id isnt target_audio_id

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
      new_uploads = without state.uploads, target_upload
      new_uploads.push new_upload
      state.uploads = new_uploads

  actions:
    fetch_audios: ({ state, commit }) ->
      headers =
        'Content-Type': 'application/json'
        'Accept': 'application/json'
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

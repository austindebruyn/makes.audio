import store from 'state/store'
import audio_actions from 'state/actions/audios'

api = {}

api.fetch = ->
  fetch("/api/audios", credentials: 'same-origin')
    .then (data) -> data.json()
    .then (json) ->
      store.dispatch audio_actions.set_audios json

export default api

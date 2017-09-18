import store from 'state/store'
import email_preferences_actions from 'state/actions/email_preferences'

api = {}

api.fetch = ->
  fetch("/api/users/me/emailPreferences", credentials: 'same-origin')
    .then (data) -> data.json()
    .then (json) ->
      if json.ok
        store.dispatch email_preferences_actions.set_email_preferences json.record

export default api

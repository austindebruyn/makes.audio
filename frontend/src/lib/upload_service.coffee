import store from 'state/store'
import upload_actions from 'state/actions/uploads'

class UploadService
  @start: (files) ->
    action = upload_actions.create_upload files[0]
    store.dispatch action
    @dispatch action
    action

  # @api private
  @dispatch: (files) ->
    return null
    fetch '/api/audios',
      method: 'POST'
      credentials: 'same-origin'
      headers:
        Accept: 'application/json'
      body: upload_file
    .then (data) -> data.json()
    .then (json) ->
      if json.errors?
        e.target.file.value = ''
        FlashEngine.create 'danger', error, 'Oops!' for error in json.errors
      else
        e.target.file.value = ''
        store.dispatch audio_actions.add_audio json
        FlashEngine.create 'success', "#{json.url} is uploaded.", 'Great!'

export default UploadService

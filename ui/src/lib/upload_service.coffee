import store from 'state/store'
import FlashEngine from 'lib/flash_engine'
import errors from 'i18n/errors'

class UploadService
  @start: (files) ->
    id = Math.random().toString()
    upload = Object.assign {},  files[0], id: id
    store.commit 'create_upload', upload
    @_fetch id, files
    id

  @_handle_progress: (id, percentage) ->
    store.commit 'update_upload',
      id: id
      progress: percentage

  @_handle_error: (id) ->
    action = upload_actions.update_upload(id: id, error: true)
    store.dispatch action
    store.commit 'update_upload',
      id: id
      error: true

  @_handle_complete: (id, status, json) ->
    if json.errors?
      FlashEngine.create 'danger', errors.create_upload[error.code], 'Oops!' for error in json.errors
      @_handle_error id
    else if status >= 400
      FlashEngine.create 'danger', 'Something went wrong. Please try again.', 'Oops!'
      @_handle_error id
    else
      FlashEngine.create 'success', "#{json.audio.url} is uploaded.", 'Great!'
      store.commit 'create_audio', json.audio
      store.commit 'update_upload', id: id, progress: 100

  @_fetch: (id, files) ->
    # whatwg-fetch will does not let you observe the progress of the request
    # see implementation work https://github.com/whatwg/fetch/issues/607
    xhr = new XMLHttpRequest()
    xhr.open 'post', '/api/audios', true

    xhr.setRequestHeader 'Accept', 'application/json'

    xhr.upload.onprogress = (e) ->
      if e.lengthComputable
        percentage = (e.loaded / e.total) * 100
        UploadService._handle_progress id, percentage

    xhr.onerror = ->
      UploadService._handle_error id

    xhr.onload = (e) ->
      status = e.target.status
      body = JSON.parse e.target.responseText
      UploadService._handle_complete id, status, body

    form_data = new FormData()
    form_data.append 'file', files[0]

    xhr.send form_data

export default UploadService

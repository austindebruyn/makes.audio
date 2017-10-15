import store from 'state/store'
import Toaster from 'lib/toaster'
import errors from 'i18n/errors'
import uniqueid from 'lodash.uniqueid'


class UploadService
  @start: (files) ->
    upload =
      id: uniqueid()
      name: files[0].name
    store.commit 'create_upload', upload
    @_fetch upload.id, files
    upload

  @_handle_progress: (id, percentage) ->
    store.commit 'update_upload',
      id: id
      progress: percentage

  @_handle_error: (id) ->
    store.commit 'update_upload',
      id: id
      error: true

  @_handle_complete: (id, status, json) ->
    if json.errors?
      for error in json.errors
        Toaster.create 'danger', errors.create_upload[error.code], 'Oops!'
      @_handle_error id
    else if status >= 400
      message = 'Something went wrong. Please try again.'
      Toaster.create 'danger', message, 'Oops!'
      @_handle_error id
    else
      Toaster.create 'success', "#{json.audio.url} is uploaded.", 'Great!'
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

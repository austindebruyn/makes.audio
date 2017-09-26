_internal = 0

create_upload = (data) ->
  type: 'CREATE_UPLOAD'
  upload:
    id:       _internal++
    name:     data.name
    error:    false
    progress: null

update_upload = (data) ->
  type: 'UPDATE_UPLOAD'
  data: data

export default {
  create_upload: create_upload
  update_upload: update_upload
}

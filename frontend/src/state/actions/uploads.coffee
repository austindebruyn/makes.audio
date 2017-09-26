_internal = 0

create_upload = (data) ->
  type: 'CREATE_UPLOAD'
  upload:
    id:   _internal++
    name: data.name

export default {
  create_upload: create_upload
}

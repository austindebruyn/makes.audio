<template lang="pug">
  card.card-plain.dashboard-upload-card
    a.upload-cta(href='javascript:;', @click='handle_upload_cta_click')
      | Upload New Audio
    span.drag-file-reminder ...Or drag a file here
    form(
      hidden='true'
      action='/api/audios'
      method='post'
      enctype='multipart/form-data'
      @submit='handle_upload'
    )
      input(
        type='file'
        multiple=true
        name='file'
        ref='file_input'
        @change='handle_file_change'
      )
      input(type='submit' value='Upload')
</template>

<script lang="coffee">
  import Vue from 'vue'
  import UploadService from 'lib/upload_service'
  import card from 'components/controls/card'

  export default {
    name: 'dashboard-upload'
    components:
      card: card
    data: ->
      loading: false
    computed:
      uploads: -> @$store.state.uploads
    methods:
      handle_upload_cta_click: (e) ->
        @$refs.file_input.click()
      handle_file_change: (e) ->
        file_list = e.target.files
        UploadService.start file_list
      handle_upload: (e) ->
        e.preventDefault()
        UploadService.start e.target.file.files
        e.target.file.value = ''
  }
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .upload-cta {
    display: block;
    font-size: 1.4rem;
    text-decoration: underline;
  }

  .dashboard-upload-card {
    padding-bottom: 20px;
  }

  .drag-file-reminder {
    color: $gray;
    text-transform: uppercase;
    font-size: 0.8rem;
  }
</style>

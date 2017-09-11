<template lang="pug">
  app-template
    .dashboard
      .row
        .col-12.col-md-5.col-lg-3
          a.upload-cta(href='javascript:;', @click='handle_upload_cta_click') Upload New Audio
          span.drag-file-reminder ...Or drag a file here
          form(action='/api/audios', method='post', enctype='multipart/form-data', @submit="handle_upload")
            input(type='file', name='file')
            input(type='submit' value='Upload')
          h2 Search
          input.form-control(name='q', type='search', autocomplete='off', placeholder='Keywords, title, URLs...', @search='handle_search', @keyup='handle_search_keyup')
        .col-12.col-md-7.col-lg-9
          dashboard-audio-list(:q='search && search.q', :audios='filtered_audios', v-if='audios && !search.loading')
          div(v-else=true)
            loading
</template>

<script lang="coffee">
  import Vue from 'vue'
  import store from 'state/store'
  import audio_actions from 'state/actions/audios'
  import audio_api from 'api/audios'
  import FlashEngine from 'lib/flash_engine'

  export default Vue.component 'dashboard',
    data: ->
      audios: @$select 'audios'
      user: @$select 'user'
      search:
        q: null
        loading: false
    mounted: -> audio_api.fetch() unless @audios
    computed:
      filtered_audios: ->
        if @audios
          return @audios if @search.loading
          return @audios if @search.q is null
          @audios.filter (a) => a.url.includes(@search.q)
        else
          nil
    methods:
      handle_search: (e) ->
        if @search.q != e.target.value
          @search =
            q: if e.target.value == '' then null else e.target.value
            loading: false
          if @timeout
            clearTimeout @timeout
            @timeout = null
          @perform_search()
      handle_search_keyup: (e) ->
        if @search.q != e.target.value
          @search =
            q: if e.target.value == '' then null else e.target.value
            loading: true
          clearTimeout @timeout if @timeout
          @timeout = setTimeout @perform_search, 200
      perform_search: ->
        @search =
          q: @search.q
          loading: false
      handle_upload_cta_click: (e) ->

      handle_upload: (e) ->
        e.preventDefault()
        upload_file = new FormData
        upload_file.append 'file', e.target.file.files[0]

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
</script>

<style lang="scss">
  @import 'src/styles/colors';
  .dashboard {
    font-family: 'arconregular';
    padding-top: 40px;
  }

  .upload-cta {
    display: block;
    font-size: 1.4rem;
    text-decoration: underline;
  }
  .drag-file-reminder {
    color: $gray;
    text-transform: uppercase;
    font-size: 0.8rem;
  }
</style>

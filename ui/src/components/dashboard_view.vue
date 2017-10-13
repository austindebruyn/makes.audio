<template lang="pug">
  app-template
    .dashboard
      .row
        .col-12.col-md-5.col-lg-3
          dashboard-upload
          h2 Search
          input.form-control(
            name='q'
            type='search'
            autocomplete='off'
            placeholder='Keywords, title, URLs...'
            @search='handle_search'
            @keyup='handle_search_keyup'
          )
        .col-12.col-md-7.col-lg-9
          dashboard-audio-list(
            v-if='audios'
            :q='search && search.q'
            :audios='filtered_audios'
          )
          div(v-else=true)
            loading
</template>

<script lang="coffee">
  import Vue from 'vue'
  import loading_component from 'components/loading'
  import app_template from 'components/app_template'
  import dashboard_audio_list from 'components/dashboard/audio_list'
  import dashboard_upload from 'components/dashboard/upload'

  export default {
    name: 'dashboard-view'
    components:
      'app-template': app_template
      loading: loading_component
      'dashboard-audio-list': dashboard_audio_list
      'dashboard-upload': dashboard_upload
    data: ->
      search:
        q: null
    mounted: -> @$store.dispatch 'fetch_audios' unless @audios
    computed:
      filtered_audios: ->
        if @audios
          return @audios if @search.q is null
          @audios.filter (a) => a.url.includes(@search.q)
        else
          null
      user: -> @$store.state.user
      audios: -> @$store.state.audios
    methods:
      handle_search: (e) ->
        if @search.q != e.target.value
          @search =
            q: if e.target.value == '' then null else e.target.value
      handle_search_keyup: (e) ->
        if @search.q != e.target.value
          @search =
            q: if e.target.value == '' then null else e.target.value
  }
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .dashboard {
    font-family: 'arconregular';
    padding-top: 40px;
  }
</style>

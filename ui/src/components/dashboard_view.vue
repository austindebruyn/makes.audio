<template lang="pug">
  app-template
    .dashboard
      .row
        .col-12.col-md-5.col-lg-3
          dashboard-upload
          section.search
            h2 Search
            input.form-control(
              name='q'
              type='search'
              autocomplete='off'
              placeholder='Keywords, title, URLs...'
              @search='handle_search'
              @keyup='handle_search_keyup'
            )
          section.sort
            h5 Sort By
            dashboard-sort-control(
              v-for='label in Object.keys(this.sort)'
              :key='label'
              :label='label'
              :value='sort_value_for(label)'
              @changed='handle_sort_changed'
            )
        .col-12.col-md-7.col-lg-9
          dashboard-audio-list(
            v-if='audios && audios.length'
            key='list'
            :q='search && search.q'
            :audios='filtered_audios'
            :sort='sort'
          )
          zero-data-state(v-else-if='audios', key='zds')
          div(v-else=true, key='loading')
            loading
</template>

<script lang="coffee">
  import Vue from 'vue'
  import loading_component from 'components/loading'
  import app_template from 'components/app_template'
  import dashboard_audio_list from 'components/dashboard/audio_list'
  import dashboard_upload from 'components/dashboard/upload'
  import dashboard_zds from 'components/dashboard/zero_data_state'
  import dashboard_sort_control from 'components/dashboard/dashboard_sort_control'

  export default {
    name: 'dashboard-view'
    components:
      'app-template': app_template
      loading: loading_component
      'dashboard-audio-list': dashboard_audio_list
      'dashboard-upload': dashboard_upload
      'zero-data-state': dashboard_zds
      'dashboard-sort-control': dashboard_sort_control
    data: ->
      search:
        q: null
      sort:
        filename: null
        date: 'dsc'
        length: null
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
      handle_sort_changed: (label, new_value) ->
        @sort = Object.assign {}, @sort,
          "#{label}": new_value
      sort_value_for: (label) -> @sort[label]
  }
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .dashboard {
    padding-top: 40px;

    section.search,
    section.sort {
      padding-bottom: 2rem;
    }
  }
</style>

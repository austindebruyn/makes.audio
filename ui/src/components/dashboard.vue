<template lang="pug">
  app-template
    .dashboard
      .row
        .col-12.col-md-5.col-lg-3
          dashboard-upload
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

  export default Vue.component 'dashboard',
    data: ->
      search:
        q: null
        loading: false
    mounted: -> store.dispatch 'fetch_audios' unless @audios
    computed:
      filtered_audios: ->
        if @audios
          return @audios if @search.loading
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
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .dashboard {
    font-family: 'arconregular';
    padding-top: 40px;
  }
</style>

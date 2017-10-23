<template lang="pug">
  app-template
    loading.center-padding(v-if='!audios')
    .row(v-else-if='!audio')
      h2 Bad URL
    .row(v-else=true)
      .col-12
        nav.breadcrumb
          router-link(to='/dashboard').breadcrumb-item Dashboard
          span.breadcrumb-item.active {{ audio.url }}
      #waveform
      .col-md-12
        form(
          ref='form'
          :action='audio.updateUrl'
          method='PUT'
          @submit='handle_submit_url'
        )
          input(hidden='true', type='submit', value='Submit')
          span.public-url-host {{ public_url_host }}
          span.public-url-slash /
          input.public-url-path(
            :value='audio.url'
            name='url'
            autocomplete='off'
          )
      .col-md-6
        .checkbox
          input(
            id='visible'
            type='checkbox'
            :checked='audio.visible'
            @change='handle_visible_change'
          )
          label(for='visible') Visible
        form(
          :action='audio.updateUrl'
          method='DELETE'
          @submit='on_submit_delete'
        )
          button(type='submit').btn.btn-link
            | Delete {{ audio.url }}
      .col-md-6
        edit-audio-stats-card(:audio='audio')
</template>

<script lang="coffee">
  import Vue from 'vue'
  import store from 'state/store'
  import find from 'lodash/find'
  import Toaster from 'lib/toaster'
  import moment from 'moment'
  import app_template from 'components/app_template'
  import card from 'components/controls/card'
  import input_text from 'components/controls/input_text'
  import loading from 'components/loading'
  import WaveSurfer from 'wavesurfer.js'

  export default {
    name: 'edit-audio'
    components:
      'app-template': app_template
      card: card
      loading: loading
      'input-text': input_text
    data: ->
      loading: false
    computed:
      audios: -> @$store.state.audios
      audio: ->
        return find(@audios, id: parseInt(@$route.params.id)) if @audios
        null
      display_created_at: ->
        moment(@audio.createdAt).format 'LL'
      public_url_host: ->
        new URL(@audio.publicUrl).host
    mounted: ->
      store.dispatch 'fetch_audios' unless @audios
    methods:
      on_submit_delete: (e) ->
        e.preventDefault()
        fetch e.target.getAttribute('action'),
          method: 'DELETE'
          credentials: 'same-origin'
        .then (data) -> data.json()
        .then (json) ->
          debugger
      handle_visible_change: (e) ->
        @save(visible: e.target.checked)
      handle_submit_url: (e) ->
        e.preventDefault()
        @save(url: e.target.url.value)
      save: (body) ->
        @loading = true
        fetch @audio.updateUrl,
          method: 'PATCH'
          headers:
            Accept: 'application/json'
            'Content-Type': 'application/json'
          credentials: 'same-origin'
          body: JSON.stringify body
        .then (data) -> data.json()
        .then (json) =>
          @loading = false
          if json.errors
            Toaster.create 'danger', error for error in json.errors
          else
            store.commit 'update_audio', json.audio
            message = "#{json.audio.url} has been updated."
            Toaster.create 'success', message, 'Great!'
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';
  @import 'src/styles/fonts';

  .center-padding {
    padding: 180px 0;
  }

  .public-url-host {
    font-family: arconregular, sans-serif;
    font-size: 1.4rem;
    color: $gray;
  }

  .public-url-slash {
    font-family: arconregular, sans-serif;
    font-size: 1.4rem;
    color: $gray-dark;
  }

  .public-url-path {
    font-size: 1.4rem;
    font-family: arconregular, sans-serif;
    border: none;
    border-bottom: 2px dashed $pink;
    padding: 0;
    color: $pink;

    &:focus {
      outline: 0;
    }
  }
</style>

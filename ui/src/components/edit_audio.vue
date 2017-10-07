<template lang="pug">
  app-template
    div(v-if='!audios')
      .content-center
        p loading...
    .row(v-if='audios')
      .col-md-12
        router-link(to='/dashboard') Back to Dashboard
        h2.title.title-up Edit {{ audio.url }}
      .col-md-6
        form(:action='audio.updateUrl', method='PUT', @submit='on_submit', ref='form')
          input(hidden='true', type='submit', value='Submit')
          input.form-control(type='text', name='url', :value='audio.url', autocomplete='off')
          .checkbox
            input(id='visible', type='checkbox', v-model='audio.visible', @change='handle_change')
            label(for='visible') Visible
        form(:action='audio.updateUrl', method='DELETE', @submit='on_submit_delete')
          button(type='submit').btn.btn-primary Delete
      .col-md-6
        edit-audio-stats-card(:audio='audio')
</template>

<script lang="coffee">
  import Vue from 'vue'
  import store from 'state/store'
  import find from 'lodash/find'
  import { create_toast } from 'lib/toaster'
  import moment from 'moment'

  export default Vue.component 'edit_audio',
    computed:
      audios: -> @$store.state.audios
      audio: -> if @audios then find(@audios, id: parseInt(@$route.params.id)) else null
      display_created_at: ->
        moment(@audio.createdAt).format 'LL'
    mounted: -> store.dispatch 'fetch_audios' unless @audios
    methods:
      handle_change: (e) ->
        @save()
      on_submit_delete: (e) ->
        e.preventDefault()
        fetch e.target.getAttribute('action'),
          method: 'DELETE'
          credentials: 'same-origin'
        .then (data) -> data.json()
        .then (json) ->
          debugger
      on_submit: (e) ->
        e.preventDefault()
        @save()
      save: ->
        fetch @$refs.form.getAttribute('action'),
          method: 'PUT'
          headers:
            'Content-Type': 'application/json'
          credentials: 'same-origin'
          body: JSON.stringify
            url: @$refs.form.url.value
            visible: @audio.visible
        .then (data) -> data.json()
        .then (json) ->
          if json.errors
            create_toast.create 'danger', error for error in json.errors
          else
            # store.commit 'set_
            store.dispatch audio_actions.update_audio json
            create_toast.create 'success', "#{json.url} has been saved.", 'Great!'
</script>

<style lang="scss">
</style>

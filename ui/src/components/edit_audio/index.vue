<template lang="pug">
  app-template
    loading.center-padding(v-if='!audios')
    .row(v-else=true)
      .col-12
        nav.breadcrumb
          router-link(to='/dashboard').breadcrumb-item Dashboard
          span.breadcrumb-item.active {{ audio.url }}
      .col-md-12
        h2.title.title-up Editing {{ audio.url }}
      .col-md-6
        form(
          :action='audio.updateUrl'
          method='PUT'
          @submit='on_submit'
          ref='form'
        )
          input(hidden='true', type='submit', value='Submit')
          input-text(name='url', :value='audio.url')
          .checkbox
            input(
              id='visible'
              type='checkbox'
              v-model='audio.visible'
              @change='handle_change'
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

  export default {
    name: 'edit-audio'
    components:
      'app-template': app_template
      card: card
      loading: loading
      'input-text': input_text
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
            Toaster.create.create 'danger', error for error in json.errors
          else
            # store.commit 'set_
            store.dispatch audio_actions.update_audio json
            Toaster.create.create 'success', "#{json.url} has been saved.", 'Great!'
  }
</script>

<style lang="scss" scoped>
  .center-padding {
    padding: 180px 0;
  }
</style>

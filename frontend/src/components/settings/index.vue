<template lang="pug">
  app-template
    .settings-page
      .row
        .col-12.col-md-3
          img
          h2 {{ user.username }}
        .col-12.col-md-9
          loading(v-if='!user')
          card.card-plain(v-if='user')
            .card-content
              h1 Account Settings
              user-form(:user='user')
</template>

<script lang="coffee">
  import Vue from 'vue'
  import store from 'state/store'
  import audio_actions from 'state/actions/audios'
  import audio_api from 'api/audios'
  import FlashEngine from 'lib/flash_engine'

  export default Vue.component 'settings',
    data: ->
      audios: @$select 'audios'
      user: @$select 'user'
      username: @user && @user.username
    methods:
      a: ->
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .settings-page {
    padding-top: 40px;
  }
</style>

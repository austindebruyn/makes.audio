<template lang="pug">
  app-template
    .settings-page
      .row
        .col-12.col-md-3
          img
          h2 {{ user.username }}
        .col-12.col-md-9
          loading(v-if='!loaded')
          card.card-plain(v-if='loaded')
            .card-content
              h1 Account Settings
              user-form(:user='user', :email_preferences='email_preferences')
</template>

<script lang="coffee">
  import Vue from 'vue'
  import store from 'state/store'
  import email_preferences_api from 'api/email_preferences'
  import FlashEngine from 'lib/flash_engine'

  export default Vue.component 'settings',
    data: ->
      user: @$select 'user'
      email_preferences: @$select 'email_preferences'
      username: @user && @user.username
    computed:
      loaded: -> @email_preferences and @user
    mounted: ->
      email_preferences_api.fetch() unless @email_preferences
    methods:
      a: ->
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .settings-page {
    padding-top: 40px;
  }
</style>

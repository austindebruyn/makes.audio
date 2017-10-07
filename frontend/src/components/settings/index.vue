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
  import FlashEngine from 'lib/flash_engine'

  export default Vue.component 'settings',
    data: ->
      username: @user && @user.username
    computed:
      user: -> @$store.state.user
      email_preferences: -> @$store.state.email_preferences
      loaded: -> @email_preferences and @user
    mounted: ->
      store.dispatch 'fetch_email_preferences' unless @email_preferences
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .settings-page {
    padding-top: 40px;
  }
</style>

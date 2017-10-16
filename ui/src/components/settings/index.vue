<template lang="pug">
  app-template
    .settings-page
      .row
        .col-12.col-md-3
          card.card-plain.user-info-card
            .profile-picture-container
              img(src='./profile-pic.png', alt='Default profile picture')
            h2 {{ user.username }}
            p.text-muted {{ relative_user_age }}
        .col-12.col-md-9
          loading(v-if='!loaded')
          card.card-plain(v-else=true)
            h1 Account
            user-form(:user='user', :email_preferences='email_preferences')
</template>

<script lang="coffee">
  import Vue from 'vue'
  import app_template from 'components/app_template'
  import loading_component from 'components/loading'
  import card_component from 'components/controls/card'
  import user_form from 'components/settings/user_form'
  import moment from 'moment'

  export default {
    name: 'settings-page'
    components:
      'app-template': app_template
      loading: loading_component
      card: card_component
      'user-form': user_form
    data: ->
      username: @user and @user.username
    computed:
      user: -> @$store.state.user
      email_preferences: -> @$store.state.email_preferences
      loaded: -> @email_preferences and @user
      relative_user_age: ->
        "Signed up #{moment(@user.createdAt).fromNow()}"
    mounted: ->
      @$store.dispatch 'fetch_email_preferences' unless @email_preferences
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .settings-page {
    padding-top: 40px;
  }

  .profile-picture-container {
    img {
      width: 100%;
    }

    padding-bottom: 20px;
  }
</style>

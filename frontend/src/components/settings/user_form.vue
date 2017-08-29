<template lang="pug">
  form.user-form(@submit='handle_submit')
    .form-group
      label(for='username') Username
      input.form-control(type='text', name='username', v-model='username', spellcheck='false', autocomplete='off', :disabled='loading')
      label(for='email') Email
      input.form-control(type='text', name='email', v-model='email', spellcheck='false', :disabled='loading')
    .form-group
      .btn.btn-link Send password reset email
    .form-group
      button(type='submit', :disabled='loading').btn.btn-primary Save
</template>

<script lang="coffee">
  import Vue from 'vue'
  import store from 'state/store'
  import audio_actions from 'state/actions/audios'
  import audio_api from 'api/audios'
  import FlashEngine from 'lib/flash_engine'

  export default Vue.component 'user-form',
    props:
      user: (type: Object, required: true)
    data: ->
      username: @user.username
      email: @user.email
      loading: false
    computed:
      account_created: -> 'hi'
    methods:
      handle_submit: (e) ->
        e.preventDefault()
        payload =
          username: @username
        fetch '/api/users/me',
          method: 'PUT',
          credentials: 'same-origin',
          headers: ('Content-Type': 'application/json')
          body: JSON.stringify payload
        .then (resp) -> resp.json()
        .then (data) =>
          @loading = false
          console.log(data)
        @loading = true
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .user-form {
  }
</style>

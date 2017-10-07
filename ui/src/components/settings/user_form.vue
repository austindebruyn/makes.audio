<template lang="pug">
  .user-form
    form(@submit='handle_submit')
      .form-group
        label(for='username') Username
        input.form-control(type='text', name='username', v-model='username', spellcheck='false', autocomplete='off', :disabled='loading')
        label(for='email') Email
        input.form-control(type='text', name='email', v-model='email', spellcheck='false', :disabled='loading')
        small.verify-email-warning(v-if='!email_preferences.verifiedAt')
          i.fa.fa-exclamation-triangle
          span Your email has not been verified yet.&nbsp;
          a(href='javascript:;', @click='handle_resend_email_verification_link') Send email again
      .form-group
        button(type='submit', :disabled='loading').btn.btn-primary Save
    form(@submit='handle_submit_password')
      .form-group
        h2 Change Password
        label(for='password') New Password
        input.form-control(type='password', name='password', v-model='password')
        label(for='password') Current Password
        input.form-control(type='password', name='currentPassword', v-model='currentPassword')
      .form-group
        button(type='submit', :disabled='loading').btn.btn-primary Save
</template>

<script lang="coffee">
  import Vue from 'vue'
  import errors from 'i18n/errors'
  import store from 'state/store'
  import FlashEngine from 'lib/flash_engine'

  export default Vue.component 'user-form',
    props:
      user: (type: Object, required: true)
      email_preferences: (type: Object, required: true)
    data: ->
      username: @user.username
      email: @user.email
      loading: false
      password: ''
      currentPassword: ''
    computed:
      account_created: -> 'hi'
    methods:
      handle_submit: (e) ->
        e.preventDefault()
        fetch '/api/users/me',
          method: 'PUT',
          credentials: 'same-origin',
          headers: ('Content-Type': 'application/json', 'Accept': 'application/json')
          body: JSON.stringify
            username: @username
            email: @email
        .then (resp) -> resp.json()
        .then (json) =>
          @loading = false
          if json.ok
            @$store.commit 'set_user', json.user
            FlashEngine.create 'success', "You've been updated.", 'Great!'
          else if json.errors and json.errors.length
            FlashEngine.create 'warn', errors.update_user[error.code] for error in json.errors
          else
            FlashEngine.create 'danger', 'Please try again later.', 'Server Error!'
        @loading = true
      handle_submit_password: (e) ->
        e.preventDefault()
        fetch '/api/users/me',
          method: 'PUT',
          credentials: 'same-origin',
          headers: ('Content-Type': 'application/json', 'Accept': 'application/json')
          body: JSON.stringify
            password: @password
            currentPassword: @currentPassword
        .then (resp) -> resp.json()
        .then (json) =>
          @loading = false
          if json.ok
            FlashEngine.create 'success', 'Done!'
            @password = ''
            @currentPassword = ''
          else
            FlashEngine.create 'danger', errors.update_user[error.code] for error in json.errors
        @loading = true
      handle_resend_email_verification_link: (e) ->
        e.preventDefault()
        fetch '/api/users/me/emailPreferences/sendVerificationEmail',
          method: 'POST',
          credentials: 'same-origin',
          headers: ('Accept': 'application/json')
        .then (resp) -> resp.json()
        .then (json) =>
          @loading = false
          if json.ok
            FlashEngine.create 'success', 'Please check your email for a verification link.'
          else
            FlashEngine.create 'danger', 'Something went wrong.'
        @loading = true
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .user-form {
  }

  .verify-email-warning {
    color: $gray-dark;

    a {
      text-decoration: underline;
      color: $gray-dark;
    }

    i { margin-right: 5px; }

    font-size: 0.7rem;
  }
</style>

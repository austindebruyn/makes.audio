<template lang="pug">
  auth-template.login-page
    .content-center
      card.card-login.card-plain
        .header.header-primary.text-center
          img.branding(src='/branding/makes-audio-logo-300.png', title='MAKES.AUDIO')
        p Enter the token received in your password reset email.
        form(action='/api/passwordResets/complete', method='POST', @submit="on_submit")
          .form-group
            .input-group
              span.input-group-addon
                i.fa.fa-key
              input.transparent.round.input-lg.form-control(type='text',
                                                            autocomplete='off',
                                                            name='code',
                                                            placeholder='Code',
                                                            :disabled='loading')
            .input-group
              span.input-group-addon
                i.fa.fa-lock
              input.transparent.round.input-lg.form-control(type='password',
                                                            autocomplete='off',
                                                            name='password',
                                                            placeholder='New Password',
                                                            :disabled='loading')
            .input-group
              span.input-group-addon
                i.fa.fa-lock
              input.transparent.round.input-lg.form-control(type='password',
                                                            autocomplete='off',
                                                            name='password2',
                                                            placeholder='Confirm Password',
                                                            :disabled='loading')
          .form-group
            .input-group
              button.btn.btn-primary.btn-round.btn-lg.btn-block(type='submit', :disabled="loading") Reset
          router-link.btn.btn-link(to='/passwordResets/new', :disabled='loading') Send Email Again
          router-link.btn.btn-link(to='/', :disabled='loading') Back to Login
</template>

<script lang="coffee">
  import Vue from 'vue'
  import store from 'state/store'
  import actions from 'state/actions'
  import FlashEngine from 'lib/flash_engine'
  import errors from 'i18n/errors'

  export default Vue.component 'complete-password-reset',
    data: ->
      loading: false
    beforeRouteLeave: (to, from, next) -> next !@loading
    methods:
      on_submit: (e) ->
        e.preventDefault()
        @loading = true
        fetch e.target.getAttribute('action'),
          method: 'POST'
          credentials: 'same-origin'
          headers:
            Accept: 'application/json'
            'Content-Type': 'application/json'
          body: JSON.stringify
            code: e.target.code.value
            password: e.target.password.value
            password2: e.target.password2.value
        .then (data) -> data.json()
        .then (json) =>
          @loading = false
          if json.ok
            store.dispatch actions.login json.user
            FlashEngine.create 'success', 'Your password has been changed.', 'Success!'
            return @$router.push '/dashboard'
          else if json.errors and json.errors.length
            FlashEngine.create 'danger', errors.password_resets[error.code] for error in json.errors
          else
            FlashEngine.create 'danger', 'Something went wrong!'
</script>

<style lang="scss">
  .header .branding {
    width: 150px;
    padding-bottom: 40px;
  }
</style>

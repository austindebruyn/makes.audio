<template lang="pug">
  auth-template.login-page
    .content-center
      card.card-login.card-plain
        .header.header-primary.text-center
          img.branding(
              src='/branding/makes-audio-logo-300.png'
              title='MAKES.AUDIO'
            )
        p Enter the token received in your password reset email.
        form(
          action='/api/passwordResets/complete'
          method='POST'
          @submit='on_submit'
        )
          .form-group
            .input-group
              span.input-group-addon
                i.fa.fa-key
              input.transparent.round.input-lg.form-control(
                type='text'
                autocomplete='off'
                name='code'
                v-model='code'
                placeholder='Code'
                :disabled='loading'
              )
            .input-group
              span.input-group-addon
                i.fa.fa-lock
              input.transparent.round.input-lg.form-control(
                type='password'
                autocomplete='off'
                name='password'
                placeholder='New Password'
                :disabled='loading'
              )
            .input-group
              span.input-group-addon
                i.fa.fa-lock
              input.transparent.round.input-lg.form-control(
                type='password'
                autocomplete='off'
                name='password2'
                placeholder='Confirm Password'
                :disabled='loading'
              )
          .form-group
            .input-group
              button.btn.btn-primary.btn-round.btn-lg.btn-block(
                type='submit'
                :disabled="loading"
              ) Reset
          router-link.btn.btn-link(
            to='/passwordResets/new'
            :disabled='loading'
          ) Send Email Again
          router-link.btn.btn-link(to='/', :disabled='loading') Back to Login
</template>

<script lang="coffee">
  import Vue from 'vue'
  import Toaster from 'lib/toaster'
  import errors from 'i18n/errors'
  import card from 'components/controls/card'
  import auth_template from 'components/auth/auth_template'

  export default {
    name: 'complete-password-reset'
    components:
      'auth-template': auth_template
      card: card
    data: ->
      loading: false
      code: null
    beforeRouteLeave: (to, from, next) -> next !@loading
    mounted: ->
      @code = @$route.query.code if @$route and @$route.query.code?
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
            code: @code
            password: e.target.password.value
            password2: e.target.password2.value
        .then (data) -> data.json()
        .then (json) =>
          @loading = false
          if json.ok
            @$store.commit 'set_user', json.user
            message = 'Your password has been changed.'
            Toaster.create 'success', message, 'Success!'
            @$router.push '/dashboard'
          else if json.errors and json.errors.length
            for error in json.errors
              Toaster.create 'danger', errors.password_resets[error.code]
          else
            Toaster.create 'danger', 'Something went wrong!'
  }
</script>

<style lang="scss">
  .header .branding {
    width: 150px;
    padding-bottom: 40px;
  }
</style>

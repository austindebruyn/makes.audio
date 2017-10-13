<template lang="pug">
  auth-template.login-page
    .content-center
      card.card-login.card-plain
        .header.header-primary.text-center
          img.branding(
            :src='branding_logo'
            title='MAKES.AUDIO'
          )
        p Forgot your password?
        p
          | Enter the email you signed up with and an email with instructions
          | will be sent to you.
        form(action='/api/passwordResets', method='POST', @submit='on_submit')
          .form-group
            .input-group
              span.input-group-addon
                i.fa.fa-envelope-o
              input.transparent.round.input-lg.form-control(
                type='text'
                autocomplete='off'
                name='email'
                placeholder='Email'
                :disabled='loading'
              )
          .form-group
            .input-group
              button.btn.btn-primary.btn-round.btn-lg.btn-block(
                type='submit'
                :disabled='loading'
              ) Send Email
          router-link.btn.btn-link(to='/', :disabled='loading') Back to Login
</template>

<script lang="coffee">
  import Vue from 'vue'
  import Toaster from 'lib/toaster'
  import errors from 'i18n/errors'
  import card from 'components/controls/card'
  import auth_template from 'components/auth/auth_template'
  import branding_logo from 'components/auth/branding/makes-audio-logo-300.png'

  export default {
    name: 'new-password-reset'
    components:
      card: card
      'auth-template': auth_template
    data: ->
      loading: false
    computed:
      branding_logo: -> branding_logo
    beforeRouteLeave: (to, from, next) -> next !@loading
    methods:
      on_submit: (e) ->
        e.preventDefault()
        email = e.target.email.value
        @loading = true
        fetch e.target.getAttribute('action'),
          method: 'POST'
          credentials: 'same-origin'
          headers:
            Accept: 'application/json'
            'Content-Type': 'application/json'
          body: JSON.stringify
            email: email
        .then (data) -> data.json()
        .then (json) =>
          @loading = false
          if json.ok
            Toaster.create 'success', "An email has been sent to #{email}.", 'Success!'
            return @$router.push '/passwordResets/complete'
          else if json.errors and json.errors.length
            Toaster.create 'danger', errors.password_resets[error.code] for error in json.errors
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

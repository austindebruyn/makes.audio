<template lang="pug">
  auth-template.login-page
    .content-center
      card.card-login.card-plain
        .header.header-primary.text-center
          img.branding(src='/branding/makes-audio-logo-300.png', title='MAKES.AUDIO')
        p Enter the token received in your email.
        form(action='/api/users/me/emailPreferences', ref='form', method='PATCH', @submit="on_submit")
          .form-group
            input(type='hidden', name='action', value='verify')
            .input-group
              span.input-group-addon
                i.fa.fa-lock
              input.transparent.round.input-lg.form-control(type='text',
                                                            autocomplete='off',
                                                            name='verificationCode',
                                                            v-model='verificationCode',
                                                            placeholder='Verification code',
                                                            :disabled='loading')
          .form-group
            .input-group
              button.btn.btn-primary.btn-round.btn-lg.btn-block(type='submit', :disabled="loading") Verify
          router-link.btn.btn-link(to='/', :disabled='loading') Back to Login
</template>

<script lang="coffee">
  import Vue from 'vue'
  import store from 'state/store'
  import Toaster from 'lib/toaster'
  import errors from 'i18n/errors'
  import query_string from 'query-string'
  import { mapState } from 'vuex'

  export default Vue.component 'verify-email',
    data: ->
      loading: false
      verificationCode: null
    computed:
      user: -> @$store.state.user
    beforeRouteLeave: (to, from, next) -> next !@loading
    mounted: ->
      params = query_string.parse(location.search)
      @verificationCode = params.verificationCode if params.verificationCode?

      @submit() if @verificationCode
    methods:
      on_submit: (e) ->
        e.preventDefault()
        @submit()
      submit: () ->
        @loading = true
        fetch @$refs.form.getAttribute('action'),
          method: 'PATCH'
          credentials: 'same-origin'
          headers:
            Accept: 'application/json'
            'Content-Type': 'application/json'
          body: JSON.stringify
            action: 'verify'
            verificationCode: @verificationCode
        .then (data) -> data.json()
        .then (json) =>
          @loading = false
          if json.ok
            if @user
              Toaster.create 'success', 'Thanks for verifying your email.', 'Success!'
              return @$router.push '/dashboard'
            else
              Toaster.create 'success', 'Thanks for verifying your email. Please log in now.', 'Success!'
              return @$router.push '/'
          else if json.errors and json.errors.length
            Toaster.create 'danger', errors.verify_email[error.code] for error in json.errors
          else
            Toaster.create 'danger', 'Something went wrong!'
</script>

<style lang="scss">
  .header .branding {
    width: 150px;
    padding-bottom: 40px;
  }
</style>

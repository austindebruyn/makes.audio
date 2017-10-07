<template lang="pug">
  auth-template.login-page
    .content-center
      card.card-login.card-plain
        .header.header-primary.text-center
          img.branding(src='/branding/makes-audio-logo-300.png', title='MAKES.AUDIO')
        form(action='/api/users', method='POST', @submit="on_submit")
          .form-group
            .input-group
              span.input-group-addon
                i.fa.fa-user-o
              input.transparent.round.input-lg.form-control(type='text', autocomplete='off', name='username', placeholder='Username', :disabled='async')
            .input-group
              span.input-group-addon
                i.fa.fa-envelope-o
              input.transparent.round.input-lg.form-control(type='text', autocomplete='off', name='email', placeholder='Email', :disabled='async')
            .input-group
              span.input-group-addon
                i.fa.fa-ticket
              input.transparent.round.input-lg.form-control(type='text', autocomplete='off', name='inviteCode', placeholder='Invite Code', :disabled='async')
            .input-group
              span.input-group-addon
                i.fa.fa-lock
              input.transparent.round.input-lg.form-control(type='password', autocomplete='off', name='password', placeholder='Password', :disabled='async')
            .input-group
              span.input-group-addon
                i.fa.fa-lock
              input.transparent.round.input-lg.form-control(type='password', autocomplete='off', name='password2', placeholder='Confirm', :disabled='async')
          .form-group
            .input-group
              button.btn.btn-primary.btn-round.btn-lg.btn-block(type='submit', :disabled="async") Get Started
          router-link.btn.btn-link(to='/') Login to an existing account
</template>

<script lang="coffee">
  import Vue from 'vue'
  import FlashEngine from 'lib/flash_engine'
  import errors from 'i18n/errors'

  export default Vue.component 'create-account',
    data: ->
      async: false
    beforeRouteLeave: (to, from, next) -> next !@async
    methods:
      on_submit: (e) ->
        e.preventDefault()
        @async = true
        fetch e.target.getAttribute('action'),
          method: 'POST'
          credentials: 'same-origin'
          headers:
            'Content-Type': 'application/json'
          body: JSON.stringify
            username: e.target.username.value
            email: e.target.email.value
            inviteCode: e.target.inviteCode.value
            password: e.target.password.value
            password2: e.target.password2.value
        .then (data) -> data.json()
        .then (json) =>
          @async = false
          if json.ok
            @$store.commit 'set_user', json.user
            FlashEngine.create 'info', "Welcome #{json.user.username}!"
            return @$router.push '/dashboard'
          else if json.errors and json.errors.length
            FlashEngine.create 'danger', errors[error.code] for error in json.errors
          else
            FlashEngine.create 'danger', 'Something went wrong!'
</script>

<style lang="scss">
  .header .branding {
    width: 150px;
    padding-bottom: 40px;
  }
</style>

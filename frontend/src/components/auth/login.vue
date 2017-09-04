<template lang="pug">
  auth-template.login-page
    .content-center
      card.card-login.card-plain
        .header.header-primary.text-center
          img.branding(src='/branding/makes-audio-logo-300.png', title='MAKES.AUDIO')
        form(action='/login', method='POST', @submit='on_submit')
          .form-group
            .input-group
              span.input-group-addon
                i.fa.fa-user-o
              input.transparent.round.input-lg.form-control(type='text', autocomplete='off', name='username', placeholder='Username', :disabled='async')
            .input-group
              span.input-group-addon
                i.fa.fa-lock
              input.transparent.round.input-lg.form-control(type='password', autocomplete='off', name='password', placeholder='Password', :disabled='async')
          .form-group
            button.btn.btn-primary.btn-round.btn-lg.btn-block(type='submit', :disabled="async") Submit
          router-link.btn.btn-link(to='/create') Create an Account
</template>

<script lang="coffee">
  import Vue from 'vue'
  import store from 'state/store'
  import actions from 'state/actions'
  import FlashEngine from 'lib/flash_engine'
  import errors from 'i18n/errors'

  export default Vue.component 'login',
    data: ->
      async: false
    beforeRouteLeave: (to, from, next) -> next !@async
    methods:
      on_submit: (e) ->
        e.preventDefault()
        @async = true
        fetch '/login',
          method: 'POST'
          credentials: 'same-origin'
          headers:
            'Content-Type': 'application/json'
          body: JSON.stringify
            username: e.target.username.value
            password: e.target.password.value
        .then (data) -> data.json()
        .then (json) =>
          @async = false
          if json.ok
            store.dispatch actions.login json.user
            FlashEngine.create 'info', "Welcome back #{json.user.username}!"
            return @$router.push '/dashboard'
          FlashEngine.create 'danger', errors[error] for error in json.errors
</script>

<style lang="scss">
  .header .branding {
    width: 150px;
    padding-bottom: 40px;
  }
</style>

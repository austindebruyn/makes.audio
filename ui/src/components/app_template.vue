<template lang="pug">
  div(:class='{ "nav-open": nav_open }')
    nav.navbar.navbar-toggleable-md
      button.navbar-toggler.navbar-toggler-right(
        @click='handle_navbar_click'
        :class='toggler_class'
        type='button'
      )
        .fa.fa-bars
      .container
        a.navbar-brand(href='#') Makes.Audio
        .collapse.navbar-collapse(:class='{ show: nav_open }')
          ul.navbar-nav
            li.nav-item.active
              router-link.nav-link(to='/dashboard') Dashboard
            li.nav-item
              a.nav-link(href='#') Desktop App
            li.nav-item
              router-link.nav-link(to='/settings') Account
            li.nav-item
              a.nav-link(
                @click='handle_logout_click'
                href='javascript:;'
              ) Logout
    .container
      slot
    uploads-progress(v-if='render_uploads_progress')
</template>

<script lang="coffee">
  import Vue from 'vue'
  import Toaster from 'lib/toaster'
  import remove from 'lodash.remove'

  export default {
    name: 'app-template'
    data: ->
      open: false
      nav_open: false
    computed:
      toggler_class: ->
        toggled: @nav_open
      render_uploads_progress: -> @$store and @$store.state.uploads
    methods:
      handle_navbar_click: -> @nav_open = !@nav_open
      handle_logout_click: ->
        fetch '/logout',
          method: 'POST'
          credentials: 'same-origin'
        .then (data) -> data.json()
        .then (json) =>
          if json.ok
            Toaster.create 'info', "You're signed out.", 'Bye!'
            @$store.commit 'set_user', null
            @$router.push '/'
          else
            Toaster.create 'danger', "You weren't signed out.", 'Error!'
  }
</script>

<style lang="scss">
  @import 'src/styles/colors';

  nav.navbar {
    background-color: $pink;
    font-family: 'arconregular';
    margin-bottom: 20px;

    a, button {
      color: $white;
    }
  }
  .navbar-brand {
    color: $white;
    text-transform: uppercase;
    font-size: 0.85rem;
  }
</style>

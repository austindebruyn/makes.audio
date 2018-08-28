<template lang="pug">
  div(
    :class='{ "nav-open": nav_open }'
    @dragenter='handle_dragging'
    @dragover='handle_dragover'
    @dragleave='handle_dragging'
  )
    nav.navbar.navbar-toggleable-md
      .container.container-md
        a.navbar-brand(href='#') Makes.Audio
        .collapse.navbar-collapse(:class='{ show: nav_open }')
          ul.navbar-nav
            li
              router-link(to='/dashboard').nav-item
                span.fa.fa-dashboard
                .nav-link Dashboard
            li
              router-link(to='/nimbus').nav-item
                span.fa.fa-cloud-upload
                .nav-link Nimbus
            li
              router-link(to='/settings').nav-item
                span.fa.fa-cog
                .nav-link Account
            li
              a.nav-item(
                @click='handle_logout_click'
                href='javascript:;'
              )
                .nav-link Logout
      button.navbar-toggler.navbar-toggler-right(
        @click='handle_navbar_click'
        :class='toggler_class'
        type='button'
      )
        .fa.fa-bars
    .bg-white.page-content
      .container
        slot
    the-footer
    uploads-progress(v-if='render_uploads_progress')
    drop-container(v-if='dragging.started', @dropfinished='reset_dragging_state')
</template>

<script lang="coffee">
  import Vue from 'vue'
  import Toaster from 'lib/toaster'
  import drop_container from 'components/structure/drop_container'
  import remove from 'lodash.remove'
  import the_footer from 'components/the_footer'
  import uploads_progress from 'components/uploads_progress'

  has_files = (evt) ->
    if evt.dataTransfer.types
      for type in evt.dataTransfer.types
        if type == 'Files' then return true
    return false

  export default {
    name: 'app-template'
    components:
      'drop-container': drop_container
      'the-footer': the_footer
      'uploads-progress': uploads_progress
    data: ->
      open: false
      nav_open: false
      dragging:
        started: false
        counter: 0
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
      handle_dragging: (e) ->
        e.preventDefault()
        e.stopPropagation()
        if has_files e
          if e.type == 'dragenter' then @dragging.counter++ else @dragging.counter--
          @dragging.started = if @dragging.counter then true else false
      handle_dragover: (e) ->
        e.preventDefault()
        e.stopPropagation()
      reset_dragging_state: (e) ->
        @dragging =
          started: false
          counter: 0
  }
</script>

<style lang="scss">
  @import 'src/styles/colors';
  @import 'src/styles/mixins';

  .page-content {
    background-color: $white;
  }

  .container.container-md {
    margin-left: 0;
    margin-right: 0;

    @include media-breakpoint-up(md) {
      margin-left: auto;
      margin-right: auto;
    }
  }

  @include media-breakpoint-up(md) {
    .page-content {
      min-height: 800px;
    }
  }

  nav.navbar {
    background-color: $pink;
    font-family: 'tensoregular';

    @include media-breakpoint-up(md) {
      padding: 0;
    }

    a, button {
      color: $white;
      text-decoration: none;
    }

    .navbar-brand {
      color: $pink-light;
      text-transform: uppercase;
      font-size: 0.85rem;
    }

    .navbar-nav {
      align-items: flex-start;
    }
  }

  .navbar-brand,
  .nav-item {
    .fa {
      margin-right: 0.5rem;
    }

    @include media-breakpoint-up(md) {
      .fa {
        margin-right: 0;
      }
    }

    .nav-link {
      margin-right: 1.6rem;
    }

    &:last-child {
      .nav-link {
        margin-right: 0;
      }
    }
  }

  .nav-item {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 12px 12px 4px;

    .fa {
      font-size: 1.3rem;
    }

    border-bottom: 8px solid transparent;

    &.router-link-active,
    &:not(.router-link-active):hover {
      color: $white;
    }

    @include media-breakpoint-up(md) {
      &.router-link-active {
        border-color: $pink-light;
      }
      &:not(.router-link-active):hover {
        background-color: $pink-light;
        border-color: $pink-light;
      }
    }
  }

  .nav-link {
    display: inline-block;
  }
</style>

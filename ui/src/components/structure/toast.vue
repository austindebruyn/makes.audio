<template lang='pug'>
  div(role='alert', :class='classes', :style='styles')
    .container
      .alert-icon
        i.fa.fa-info
      .alert-message
        strong(v-if='title') {{ title }}
        | {{ message }}
      button.close(v-if='dismissable', type='button', @click='handle_click')
        span
          i.fa.fa-times
</template>

<script lang="coffee">
  import one_of from 'lib/one_of'

  export default {
    name: 'toast'
    props:
      idx: Number
      level: one_of ['success', 'danger', 'warning', 'info']
      title: String
      message: ( type: String, required: true )
      dismissable: Boolean
      dead: Boolean
    computed:
      classes: ->
        alert: true
        "alert-#{@level}": true
        dead: @dead
      styles: ->
        left: 0
        right: 0
        top: "#{@idx*90}px"
        position: 'absolute'
    methods:
      handle_click: -> @$emit 'click'
  }
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .alert{
    border: 0;
    border-radius: 0;
    color: $white;
    padding-top: .9rem;
    padding-bottom: .9rem;
    font-size: .9rem;
    line-height: 1.6rem;

    &.alert-success{
      background-color: $success;
    }

    &.alert-danger{
      background-color: $danger;
    }

    &.alert-warning{
      background-color: $warning;
    }

    &.alert-info{
      background-color: $info;
    }

    &.alert-primary{
      background-color: $primary;
    }

    .alert-icon{
      display: block;
      float: left;
      margin-right: 15px;
      margin-top: -1px;
    }

    strong{
      text-transform: uppercase;
      font-size: 0.8rem;
      margin-right: 0.5rem;
    }

    i.fa,
    i.now-ui-icons {
      font-size: 20px;
      padding: 5px 0;
    }

    .close {
      color: $white;
      opacity: .9;
      text-shadow: none;
      line-height: 0;
      outline: 0;
    }
  }
  .alert {
    transition: top 300ms ease-in-out, opacity 200ms;
  }
  .alert.dead {
    opacity: 0;
  }
  .alert-message {
    padding-right: 40px;
  }
  button.close {
    position: absolute;
    right: 10px;
    top: 0;
  }
</style>

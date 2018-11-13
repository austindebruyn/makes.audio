<template lang="pug">
  .fill-window-size(@click='handle_fill_click')
    .popup(ref='body', :class='classes')
      .popup-body
        h2 Confirm Delete
        p
         span= 'The audio '
         span.name {{ audio_name }}
         span= ' will be deleted permanently.'
      .popup-footer
        .btn.btn-secondary(@click='handle_cancel_click') Cancel
        .btn.btn-primary(@click='handle_confirm_click') Confirm
</template>

<script lang="coffee">
  import Vue from 'vue'

  export default {
    name: 'confirm-delete-popup'
    props:
      audio_name: String
    data: ->
      classes: 'out'
    mounted: ->
      setTimeout =>
        @classes = ''
      , 1
    methods:
      handle_fill_click: (e) ->
        e.stopPropagation()
        node = e.target
        while node
          if node is @$refs.body
            return false
          node = node.parentNode
        @$emit 'close'
      handle_cancel_click: ->
        @$emit 'close'
      handle_confirm_click: ->
        @$emit 'confirm'
  }
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .fill-window-size {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;

    background-color: rgba(0, 0, 0, 0.6);

    display: flex;
    align-items: center;
    justify-content: center;

    .popup {
      width: 500px;
      min-height: 200px;
      padding: 20px;

      background-color: white;

      position: relative;

      display: flex;
      flex-direction: column;

      .popup-body {
        flex-grow: 1;
      }

      .popup-footer {
        display: flex;
        justify-content: flex-end;
      }

      .btn {
       margin-left: 10px;
      }

      &.out {
        opacity: 0.1;
      }

      transition: 200ms opacity;
    }
  }
</style>

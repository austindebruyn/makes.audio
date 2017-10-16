<template lang="pug">
  .uploads-progress(:class='{ active: is_active }')
    .container
      .uploads-progress-content.d-flex.align-items-center
        span.progress-label {{ label_text }}
        .progress
          .progress-bar.bg-success(:style='progress_bar_styles')
</template>

<script lang="coffee">
  import Vue from 'vue'

  truncate = (str, len) ->
    if str.length > len then "#{str.slice(0, len)}…" else str

  export default {
    name: 'uploads-progress'
    computed:
      label_text: ->
        if @is_active then "Uploading #{truncate(@uploads[0].name, 14)}" else null
      is_active: ->
        @uploads and @uploads.filter((u) -> u.progress != 100).length
      progress_bar_styles: ->
        width = '0'
        if @uploads and @uploads.length > 0 and @uploads[0].progress
          width = "#{@uploads[0].progress}%"
        width: width
      uploads: -> @$store.state.uploads
  }
</script>

<style lang="scss">
  @import 'src/styles/colors';
  @import 'src/styles/mixins';

  .uploads-progress {
    position: fixed;
    left: 0;
    right: 0;
    height: 80px;
    background-color: $pink;

    transition: bottom 400ms ease-in-out;

    .progress-bar {
      transition: width 50ms ease-out;
      font-size: 1.2rem;
      height: 24px;
    }

    .uploads-progress-content {
      display: flex;
      flex-direction: column;
      height: 100%;

      @include media-breakpoint-up(md) {
        flex-direction: row;
      }
    }

    .progress-label {
      color: $white;
      padding: .5rem;

      @include media-breakpoint-up(md) {
        flex: 1;
      }
    }

    .progress {
      width: 100%;

      @include media-breakpoint-up(md) {
        flex: 3;
      }
    }

    &.active {
      bottom: 0;
    }
  }
</style>

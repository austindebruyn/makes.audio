<template lang="pug">
  .uploads-progress(:class='{ active: is_active }')
    .container
      .uploads-progress-content.d-flex.align-items-center
        .progress
          .progress-bar.progress-bar-striped.progress-bar-animated.bg-success(style='width: 75%')
            | {{ label_text }}
</template>

<script lang="coffee">
  import Vue from 'vue'

  export default Vue.component 'uploads-progress',
    data: ->
      uploads: @$select 'uploads'
    computed:
      label_text: -> 'Helo'
      is_active: -> @uploads and @uploads.length
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .uploads-progress {
    position: fixed;
    left: 0;
    right: 0;
    bottom: -60px;
    height: 60px;
    background-color: $pink-light;

    transition: bottom 400ms ease-in-out;

    .uploads-progress-content {
      height: 100%;
    }

    .progress {
      width: 100%;
    }

    &.active {
      bottom: 0;
    }
  }
</style>

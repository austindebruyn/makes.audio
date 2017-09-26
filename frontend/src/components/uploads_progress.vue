<template lang="pug">
  .uploads-progress(:class='{ active: is_active }')
    .container
      .uploads-progress-content.d-flex.align-items-center
        .progress
          .progress-bar.bg-success(:classes='progress_bar_classes', :style='progress_bar_styles')
            | {{ label_text }}
</template>

<script lang="coffee">
  import Vue from 'vue'

  export default Vue.component 'uploads-progress',
    data: ->
      uploads: @$select 'uploads'
    computed:
      label_text: ->
        if @is_active then "Uploading #{@uploads[0].name}" else null
      is_active: -> @uploads and @uploads.filter((u) -> u.progress != 100).length
      progress_bar_classes: ->
        'progress-bar-striped':  @is_active and not @uploads.progress
        'progress-bar-animated': @is_active and not @uploads.progress
      progress_bar_styles: ->
        width: if @is_active and @uploads[0].progress then "#{@uploads[0].progress}%" else "100%"
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

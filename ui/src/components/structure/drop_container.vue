<template lang="pug">
  .drop-container(@drop='handle_drop')
    span Drop Your Audio Here
</template>

<script lang="coffee">
  import UploadService from 'lib/upload_service'

  export default {
    name: 'drop-container'
    methods:
      handle_drop: (e) ->
        e.preventDefault()
        e.stopPropagation()
        if e.dataTransfer && e.dataTransfer.files
          UploadService.start e.dataTransfer.files
        @$emit 'dropfinished'
  }
</script>

<style lang="scss">
  .drop-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .4);
    z-index: 1000;
    color: #fff;
    border: 8px dashed #fff;

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2.4em;
    }
  }
</style>

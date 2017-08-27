<template lang="pug">
  .loading-container
    img(src='./loading-bars.svg', alt='Loading...')
    .caption Loading...
</template>

<script lang="coffee">
  import Vue from 'vue'
  import store from 'state/store'
  import find from 'lodash/find'
  import audio_api from 'api/audios'
  import audio_actions from 'state/actions/audios'
  import FlashEngine from 'lib/flash_engine'
  import moment from 'moment'

  export default Vue.component 'loading',
    data: -> {}
</script>

<style lang="scss">
  .loading-container {
    text-align: center;
    margin: 0 auto;
  }
</style>

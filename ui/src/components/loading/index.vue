<template lang="pug">
  .loading-container
    img(src='./loading-bars.svg', alt='Loading...')
    .caption Loading...
</template>

<script lang="coffee">
  import Vue from 'vue'

  export default Vue.component 'loading',
    data: -> {}
</script>

<style lang="scss">
  .loading-container {
    text-align: center;
    margin: 0 auto;
  }
</style>

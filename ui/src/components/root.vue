<template lang="pug">
  div
    toast-container
    router-view
</template>

<script lang="coffee">
  import Vue from 'vue'

  export default Vue.component 'root',
    data: -> {}
</script>

<style lang="scss">
  @import '~bootstrap/dist/css/bootstrap.css';
  @import '~font-awesome/scss/font-awesome.scss';
  @import 'src/styles/base';
</style>

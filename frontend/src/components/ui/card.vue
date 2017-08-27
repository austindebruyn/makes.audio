<template lang="pug">
  .card(:class='classes')
    slot
</template>

<script lang="coffee">
  import Vue from 'vue'

  export default Vue.component 'card',
    data: -> {}
    computed:
      classes: -> {}
</script>

<style lang="scss">
  .card {
    width: 100%;
    border: 0;
    display: inline-block;
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .card-login {
    max-width: 320px;
  }

  .card-plain {
    background: transparent;

    .header {
      margin-left: 0;
      margin-right: 0;
    }

    .content {
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>

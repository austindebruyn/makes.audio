<template lang="pug">
  .card
    slot
</template>

<script lang="coffee">
  import Vue from 'vue'

  export default {
    name: 'card'
  }
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .card {
    width: 100%;
    border: 0;
    display: inline-block;
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;

    border-radius: 0;
    background-color: $pink;
    color: white;

    .card-content {
      padding: 3rem 2rem;
    }
  }

  .card-plain {
    background: transparent;
    background: none;
    border: none;
    color: black;

    .header {
      margin-left: 0;
      margin-right: 0;
    }

    .content {
      padding-left: 0;
      padding-right: 0;
    }

    &.card-login {
      max-width: 320px;
      color: white;
    }
  }
</style>

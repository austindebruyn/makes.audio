<template lang="pug">
  app-template
    .nimbus-page
      .jumbotron
        h1 Nimbus
        p
          | A desktop app named Nimbus is on the way. The goal is to designate
          | an on-disk folder where you can place audio files to be
          | automatically uploaded to makes.audio.
        hr.my-3
        p
          | You can help speed things along by contributing to the GitHub repo
          | 
          a(href='https://github.com/austindebruyn/makes.audio') here
          | .
</template>

<script lang="coffee">
  import Vue from 'vue'
  import app_template from 'components/app_template'

  export default {
    name: 'the-nimbus-page'
    components:
      'app-template': app_template
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .nimbus-page {
    padding-top: 40px;
    padding-bottom: 40px;

    .jumbotron {
      border-radius: 0;
      background-color: $gray-light;
    }
  }
</style>

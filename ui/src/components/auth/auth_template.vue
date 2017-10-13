<template lang="pug">
  .landing-page
    .landing-page-image(:style='background_styles')
    .container.text-center
      slot
</template>

<script lang="coffee">
  import Vue from 'vue'

  export default {
    name: 'auth-template'
    data: ->
      background_styles:
        backgroundImage: "url(#{require './landing-page/hero-image@2k.jpg'})"
  }
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .landing-page {
    color: $white;

    &:before {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.5);
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      content: ' ';
      z-index: 0;
    }

    .container {
      height: 100%;
      z-index: 2;
      text-align: center;
    }

    .content-center {
      position: absolute;
      top: 50%;
      left: 50%;
      -ms-transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      text-align: center;
      color: $white;
      width: 100%;
      max-width: 880px;
    }

    .header .branding {
      width: 150px;
      padding-bottom: 40px;
    }

    .landing-page-image {
      position: absolute;
      background-size: cover;
      background-position: center center;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    .card-login form {
      input {
        max-width: none;
      }
    }
  }
</style>

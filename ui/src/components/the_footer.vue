<template lang="pug">
  footer.footer
    .container
      .row
        .col-12.col-md-6
          p Made with &#128266; in Sunnyvale, CA
        .col-12.col-md-6.text-md-right
          p makes.audio is an open source project.
          p
            a.link-with-icon(:href='github_url')
              span.fa.fa-github
              span Github
</template>

<script lang="coffee">
  import Vue from 'vue'

  export default {
    name: 'the-footer'
    computed:
      github_url: -> 'https://github.com/austindebruyn/makes.audio'
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .footer {
    background-color: $gray-light;
    color: $gray-dark;

    padding: 20px 0;

    .link-with-icon {
      text-decoration: underline;
      color: $gray-dark;

      .fa {
        margin-right: 0.4rem;
      }

      &:hover {
        color: $gray;
      }
    }
  }
</style>

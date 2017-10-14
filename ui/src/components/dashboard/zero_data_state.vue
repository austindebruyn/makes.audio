<template lang="pug">
  card.card-plain.dashboard-zero-data-state.text-center
    .striped-border-content
      span.fa.fa-file-audio-o.large-icon 
      h2 Nothing here
      p
        | You haven’t uploaded anything yet. Drag a file onto this page to
        | get started!

</template>

<script lang="coffee">
  import Vue from 'vue'
  import card from 'components/controls/card'

  export default {
    name: 'dashboard-zero-data-state'
    components:
      card: card
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .dashboard-zero-data-state {
    .striped-border-content {
      padding: 6rem 1rem;
      color: $gray;
      border: 3px $gray dashed;

      .large-icon {
        font-size: 48px;
        padding-bottom: 20px;
      }

      h2 {
        text-transform: uppercase;
        font-size: 1.6rem;
      }
    }
  }
</style>

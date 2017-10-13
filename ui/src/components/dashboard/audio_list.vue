<template lang="pug">
  ul.dashboard-audio-list
    dashboard-audio-list-item(
      v-for='audio in audios'
      :key='audio.id'
      :audio='audio'
      :q='q'
    )
</template>

<script lang="coffee">
  import Vue from 'vue'
  import list_item from 'components/dashboard/audio_list_item'

  export default {
    name: 'dashboard-audio-list'
    components:
      'dashboard-audio-list-item': list_item
    props:
      audios: Array
      q: String
  }
</script>

<style lang="scss">
  .dashboard-audio-list {
    list-style-type: none;
    padding: 0;

    & > li {
      margin-bottom: 1.5rem;

      &:last-child {
        margin: 0;
      }
    }
  }
</style>

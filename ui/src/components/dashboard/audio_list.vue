<template lang="pug">
  ul.dashboard-audio-list
    dashboard-audio-list-item(
      v-for='audio in sorted_audios'
      :key='audio.id'
      :audio='audio'
      :q='q'
    )
</template>

<script lang="coffee">
  import Vue from 'vue'
  import list_item from 'components/dashboard/audio_list_item'
  import stable from 'stable'

  # Comparator functions for sorting the list of audios inplace.
  # All comparators assume an ascending order, where the return value is
  # whether or not item `a` should be ranked before item `b`.
  # The items are audio models.
  COMPARATORS =
    filename: (a, b) -> a.url.localeCompare(b.url) >= 0
    date: (a, b) -> new Date(b.createdAt) <= new Date(a.createdAt)
    length: (a, b) -> a.duration >= b.duration

  export default {
    name: 'audio-list'
    components:
      'dashboard-audio-list-item': list_item
    props:
      audios: Array
      q: String
      sort:
        type: Object
        default: -> {}
    computed:
      sorted_audios: ->
        value = @audios.slice 0
        for key in ['filename', 'date', 'length']
          if @sort[key] is 'asc'
            stable.inplace value, COMPARATORS[key]
          else if @sort[key] is 'dsc'
            stable.inplace value, (a, b) -> !COMPARATORS[key](a, b)
        value
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

<template lang="pug">
  card
    .card-block
      p(v-for='line_item in line_items')
        strong {{ line_item.label }}&nbsp;
        span.text-muted {{ line_item.value }}
</template>

<script lang="coffee">
  import Vue from 'vue'
  import moment from 'moment'
  import card from 'components/controls/card'

  export default Vue.component 'edit-audio-stats-card',
    components:
      card: card
    props: [ 'audio' ]
    computed:
      line_items: ->
        [
          ( label: 'Originally named', value: @audio.originalName )
          ( label: 'Uploaded on', value: moment(@audio.createdAt).format('LLLL') )
          ( label: 'Size', value: @audio.formattedSize )
        ]
</script>

<style lang="scss">
</style>

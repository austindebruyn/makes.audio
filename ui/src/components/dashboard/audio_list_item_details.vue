<template lang="pug">
  .audio-list-item-details
    p(v-for='line_item in line_items')
      em {{ line_item.label }}&nbsp;
      span.text-muted {{ line_item.value }}
</template>

<script lang="coffee">
  import Vue from 'vue'
  import moment from 'moment'
  import card from 'components/controls/card'

  export default Vue.component 'edit-audio-stats-card',
    props: [ 'audio' ]
    computed:
      line_items: ->
        [
          ( label: 'Originally named', value: @audio.originalName )
          ( label: 'Uploaded on', value: moment(@audio.createdAt).format('LLLL') )
          ( label: 'Size', value: @audio.formattedSize )
        ]
</script>

<style lang="scss" scoped>
  .audio-list-item-details {
    padding: 1rem;

    // color: white;

    // .text-muted 
  }
</style>

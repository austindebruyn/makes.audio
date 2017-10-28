<template lang="pug">
  span.toggle-chevron.fa.fa-chevron-down(:style='styles')
</template>

<script lang="coffee">
  import Vue from 'vue'

  export default {
    name: 'toggle-chevron'
    props:
      open: Boolean
    data: ->
      angle: 0
    computed:
      target_angle: ->
        if @open then 180 else 0
      styles: ->
        transform: "rotate(#{@angle}deg)"
    watch: 
      open: ->
        @$tween angle: @target_angle, 100
  }
</script>

<style lang="scss" scoped>
</style>

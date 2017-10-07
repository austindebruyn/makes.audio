<template>
  <div id="flash-container">
    <flash
      v-for="val in flash"
      :key="val.id"
      :idx="val.idx"
      :level="val.level"
      :title="val.title"
      :message="val.message"
      :dismissable="val.dismissable"
      :dead="val.dead"
      @click="handle_dismiss_click(val.id)"
    />
  </div>
</template>

<script lang="coffee">
  import Vue from 'vue'
  import FlashEngine from 'lib/flash_engine'
  import find from 'lodash.find'
  import remove from 'lodash.remove'

  export default Vue.component 'flash-container',
    data: ->
      flash: FlashEngine.flashes.slice 0
    mounted: ->
      FlashEngine.$on 'create', @handle_create
      FlashEngine.$on 'dismiss', @handle_dismiss
    beforeDestroy: ->
      FlashEngine.$off 'create', @handle_create
      FlashEngine.$off 'dismiss', @handle_dismiss
    methods:
      handle_create: ->
        new_flashes = @flash.slice 0
        for flash in FlashEngine.flashes
          unless find(@flash, id: flash.id)
            new_flashes.unshift flash
        idx = 0
        new_flashes.forEach (flash) -> flash.idx = idx++ unless flash.dead
        @flash = new_flashes
      handle_dismiss: (removed) ->
        new_flashes = @flash.slice 0
        removed_flash = find(new_flashes, id: removed.id)
        if removed_flash
          removed_flash.dead = true
          setTimeout =>
            new_flashes = @flash.slice 0
            remove(new_flashes, id: removed.id)
            @flash = new_flashes
          , 200
          idx = 0
          @flash.forEach (flash) -> flash.idx = idx++ unless flash.dead
        @flash = new_flashes
      handle_dismiss_click: (id) -> FlashEngine.destroy id
</script>

<style lang="scss">
  @import 'src/styles/mixins';

  #flash-container {
    position: fixed;
    z-index: 1000;
    width: 100%;

    @include media-breakpoint-up(md) {
      top: 40px;
      right: 40px;
      width: 400px;
    }
  }
</style>

<template lang='pug'>
  #toast-container
    toast(
      v-for="val in toasts"
      :key="val.id"
      :idx="val.idx"
      :level="val.level"
      :title="val.title"
      :message="val.message"
      :dismissable="val.dismissable"
      :dead="val.dead"
      @click="handle_dismiss_click(val.id)"
    )
</template>

<script lang="coffee">
  import Vue from 'vue'
  import Toaster from 'lib/toaster'
  import find from 'lodash.find'
  import remove from 'lodash.remove'

  export default Vue.component 'toast-container',
    data: ->
      toasts: Toaster.all()
    mounted: ->
      Toaster.$on 'create', @handle_create
      Toaster.$on 'dismiss', @handle_dismiss
    beforeDestroy: ->
      Toaster.$off 'create', @handle_create
      Toaster.$off 'dismiss', @handle_dismiss
    methods:
      handle_create: ->
        new_toasts = @toasts.slice 0
        for toast in Toaster.all()
          unless find(@toasts, id: toast.id)
            new_toasts.unshift toast
        idx = 0
        new_toasts.forEach (toast) -> toast.idx = idx++ unless toast.dead
        @toasts = new_toasts
      handle_dismiss: (removed) ->
        new_toasts = @toasts.slice 0
        removed_toast = find(new_toasts, id: removed.id)
        if removed_toast
          removed_toast.dead = true
          setTimeout =>
            new_toasts = @toasts.slice 0
            remove(new_toasts, id: removed.id)
            @toast = new_toasts
          , 200
          idx = 0
          @toasts.forEach (toast) -> toast.idx = idx++ unless toast.dead
        @toasts = new_toasts
      handle_dismiss_click: (id) -> Toaster.destroy id
</script>

<style lang="scss">
  @import 'src/styles/mixins';

  #toast-container {
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

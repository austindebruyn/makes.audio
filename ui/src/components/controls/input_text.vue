<template lang="pug">
  .input-group(:class='classes')
    span.input-group-addon(v-if='icon')
      i.fa(:class='icon_class')
    input.form-control(
      :type='type || "text"'
      @focus='handle_focus'
      @blur='handle_blur'
      autocomplete='off'
      :name='name'
      :placeholder='placeholder'
      :disabled='disabled'
      :value='value'
    )
</template>

<script lang="coffee">
  export default {
    name: 'input-text'
    props:
      name: String
      placeholder: String
      disabled: Boolean
      type: String
      icon: String
      value: String
    data: ->
      focus: false
    computed:
      classes: ->
        'input-group-focus': @focus
      icon_class: ->
        "fa-#{@icon}"
    methods:
      handle_focus: -> @focus = true
      handle_blur: -> @focus = false
  }
</script>

<style lang="scss">
</style>

<template lang="pug">
  button.dashboard-sort-control(:class='classes', @click='handle_click')
    span.name {{ display_label }}
    span.value(v-if='value')
      | {{ display_value }}
      i.fa(:class='icon_classes')
</template>

<script lang="coffee">
  import Vue from 'vue'
  import one_of from 'lib/one_of'

  PROPERTIES =
    filename:
      label: 'Filename'
      values:
        asc: 'A to Z'
        dsc: 'Z to A'
    date:
      label: 'Date Uploaded'
      values:
        asc: 'Oldest first'
        dsc: 'Newest first'
    length:
      label: 'Length'
      values:
        asc: 'Shortest first'
        dsc: 'Longest first'

  export default {
    name: 'dashboard-sort-control'
    props:
      label: one_of Object.keys PROPERTIES
      value:
        type: String
    computed:
      classes: ->
        active: @value isnt null
      display_label: -> PROPERTIES[@label].label
      display_value: -> PROPERTIES[@label].values[@value]
      icon_classes: -> (asc: 'fa-chevron-down', dsc: 'fa-chevron-up')[@value]
    methods:
      handle_click: ->
        @$emit 'changed', @label, switch @value
          when 'asc' then 'dsc'
          when 'dsc' then null
          else 'asc'
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .dashboard-sort-control {
    display: flex;
    width: 100%;
    padding: 4px 8px;
    cursor: pointer;

    background: none;
    border: none;
    outline: none;

    font-family: tensoregular, serif;
    color: $gray-dark;

    .name {
      flex-grow: 9;
      text-align: left;
    }

    .value {
      text-align: right;

      .fa {
        margin-left: 5px;
      }
    }

    &.active {
      color: $black;

      .name {
        font-weight: bold;
      }
    }

    &:hover {
      background-color: $gray-faint;
    }
  }
</style>

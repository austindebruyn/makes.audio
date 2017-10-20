<template lang="pug">
  li.dashboard-audio-list-item
    .controls.pull-right
      a(:href='audio.downloadUrl', title='Download').icon-link
        span.fa.fa-download
      router-link(:to='audio.editUrl').icon-link
        span.fa.fa-pencil
    a.public-link(
      :title='public_link_title'
      :href='audio.publicUrl'
      target='_blank'
    )
      .basename
        text-with-search-highlight(:text='basename', :q='q')
      .extension
        text-with-search-highlight(:text='extension', :q='q')
    .description {{ display_description }}
    ul.meta
      li {{ uploaded_at }}
      li {{ length }}
</template>

<script lang="coffee">
  import Vue from 'vue'
  import moment from 'moment'
  import one_of from 'lib/one_of'
  import highlight from 'components/dashboard/text_with_search_highlight'

  export default {
    name: 'dashboard-audio-list-item'
    components:
      'text-with-search-highlight': highlight
    props:
      audio: Object
      q: String
    computed:
      public_link_title: -> "Open up #{@audio.url} in a new tab"
      uploaded_at: ->
        "Uploaded #{moment(@audio.createdAt).fromNow()}"
      display_description: ->
        @audio.description || 'no description'
      length: ->
        '4min 50sec'
      basename: ->
        @audio.url.split('.')[0]
      extension: ->
        '.' + @audio.url.split('.')[1]
  }
</script>

<style lang="scss">
  @import 'src/styles/colors';
  @import 'src/styles/mixins';

  .dashboard-audio-list-item {
    border-left: 4px solid $blue;
    padding: 1.2rem;
    font-family: 'arconregular';

    &:hover {
      cursor: pointer;
      background-color: $gray-light;
    }

    .public-link {
      color: $black;
      font-size: 1.5rem;
    }
    .name {
      font-size: 1.5rem;
    }
    .basename,
    .extension {
      display: inline-block;
    }
    .extension {
      color: $blue;
    }
    .description {
      font-style: italic;
      padding-bottom: 1.2rem;
    }

    ul.meta {
      list-style: none;
      padding: 0;
      font-size: 0.7rem;
      text-transform: uppercase;

      li {
        width: 250px;
        display: inline-block;
      }
    }
    .uploaded-at {
      text-transform: uppercase;
    }

    &:hover {
      .controls {
        display: block;
      }
    }

    .controls {
      display: none;

      a {
        font-size: 1.4rem;
        color: $gray-dark;
        margin-left: 20px;

        &:hover {
          color: $pink;
        }
      }
    }

    @include media-breakpoint-up(md) {
      .controls {

      }
    }
  }
</style>

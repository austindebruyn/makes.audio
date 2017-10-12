<template lang="pug">
  .loading-container
    img(src='./loading-bars.svg', alt='Loading...')
    .caption Loading...
</template>

<script lang="coffee">
  export default {
    name: 'loading'
  }
</script>

<style lang="scss" scoped>
  .loading-container {
    text-align: center;
    margin: 0 auto;
  }
</style>

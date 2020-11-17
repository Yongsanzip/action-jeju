<template>
  <div id="app">
      <div class="loading-overlay" v-if="$store.state.is_show_loading">
          <Circle2 size="80px" color="transparent" background="#00c7c9"></Circle2>
      </div>
      <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import {Circle2} from 'vue-loading-spinner'

export default {
    name: 'app',
    components: {
        Circle2
    },
    created() {
        this.$store.dispatch('SAVE_IS_SHOW_LOADING', false);
    },
}
</script>


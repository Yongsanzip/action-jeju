<template>
  <div id="app">
      <div class="loading-overlay" v-if="$store.state.is_show_loading">
          <Circle2 size="80px" color="transparent" background="#00c7c9"></Circle2>
      </div>
      <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import { etc } from "./api";
import {mapGetters} from 'vuex';
import { EventBus } from "./assets/event-bus";
import { Circle2 } from 'vue-loading-spinner'

export default {
    name: 'app',
    components: {
        Circle2
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods: {
        postGpsInfo(keyword){
            navigator.geolocation.getCurrentPosition((position) => {
                if(position != null && position.coords != null) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    const gpsPostData = new FormData();
                    gpsPostData.append('mb_id', this.GET_MB_ID);
                    gpsPostData.append('long', lng);
                    gpsPostData.append('lat', lat);
                    if(keyword != null) gpsPostData.append('keyword', keyword);

                    etc.gps_ins(gpsPostData).then(res => {
                        console.log(res);
                    });
                }
            });
        },
    },
    created() {
        this.$store.dispatch('SAVE_IS_SHOW_LOADING', false);

        EventBus.$off("insertGps");
        EventBus.$on("insertGps", (keyword) => {
            this.postGpsInfo(keyword);
        });
    },
}
</script>


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
            console.log("postGpsInfo::::", keyword, this.GET_MB_ID);
            if((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent) && window.android != null){ //현재기기가 모바일인지 체크
                const lat = window.android.myLocate('lat');
                const lng = window.android.myLocate(null);

                const gpsPostData = new FormData();
                gpsPostData.append('mb_id', this.GET_MB_ID);
                gpsPostData.append('long', lng);
                gpsPostData.append('lat', lat);
                if(keyword != null) gpsPostData.append('keyword', keyword);

                etc.gps_ins(gpsPostData).then(res => {
                    console.log(res);
                });
            }
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


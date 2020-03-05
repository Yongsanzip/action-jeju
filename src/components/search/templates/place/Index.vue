<template>
    <div class="place-card" @click="doView(data.company_idx)">
        <div>
            <p class="place-name">{{data.company_name}}</p>
            <p class="place-distance">2.5km</p>
            <div class="place-call">전화하기</div>
        </div>
        <div>
            <p class="place-score">{{data.star_point}}</p>
            <div class="star_area m-star">
                <span class="star_rating star">
                    <span :style="{width: `${(data.star_point*20)}%`}"></span>
                </span>
            </div>
            <p class="place-review">후기 {{data.reviews}}</p>
        </div>
        <div class="list-image">
            <div class="image" v-for="(image, idx) in data.company_img" :key="idx">
                <img :src="'http://img.actionjeju.com/data/company_image'+image">
            </div>
        </div>
    </div>
</template>
<script>
import { EventBus } from "@/assets/event-bus";
export default {
    name: 'PlaceList',
    props:['data'],
    data(){
      return {

      }
    },
    methods:{
        doView(idx){
            const path = `/map/${idx}`;
            if (this.$route.path !== path) this.$router.push(path).catch(err => {console.error(err)})
        },
        doScroll(){
            EventBus.$emit('scrollToTarget', this.$parent.$el)
        }
    },
    created() {
        EventBus.$on("PlaceList", (idx) => {
            console.log(1, idx);
            this.doScroll(idx);
        })
    }
}
</script>
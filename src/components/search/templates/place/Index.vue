<template>
    <div class="place-card" @click="doView($event, data.company_idx)" :class="'idx-'+data.company_idx">
        <div>
            <p class="place-name">{{data.company_name}}</p>
            <p class="place-distance">2.5km</p>
            <div class="place-call" @click.self="callToPlace(data.company_tel)">전화하기</div>
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
                <img :src="`${$store.state.place_img_route}/${image}`">
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'PlaceList',
    props:['data'],
    data(){
      return {

      }
    },
    methods:{
        doView(e, idx){
            if(e.target.className.indexOf("place-call") > -1) return false;

            this.$router.replace({path: this.$route.path, query: {type: 'place', idx: idx, text: document.querySelector("input[type=search]").value}});
            const path = `/map/${idx}`;
            if (this.$route.path !== path) this.$router.push(path).catch(err => {console.error(err)})
        },
        callToPlace(phoneNumb){
            if(phoneNumb == null){
                alert("전화번호가 등록되지 않은 업체입니다.")
            }
            location.href="tel:"+phoneNumb;
        }
    }
}
</script>
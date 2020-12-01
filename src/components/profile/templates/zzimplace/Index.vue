<template>
    <div class="card-place" @click="doPlace(data.company_idx)">
        <div style="display:inline">
            <p class="place-name">{{data.name}}</p>
            <p class="place-distance">2.5km</p>
            <div class="place-call" @click="call(data.tel)">전화하기</div>
        </div>
        <div>
            <p class="place-score">{{data.star}}</p>
            <div class="star_area m-star">
                <span class="star_rating star">
                    <span :style="{width: `${(data.star*20)}%`}"></span>
                </span>
            </div>
            <p class="place-review">후기 {{data.reviews}}</p>
        </div>
        <div class="favorite" @click.self="disZzim(data.company_idx, $event)">찜</div>
        <div class="list-image">
            <div class="image" v-for="(item, idx) in data.images" :key="idx">
                <img :src="`http://img.actionjeju.com/data/company_image${item}`" alt="">
            </div>
        </div>
    </div>
</template>
<script>

import {etc} from '@/api';
import {mapGetters} from 'vuex';

export default {
    name: 'LikePlace',
    props:['data'],
    data(){
        return {
            isClickPlace: true
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
        /*
        * doPlace
        * 장소 화면 이동
         */
        doPlace(idx){
            if(this.isClickPlace) this.$router.push(`/map/${idx}`);
            this.isClickPlace = true;
        },
        /*
        * call
        * 전화걸기
         */
        call(phoneNumb){
            this.isClickPlace = false;
            if(phoneNumb == null){
                this.$alert("전화번호가 등록되지 않은 업체입니다.")
            }
            location.href="tel:"+phoneNumb;
        },
        /*
        * disZzim
        * 찜 취소
         */
        disZzim(idx, e){
            this.isClickPlace = false;
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'place');
            postData.append('idx', idx);
            etc.Favorites(postData).then(res => {
                e.target.style.display = "none";
                console.log(res.data)
            }).catch(err => {
                console.error(err);
            })
        }
    }
}
</script>
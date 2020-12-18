<template>
    <div class="card">
        <div class="card-image" @click="doView(data.idx)">
            <img :src="`http://img.actionjeju.com/data/user_route_image${data.image}`" alt="">
        </div>
        <div class="favorite" @click.self="disZzim(data.idx, $event)">
            찜
        </div>
        <div class="card-contents" @click="doView(data.idx)">
            <div class="card-title">
                <p>{{data.name}}</p>
                <div class="like" v-if="data.user_like_point  != null && data.user_like_point > 999">999+</div>
                <div class="like" v-else>{{(data.user_like_point != null)? data.user_like_point : 0}}</div>
            </div>
            <div class="card-info">
                <p class="card-tern">{{data.days}}박 {{data.days+1}}일 여행</p>
                <p class="card-writer">{{data.nick}}</p>
            </div>
            <div class="list-hashtag" v-if="data.hashes != null && data.hashes.length > 0">
                <div class="hashtag" v-for="(hash, hashIdx) in data.hashes" :key="hashIdx">{{hash}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import {etc} from '@/api';
import {mapGetters} from 'vuex';

export default {
    name: 'LikeTravel',
    props:['data'],
    data(){
        return{
            hashList:[]
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods: {
        /*
        * doView
        * 선택한 여행경로 상세보기
         */
        doView(idx){
            this.$router.push(`/route/${idx}`)
        },
        /*
        * disZzim
        * 찜하기 취소
         */
        disZzim(idx, e){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'route');
            postData.append('idx', idx);
            etc.Favorites(postData).then(res => {
                e.target.style.display = 'none';
                console.log(res.data)
            }).catch(err => {
                console.error(err);
            })
        }
    },
    created() {
    }
}
</script>
<template>
    <div style="width: 100%;height: 100%;">
        <img :src="'http://img.actionjeju.com/data/user_route_after/'+data.image_name" @click="showDetailImgView(data.image_idx)"/>
        <div class="btn-favorite" @click="setPhotoLike(data.image_idx, $event)">찜</div>
    </div>
</template>
<script>
import {etc} from '@/api'
import {mapGetters} from 'vuex';
import { EventBus } from "@/assets/event-bus";

export default {
    name: 'PhotoLike',
    props:['data'],
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods: {
        setPhotoLike(idx, e){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'photo');
            postData.append('idx', idx);
            etc.like(postData).then(res => {
                if(res.data.isLike == "Y"){
                    e.target.classList.remove("disLike");
                }
                else{
                    if(e.target.classList.value.indexOf("disLike") < 0) e.target.classList.add("disLike");
                }
            }).catch(err => {
                console.error(err);
            })
        },
        showDetailImgView(idx){
            EventBus.$emit('MyProfile', idx);
        }
    }
}
</script>
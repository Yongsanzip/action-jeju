<template>
    <div class="route-card" :tour-idx="data.idx">
        <!-- card -->
        <transition name="fade">
        <div class="card">
            <div class="card-image" @click="doView(data.idx)">
                <img v-if="data.image == null || data.image == 'null'" src="../../../../assets/images/img-dummy.png" alt="">
                <img v-else :src="`http://img.actionjeju.com/data/user_route_image${data.image}`" alt="">
            </div>
            <div class="card-contents" @click="doView(data.idx)">
                <div class="card-title">
                    <p>{{data.name}}</p>
                    <div class="like" v-if="data.user_like_point  != null && data.user_like_point > 999">999+</div>
                    <div class="like" v-else>{{(data.user_like_point != null)? data.user_like_point : 0}}</div>
                </div>
                <div class="card-info">
                    <p class="card-tern">{{data.days-1}}박 {{data.days}}일 여행</p>
                    <p class="card-writer">{{data.nick}}</p>
                </div>
                <div class="list-hashtag">
                    <div class="hashtag">제주혼행</div>
                    <div class="hashtag">제주혼행</div>
                    <div class="hashtag">제주혼행</div>
                </div>
                <div class="more" @click.self="showMenu(true, data.idx)"></div>
            </div>
        </div>
        </transition>
        <!-- //card -->
        <!-- menu-->
        <transition name="fade">
            <div class="overlay" :style="(isShowMenu)? '' : 'display:none;'" @click.self="showMenu(false)">
<!--                -->
                <ul class="overlay-menu">
                    <li><a @click="modifyRout">이 여행경로 편집</a></li>
                    <li><a @click="removeRout">이 여행일정 삭제</a></li>
                    <li><a href="">SNS 공유하기</a></li>
                </ul>
            </div>
        </transition>
    </div>
</template>
<script>
import { Route } from "@/api";
import {mapGetters} from 'vuex';
import { EventBus } from "@/assets/event-bus";

export default {
    name: 'MyTravel',
    props:['data'],
    data(){
        return{
            selectedTourIdx: null,
            isShowMenu: false
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods: {
        doView(idx){
            if(this.isShowMenu) return;
            this.$router.push(`/route/${idx}`)
        },
        showMenu(flag, tourIdx){
            this.isShowMenu = flag;
            this.selectedTourIdx = tourIdx;
            if(flag){
                document.getElementsByClassName("container")[0].style['z-index'] = 999;
            }
            else{
                document.getElementsByClassName("container")[0].style['z-index'] = 1;
            }
        },
        modifyRout(){
            this.isShowMenu = false;
            console.log(this.selectedTourIdx);
            this.$router.push({
                name: 'RouteMake',
                params: {
                    'idx': Number(this.selectedTourIdx),
                    'isChk_flag': true
                }
            });
        },
        removeRout(){
            this.isShowMenu = false;

            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('tour_idx', this.selectedTourIdx);
            Route.deleteRoute(postData).then(res => {
                console.log(res.data);
                alert(res.data.resultMsg);
                EventBus.$emit('MyProfile', "myTravel");
                this.$forceUpdate();
            }).catch(err => {
                console.error(err);
            })
        }
    }
}
</script>
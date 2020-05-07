<template>
    <section class="wrap">
        <!--    <button v-if="$store.getters.getUser">로그아웃</button>-->
        <div class="section-wrap section-wrap__main">
            <div class="container" style="margin:0;">
                <!-- 상단 슬라이드 -->
                <div class="header-slide">
                    <swiper class="swiper-container__top" :options="topSwiperOption" ref="topSwiper">
                        <swiper-slide class="section__title"
                                      v-for="hash in hashList"
                                      :key="hash.name"
                        >
                            <form @submit.prevent="doEvent">
                                <input type="hidden" v-model="hash.name">
                                <span @click="doEvent(hash.name, 'route', true)">{{hash.name}}</span>
                            </form>
                        </swiper-slide>
                    </swiper>
                </div>
                <!--// 상단 슬라이드 -->
                <div class="route-main">
                    <swiper class="swiper-container" :options="routeSwiperOption">
                        <swiper-slide v-for="(item, idx) in routeList.slice(0,30)" :key="idx"
                        :style="{backgroundImage: `url(http://img.actionjeju.com/data/user_route_image${item.image}`}">
                            <div @click="doView(item.idx)">
                                <dl>
                                    <dt>{{item.name}}</dt>
                                    <dd></dd>
                                </dl>
                            </div>
                            <span>{{item.days}}박 {{item.days+1}}일 여행 · @{{item.nick}}</span>
                        </swiper-slide>
                    </swiper>
                </div>
                <div class="con-main mt25">
                    <div class="list-card">
                        <h2 class="section-title">제주 동부지역 1인 식당</h2>
                        <div class="card" v-for="(item, idx) in latestList" :key="idx">
                            <label class="btn-like">
<!--                                <input type="checkbox">-->
                                <input type="checkbox" :class="'photoLike_'+item.idx"
                                       :checked="false"
                                       @change="setRouteLike(idx, item.idx)">
                                <div class="shape"></div>
                            </label>
                            <div :style="{backgroundImage: `url(http://img.actionjeju.com/data/user_route_image/${item.image}`}"
                                 @click="doView(item.idx)"
                            >
                                <h3 class="card-title">{{item.name}}</h3>
                                <ul class="list-hashtag">
                                    <li>제주도민만 안다는 그 곳</li>
                                    <li>액션제주가 찾았어요!</li>
                                </ul>
                                <ul class="list-info">
                                    <li>{{item.days}}박 {{item.days+1}}일 여행</li>
                                    <li>{{item.nick}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import {etc, Route} from '@/api';
import { EventBus } from "../../assets/event-bus";
import {mapGetters} from 'vuex';

export default {
    name: 'RouteList',
    components: {
        swiper, swiperSlide
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    data(){
        return{
            hashList: [],
            routeList: [],
            latestList:[],
            topSwiperOption: {
                slidesPerView:'auto',
                slidesPerGroup:1,
                freeMode: true,
                loop:false,
                speed: 400,
            },
            routeSwiperOption:{
                slidesPerView:'auto',
                slidesPerGroup:1,
                spaceBetween:22,
                loop:false,
                speed: 400,
            }
        }
    },
    methods:{
        getHashList(){
            const postData = new FormData;
            postData.append('request_code', 'hashList');
            etc.fetchList(postData).then(res => {
                //console.log(res.data)
                this.hashList = res.data.hashes;
            }).catch(err => {
                console.error(err);
            })
        },
        //최신순 리스트
        getLatest() {
            const postData = new FormData;
            postData.append('type', 'latest');
            Route.routeList(postData).then(res => {
                //console.log(res.data)
                this.latestList = res.data.tours;
                this.touridx = this.latestList[0].idx;
            }).catch(err => {
                console.error(err);
            })
        },
        doEvent(hashName, type, isActive){
            EventBus.$emit("Index", hashName, type, isActive);
        },
        getRouteList() {
            const postData = new FormData;
            postData.append('type', 'hot');
            Route.routeList(postData).then(res => {
                //console.log(res.data)
                this.routeList = res.data.tours;
            }).catch(err => {
                console.error(err);
            })
        },
        doView(idx){
            this.$router.push(`/route/${idx}`)
        },
        setRouteLike(listIdx, tourIdx){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'route');
            postData.append('idx', tourIdx);
            etc.like(postData).then(res => {
                console.log(res.data)
            }).catch(err => {
                console.error(err);
            })
        }
    },
    created() {
        this.getHashList();
        this.getRouteList();
        this.getLatest();
    }
}
</script>
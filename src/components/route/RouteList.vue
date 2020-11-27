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
                <div class="con-main recommend-list mt25">
                    <div class="recommend-card-list">
                        <h2 class="section-title">이 달의 <b>추천경로</b></h2>
                        <swiper class="swiper-container" :options="recommendedRouteSwiperOption">
                            <swiper-slide
                                    v-for="(route, idx) in recommendedRouteList"
                                    :key="idx"
                                    :style="{backgroundImage: `url(http://img.actionjeju.com/data/user_route_image${route.image}`}"
                            >
                                <div @click="doView(route.idx)">
                                    <div class="title">{{route.name}}</div>
                                    <div>{{route.days-1}}박 {{route.days}}일 여행</div>
                                    <div class="place">
                                        <div>출발<span>{{route.max_company_name}}</span></div>
                                        <div>도착<span>{{route.min_company_name}}</span></div>
                                    </div>
                                </div>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>
                <div class="con-main mt25">
                    <div class="list-card">
                        <h2 class="section-title">{{themeRouteName}}</h2>
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
                                <ul class="list-hashtag" v-if="item.hashes != null && item.hashes.length > 0">
                                    <li v-for="(hash, hashIdx) in item.hashes.slice(0, 2)" :key="hashIdx">{{hash}}</li>
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
            recommendedRouteList: [],
            latestList:[],
            themeRouteName: null,
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
            },
            recommendedRouteSwiperOption:{
                slidesPerView:'auto',
                slidesPerGroup:1,
                spaceBetween:18,
                loop:false,
                speed: 400,
            }
        }
    },
    methods:{
        getRecommendedRouteList() {
            Route.recommendedList().then(res=>{
                if(res.data.recom_tours != null && res.data.recom_tours.length > 0) this.recommendedRouteList = res.data.recom_tours;
            })
        },
        /*
        * getThemeRouteList
        * 테마경로 제목 조회
        */
        getThemeRouteList(){
            const postData = new FormData;
            postData.append('request_code', 'themeRouteList');
            Route.themerouteList(postData).then(res => {
                // console.log(res.data)
                this.themeRouteName = res.data.themes.name;
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * getHashList
        * 해쉬태그 조회
         */
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
        /*
        * getLatest
        * 가장 최근 작성된 여행경로 조회
         */
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
        /*
        * doEvent
        * 해시태그 검색
         */
        doEvent(hashName, type, isActive){
            EventBus.$emit("Index", hashName, type, isActive);
        },
        /*
        * getRouteList
        * 여행경로 목록 조회
         */
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
        /*
        * doView
        * 여행경로 상세보기
         */
        doView(idx){
            this.$router.push(`/route/${idx}`)
        },
        /*
        * setRouteLike
        * 여행경로 좋아요
         */
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
        this.getThemeRouteList();
        this.getRecommendedRouteList();
        this.getRouteList();
        this.getLatest();
    }
}
</script>
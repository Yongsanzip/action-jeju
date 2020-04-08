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
                <div class="main-content">
                    <div class="content-box__top">
                        <swiper class="swiper-container__box" :options="boxSwiperOption" ref="boxSwiper">
                            <swiper-slide v-for="(item, index) in hotList" :key="index">
                                <div :style="{backgroundImage: `url(http://img.actionjeju.com/data/user_route_image${item.image}`}"></div>
                            </swiper-slide>
                            <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
                            <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
                        </swiper>
                    </div>
                    <div class="content-box__icon">
                        <div class="inner-box">
                            <div>
                                <ul>
                                    <li class="heart-ico"><span>{{tourInfo.user_like_count}}</span></li>
                                    <li class="like-ico"><span>{{tourInfo.zzim_count}}</span></li>
                                    <li class="re-ico"><span>{{tourInfo.reply_count}}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="content-box__bottom" @click="doView(touridx)">
                        <div class="title-box">
                            <span>{{tourInfo.days-1}}박 {{tourInfo.days}}일 여행</span>
                            <h2 class="dot">{{tourInfo.name}}</h2>
                            <p class="dot">
                                <a href="#">#제주도립미술관</a><a href="#">#저지문화예술인마을</a><a href="#">#제주현대미술관</a>
                            </p>
                        </div>
                        <div class="slide-box">
                            <swiper class="swiper-container" :options="listSwiperOption" ref="mySwiper">
                                <swiper-slide v-for="(item, idx) in tourDays" :key="idx">
                                    <img v-if="item.path != null && item.path.length > 0 && item.path[0].images != null && item.path[0].images.length > 0"
                                         :src="`http://img.actionjeju.com/data/user_route_after${item.path[0].images[0].name}`"
                                         alt="">
                                </swiper-slide>
                            </swiper>
                        </div>
                        <div class="nickname-area">
                            <span>@{{tourInfo.nick}}</span>
                        </div>
                    </div>
                </div>
                <div class="con-main mt25">
                    <div class="list-card">
                        <h2 class="section-title">제주 동부지역 1인 식당</h2>
                        <div class="card" v-for="(item, idx) in latestList.slice(0, 30)" :key="idx" @click="doView(item.idx)">
                            <div :style="{backgroundImage: `url(http://img.actionjeju.com/data/user_route_image/${item.image}`}">
                                <h3 class="card-title">{{item.name}}</h3>
                                <label class="btn-like">
                                    <input type="checkbox">
                                    <div class="shape"></div>
                                </label>
                                <ul class="list-hashtag">
                                    <li>제주도민만 안다는 그 곳</li>
                                    <li>액션제주가 찾았어요!</li>
                                </ul>
                                <ul class="list-info">
                                    <li>{{item.days-1}}박 {{item.days}}일 여행</li>
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
import 'swiper/dist/css/swiper.css'
import {etc, Route} from '@/api';
import { EventBus } from "../assets/event-bus";

export default {
    name: 'Main',
    components: {
        swiper, swiperSlide
    },
    data() {
        return {
            hashList: [],
            hotList:[],
            latestList: [],
            tourInfo: [],
            tourDays:[],
            touridx:0,
            topSwiperOption: {
                slidesPerView: 'auto',
                slidesPerGroup: 1,
                freeMode: true,
                loop: false,
                speed: 400,
            },
            boxSwiperOption: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                loop: false,
                speed: 500,
                autoplay: {
                    delay: 3000,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                on: {
                    init: function (){

                    },
                }
            },
            listSwiperOption:{
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween:7,
                loop: false,
                speed: 400,
            }
        }
    },
    computed: {
        swiper(){
            return this.$refs.mySwiper.swiper;
        }
    },
    methods: {
        getHashList() {
            const postData = new FormData;
            postData.append('request_code', 'hashList');
            etc.fetchList(postData).then(res => {
                //console.log(res.data)
                this.hashList = res.data.hashes;
            }).catch(err => {
                console.error(err);
            })
        },
        getHotList() {
            const postData = new FormData;
            postData.append('type', 'hot');
            Route.routeList(postData).then(res => {
                //console.log(res.data)
                this.hotList = res.data.tours;

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
                console.log(this.latestList)
                this.getLatestDetail();
            }).catch(err => {
                console.error(err);
            })
        },
        getLatestDetail() {
            const postData = new FormData;
            postData.append('tour_idx', this.touridx);
            Route.routeListDetail(postData).then(res => {
                //console.log(res.data)
                this.tourInfo = res.data.tourInfo;
                this.tourDays = res.data.days;
                console.log(res.data)
            }).catch(err => {
                console.error(err);
            })
        },
        doEvent(hashName, type, isActive) {
            EventBus.$emit("Index", hashName, type, isActive);
        },
        doView(idx) {
            this.$router.push(`/route/${idx}`)
        }
    },
    created() {
        this.getHashList();
        this.getHotList();
        this.getLatest();
    },
}

</script>


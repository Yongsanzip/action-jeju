<template>
    <section class="wrap">
        <!--    <button v-if="$store.getters.getUser">로그아웃</button>-->
        <div class="section-wrap section-wrap__main">
            <div class="container" style="margin:0;">
                <!-- 상단 슬라이드 -->
                <div class="header-slide">
                    <swiper class="swiper-container__top" :options="topSwiperOption">
                        <swiper-slide class="section__title"
                                      v-for="(hash, idx) in hashList"
                                      :key="idx"
                        >
                            <form>
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
                                <div :style="{backgroundImage: `url(${$store.state.user_img_route}${item.image}`}"></div>
<!--                                <img :src="`${$store.state.user_img_route}${item.image}`" style="width:100%; height: 100%;"/>-->
<!--                                <div :style="{backgroundImage: `url(${$store.state.user_img_route}${item.image}`}"></div>-->
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
                            <p class="dot" v-if="tourInfo.hashes">
                                <a href="#" v-for="(hash, hashIdx) in tourInfo.hashes" :key="hashIdx">#{{hash}}</a>
                            </p>
                        </div>
                        <div class="slide-box">
                            <swiper class="swiper-container" :options="listSwiperOption" ref="mySwiper">
                                <template v-for="(item, idx) in tourDays" >
                                    <swiper-slide v-for="(path, pathIdx) in item.path" :key="`${idx}_${pathIdx}`">
                                        <img :src="`${$store.state.user_after_route}${path.images[0].name}`"
                                             alt="">
                                    </swiper-slide>
                                </template>
                            </swiper>
                        </div>
                        <div class="nickname-area">
                            <span>@{{tourInfo.nick}}</span>
                        </div>
                    </div>
                </div>
                <div class="main-movie mt15 ">
                    <h2 class="section-title">오늘의 <b>제주</b></h2>
                    <swiper class="swiper-container" :options="movieSwiperOption">
                        <swiper-slide
                                v-for="(movie, idx) in movieList"
                                :key="idx"
                                :style="`background: url(${movie.movie_thumbnail}) no-repeat;`"
                        >
                            <div @click="showMovie(idx)">
                                <button class="play"></button>
                            </div>
                            <div class="title">{{movie.movie_hashtag}}</div>
                        </swiper-slide>
                    </swiper>
                </div>
                <div class="con-main mt15">
                    <div class="list-card">
                        <h2 class="section-title">{{themeRouteName}}</h2>
                        <div class="card" v-for="(item, idx) in latestList.slice(0, 30)" :key="idx" @click="doView(item.idx)">
                            <div :style="{backgroundImage: `url(${$store.state.user_img_route}/${item.image}`}">
                                <h3 class="card-title">{{item.name}}</h3>
                                <label class="btn-like">
                                    <input type="checkbox">
                                    <div class="shape"></div>
                                </label>
                                <ul class="list-hashtag" v-if="item.hashes != null && item.hashes.length > 0">
                                    <li v-for="(hash, hashIdx) in item.hashes.slice(0, 2)" :key="hashIdx">{{hash}}</li>
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
        <transition name="fade">
            <video-popup
                    v-if="isShowMovie"
                    :video="selectedMovie"
            ></video-popup>
        </transition>
    </section>
</template>

<script>
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import {etc, Route} from '@/api';
import { EventBus } from "../assets/event-bus";
import VideoPopup from "./popup/VideoPopup";

export default {
    name: 'Main',
    components: {
        swiper, swiperSlide, VideoPopup
    },
    data() {
        return {
            hashList: [],
            movieList: [],
            isShowMovie: false,
            selectedMovie: null,
            hotList:[],
            latestList: [],
            tourInfo: [],
            tourDays:[],
            themeRouteName: null,
            touridx:0,
            topSwiperOption: {
                slidesPerView: 'auto',
                slidesPerGroup: 1,
                freeMode: true,
                loop: false,
                speed: 400,
            },
            boxSwiperOption: {
                slidesPerView: 'auto',
                slidesPerGroup: 1,
                speed: 500,
                autoplay: {
                    delay: 3000,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            },
            listSwiperOption:{
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween:7,
                loop: false,
                speed: 400,
            },
            movieSwiperOption: {
                slidesPerView:'auto',
                slidesPerGroup:1,
                spaceBetween:6,
                loop:false,
                speed: 400,
            }
        }
    },
    methods: {
        /*
        * getMovieList
        * 메인 동영상 목록 조회
        */
        getMovieList() {
            Route.movieList().then(res=>{
                this.movieList = res.data.moviedata;
            })
        },
        showMovie(idx){
            if(this.movieList[idx] != null){
                this.selectedMovie = this.movieList[idx];
                this.isShowMovie = true;
            }
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
        * 해쉬태그 목록 조회
         */
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
        /*
        * getHotList
        * 상단 이미지 목록 조회
         */
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
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * getHomeRoute
        * 메인 여행경로 조회
         */
        getHomeRoute() {
            const postData = new FormData;
            postData.append('type', 'home');
            Route.routeList(postData).then(res => {
                if(res.data.tour_cnt < 1) return;
                this.touridx = res.data.tours[0].idx;
                this.$store.dispatch('SAVE_MAIN_TOUR_IDX', res.data.tours[0].idx);
                this.getHomeRouteDetail();
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * getHomeRouteDetail
        * 메인 여행경로 상세 조회
         */
        getHomeRouteDetail() {
            const postData = new FormData;
            postData.append('tour_idx', this.touridx);
            Route.routeListDetail(postData).then(res => {
                this.tourInfo = res.data.tourInfo;
                this.tourDays = res.data.days;
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * doEvent
        * 해시태그 검색
         */
        doEvent(hashName, type, isActive) {
            EventBus.$emit("Index", hashName, type, isActive);
        },
        /*
        * doView
        * 선택한 여행경로 상세보기 이동
         */
        doView(idx) {
            this.$router.push(`/route/${idx}`)
        }
    },
    created() {
        this.getHomeRoute();
        this.getMovieList();
        this.getThemeRouteList();
        this.getHashList();
        this.getHotList();
        this.getLatest();

        this.$on("close-modal", function(){
            this.isShowMovie = false;
        }.bind(this));
    },
    updated() {
        if(this.$store.state.scrollPosition != null) document.querySelector("html").scrollTo(this.$store.state.scrollPosition);
    }
}

</script>


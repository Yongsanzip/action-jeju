<template>
    <div class="wrap">
        <main :class="{'con-route': true, 'overflow-y' : isReply || isPhoto || isShowMenu || isShowSNSMenu}">
            <!-- class:sticky toggle -->
            <div v-if="!isReply" style="padding-bottom: 64px;">
                <div class="post-wrap" :class="{sticky : isSticky}">
                    <div class="post-header">
                        <div class="text-box">
                            <p class="post-title">{{tourInfo.name}}</p>
                            <p class="post-route-date">{{tourInfo.days-1}}박 {{tourInfo.days}}일 여행</p>
                        </div>
                        <button @click="onClickBtnBack" class="prev">이전</button>
                        <button class="btn-more" @click="isShowMenu=true">메뉴</button>
                    </div>
                    <div class="post-cover" v-if="!isSticky" :style="{backgroundImage: tourInfo.image != null? `url(http://img.actionjeju.com/data/user_route_image${tourInfo.image}` : ''}">
                        <div class="btn-map-block">
                            <button class="btn-map" @click="openMap">지도보기 <img src="../../assets/images/svg/ic-triangle-up-white.svg" alt=""></button>
                        </div>
                        <h2 class="post-title">{{tourInfo.name}}</h2>
                        <p class="post-date">{{tourInfo.days-1}}박 {{tourInfo.days}}일 여행</p>
                        <p class="post-write">{{tourInfo.nick}}</p>
                    </div>
                    <div class="route-map" v-if="isSticky" :style="{height: Math.floor(mapHeights[slideChk]) + 'px'}">
                        <naver-maps
                                :height="mapHeights[0]"
                                :width="mapWidth"
                                :map-options="mapOptions"
                                :initLayers="initLayers"
                                @load="onLoadMap"
                        >

                            <template v-for="(pathList, idx) in mapMarkList">
                                <naver-marker v-for="(path, pathIdx) in pathList" :otherOptions="path" :key="idx + '-' + pathIdx" :lat="path.lat" :lng="path.lng" @load="onMarkerLoaded">
                                </naver-marker>
                            </template>

                            <template v-for="(polyline, idx) in polylineList">
                                <naver-polyline :path="polyline" :tour-day="polylineOrder[idx]" :key="'polyline_'+idx" @load="onPolylineLoaded" />
                            </template>


                        </naver-maps>
                        <div class="slide-drawer" :class="slideChk" v-show="slideChk === 0" v-hammer:swipe="doSlide"></div>
                        <div class="slide-drawer" :class="slideChk" v-show="slideChk === 1" v-hammer:swipe="doSlide"></div>
                        <div class="slide-drawer" :class="slideChk" v-show="slideChk === 2" v-hammer:swipe="doSlide"></div>
                        <!-- //map -->
                    </div>
                </div>
                <div class="route-wrap">
                    <div class="route-contents">
                        <div class="hashtag-list" v-if="tourInfo.hashes != null && tourInfo.hashes.length > 0">
                            <div class="hashtag" v-for="(hash, hashIdx) in tourInfo.hashes" :key="hashIdx">#{{hash}}</div>
                        </div>
                        <!-- route item -->
                        <div class="route-item" v-for="(item, idx) in days" :key="idx">
                            <div class="travel-header">
                                <div class="travel-day noto-sans">D-{{item.day}}</div>
                                <p class="travel-title">여행 {{item.day}}일차</p>
                                <p class="travel-date noto-sans">{{item.date}}</p>
                            </div>
                            <ul class="travel-list">
                                <li v-for="(path, pathIdx) in item.path" :key="pathIdx">
                                    <div class="place-number noto-sans">{{pathIdx+1}}</div>
                                    <p class="place-name" @click="doViewPlace(path)">{{path.company_name}}</p>
                                    <p class="place-time">{{path.distance_data}} {{path.duration_data}}</p>
                                    <div class="travel-contents">
                                        <div class="review-text" @click="doViewAllReviewText($event, idx, pathIdx)">
                                            <p v-if="path.review != null">{{path.review}}</p>
                                        </div>
                                        <div class="review-image-list" v-show="path.images != null">
                                            <div class="review-image" v-for="(image, imgIdx) in path.images" :key="imgIdx" @click="showPhotoModal(image)">
    <!--                                            <img src="../../assets/images/img-dummy.png" alt="">-->
                                                <img :src="`http://img.actionjeju.com/data/user_route_after${image.name}`" alt="">
                                            </div>
                                        </div>
                                        <div class="hashtag-list" v-if="path.hashes != null && path.hashes.length > 0">
                                            <div class="hashtag" v-for="(hash, hashIdx) in path.hashes" :key="hashIdx">#{{hash}}</div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <!-- //route item -->
                        <ul class="post-menu-list">
                            <li>
                                <label class="btn-like">
                                    <input type="checkbox" :checked="isLike" @change="setLike">
                                    <div class="shape"></div>
                                </label>
                                <p v-if="tourInfo.user_like_count >= 999">999+</p>
                                <p v-else>{{tourInfo.user_like_count}}</p>
                            </li>
                            <li>
                                <label class="btn-favorite">
                                    <input type="checkbox" :checked="isFavorites" @change="setFavorites">
                                    <div class="shape"></div>
                                </label>
                                <p v-if="tourInfo.zzim_count >= 999">999+</p>
                                <p v-else>{{tourInfo.zzim_count}}</p>
                            </li>
                            <li>
                                <button type="button" class="btn-comment" @click="doReply"></button>
                                <p v-if="tourInfo.reply_count >= 999">999+</p>
                                <p v-else>{{tourInfo.reply_count}}</p>
                            </li>
<!--                            <li>-->
<!--                                <button class="btn-share" @click="showSNSMenu">공유</button>-->
<!--                                <p>공유하기</p>-->
<!--                            </li>-->
                        </ul>
                        <button @click="copyRoute" class="btn-get-route">경로 가져오기</button>
                    </div>
                </div>
                <div class="comment-wrap" v-if="tourInfo.reply_count > 0">
                    <div>
                        <p class="title">댓글 {{tourInfo.reply_count}}</p>
                        <a class="write-comment" @click="isReply=true">댓글쓰기</a>
                    </div>
                    <div class="comment-list">
                        <!-- card -->
                        <div class="comment-card" v-for="(item, idx) in replyList" :key="idx">
                            <div class="comment-profile">
                                <img src="../../assets/images/img-dummy.png" alt="">
                            </div>
                            <div class="comment-box">
                                <div>
                                    <p class="comment-name">{{item.mb_nick}}</p>
                                    <p class="comment-time">{{item.getReg}}</p>
                                    <button v-if="item.mb_id === GET_MB_ID" class="btn-more" @click="showReplyMenu(idx)">메뉴</button>
                                </div>
                                <div @click="doViewReply($event, idx)" style="white-space: nowrap;">
                                    <p class="comment-text">
                                        {{item.comment}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <!-- //card -->
                        <div class="overlay" :style="(isReplyMenu)? '' : 'display:none;'" @click.self="onClickReplyMenuOverlay">
                            <ul class="overlay-menu">
                                <li><a @click="editComment">댓글 수정하기</a></li>
                                <li><a @click="removeComment">댓글 삭제하기</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="comment-footer">
                        <a class="all-comment" @click="isReply=true">댓글 전체보기</a>
                    </div>

                </div>
                <div class="comment-wrap no-comment" v-else>
                    <div>
                        <p class="title">댓글이 없습니다</p>
                        <a class="write-comment" @click="isReply=true">댓글쓰기</a>
                    </div>
                </div>
                <div class="recommend-wrap" v-if="false">
                    <div>
                        <p class="title">이런 제주여행은 어떠세요?</p>
                        <a class="more" @click="$router.push('/route')">더보기</a>
                    </div>
                    <div class="card-list">
                        <!-- card -->
                        <div class="card" style="background-image: url('../../assets/images/img-dummy.png');">
                            <div class="card-text">
                                <p class="card-title">세상의 모든 초록빛, 제주 숲으로 안내합니다</p>
                                <ul class="hashtag-list">
                                    <li>사려니숲길</li>
                                    <li>힐링여행</li>
                                    <li>곶자왈도립공원</li>
                                </ul>
                            </div>
                            <label class="btn-like">
                                <input type="checkbox">
                                <div class="shape"></div>
                            </label>
                            <p class="card-writer">제주조아</p>
                            <p class="card-date">3박 4일 여행</p>
                            <a class="link" @click="$router.push('/route/11')"></a>
                        </div>
                        <!-- //card -->
                        <!-- card -->
                        <div class="card" style="background-image: url('../../assets/images/img-dummy.png');">
                            <div class="card-text">
                                <p class="card-title">세상의 모든 초록빛, 제주 숲으로 안내합니다</p>
                                <ul class="hashtag-list">
                                    <li>사려니숲길</li>
                                    <li>힐링여행</li>
                                    <li>곶자왈도립공원</li>
                                </ul>
                            </div>
                            <label class="btn-like">
                                <input type="checkbox">
                                <div class="shape"></div>
                            </label>
                            <p class="card-writer">제주조아</p>
                            <p class="card-date">3박 4일 여행</p>
                            <a class="link" @click="$router.push('/route/52')"></a>
                        </div>
                        <!-- //card -->
                    </div>
                </div>
                <div class="banner-ads" v-if="mainTourIdx === id">
                    <a v-for="(banner, idx) in banners" :key="idx" :href="banner.url.length > 0? banner.url : '#'" :target="banner.url.length > 0? '_blank' : ''">
                        <img :src="`http://img.actionjeju.com/data/banner${banner.name}`" alt="">
                    </a>
                </div>
            </div>
            <transition name="fade">
                <ReplyPopup v-if="isReply"
                            :tourIdx="id"
                            :tour-info="tourInfo"
                            :idx="replyIdx"
                            :highlight="showReplyCnt < 1 && replyIdx != null"
                            :editReply="selectedReply"
                />
                <modal-photo v-if="isPhoto"
                             :photo-list="imageList"
                             :idx="selectedPhotoIdx"
                             :hasListView="false"
                             :fullScreen="true"
                />
            </transition>
        </main>
        <div class="overlay" :style="(isShowMenu)? '' : 'display:none;'" @click.self="isShowMenu=false">
            <ul class="overlay-menu">
                <li v-show="isMine"><a @click="modifyRout">이 여행경로 편집</a></li>
                <li v-show="isMine"><a @click="removeRout">이 여행경로 삭제</a></li>
                <li v-show="!isMine"><a @click="setFavorites">이 여행경로 찜하기</a></li>
<!--                <li><a @click="showSNSMenu">SNS 공유하기</a></li>-->
            </ul>
        </div>
        <div class="overlay" :style="(isShowSNSMenu)? '' : 'display:none;'" @click.self="isShowSNSMenu=false">
            <ul class="overlay-menu sns">
                <li><a @click="shareLink('facebook')" class="facebook">페이스북</a></li>
<!--                <li><a @click="shareLink('instagram')" class="instagram">인스타그램</a></li>-->
                <li><a @click="shareLink('naver')" class="naver">네이버블로그</a></li>
                <li><a @click="shareLink('kakao')" class="kakao">카카오톡</a></li>
                <li><a @click="copyLink" class="copy">링크복사</a></li>
            </ul>
        </div>
    </div>
</template>
<script>
import {Route, etc} from '@/api';
import {mapGetters} from 'vuex';
import { EventBus } from "../../assets/event-bus";
import ReplyPopup from "../popup/ReplyPopup";
import ModalPhoto from "../popup/PhotoPopup";

export default {
    name:'RouteView',
    components:{
        ReplyPopup, ModalPhoto
    },
    props: {
        id: {
            type: String,
            default: null
        },
        reviewLines: {
            type: Number,
            default: 2
        },
        commentLines: {
            type: Number,
            default: 3
        },
        showReply: {
            type: Boolean,
            default: false
        },
        replyIdx: {
            type: String,
            default: null
        }
    },
    data(){
      return{
          mainTourIdx: null,
          banners: [],
          showReplyCnt: 0,
          mapWidth: 400,
          mapHeight: 159,
          mapHeights: [159, 370, 547],
          slideChk: 0,
          tourInfo:[],
          days:[],
          isSticky: false,
          isMine: false,
          isLike: false,
          isFavorites: false,
          isPhoto: false,
          imageList: [],
          isReply:false,
          replyList:[],
          isReplyMenu: false,
          selectedReply: null,
          isShowMenu:false,
          isShowSNSMenu: false,
          mapMarkList: [],
          polyLineList: [],
          info: false,
          map: null,
          mapOptions: {
              lat: 33.3811822578,
              lng: 126.5585367973,
              zoom: 9,
              zoomControl: false,
              scaleControl: false,
              logoControl: true,
              logoControlOptions: {
                  position: -10
              },
              mapTypeControl: false,
              mapDataControl: false
          },
          polylineList: [],
          polylineOrder: [],
          initLayers: ['BACKGROUND', 'BACKGROUND_DETAIL', 'POI_KOREAN', 'TRANSIT', 'ENGLISH', 'CHINESE', 'JAPANESE']
      }
    },
    // metaInfo() {
    //     return {
    //         meta: [
    //             //OpenGraph
    //             {property: 'og:site_name', content: '액션제주'},
    //             {property: 'og:type', content: 'website'},
    //             {property: 'og:title', content: this.tourInfo.name},
    //             {name: 'keywords', content: "액션제주"},
    //             {property: 'og:url', content: "m.actionjeju.com"},
    //             {property: 'og:image', content: 'http://img.actionjeju.com/data/user_route_image'+this.tourInfo.image},
    //             {property: 'og:image:width', content: "800"},
    //             {property: 'og:image:height', content: "400"},
    //         ]
    //     }
    // },
    computed: {
        ...mapGetters(['GET_MB_ID', 'GET_MAIN_TOUR_IDX']),
    },
    methods:{
        onClickReplyMenuOverlay() {
            this.isReplyMenu=false;
            this.selectedReply=null;
        },
        onClickBtnBack() {
            if(window.history.length < 2) {
                this.$router.push("/");
            }
            else {
                this.$router.go(-1);
            }
        },
        setMapSetting() {
            this.mapWidth = window.innerWidth;
            this.mapHeight = this.mapHeights[this.slideChk];
            if(this.map != null){
                this.map.setSize({width: this.mapWidth, height: this.mapHeight});
            }
        },
        /*
        * doSlide
        * 지도 크기 조절
         */
        doSlide(e){
            if(e.angle > 0){
                //down
                this.slidedown();
            }
            else{
                //up
                this.slideUp();
            }
        },
        /*
        * slideUp
        * 지도 크기 작게
         */
        slideUp(){
            if(this.slideChk <= 0) return true;
            this.slideChk = this.slideChk - 1;
            this.setMapSetting();
        },
        /*
        * slidedown
        * 지도 크기 크게
         */
        slidedown(){
            if(this.slideChk > 1) return true;
            this.slideChk = this.slideChk + 1;
            this.setMapSetting();
        },
        setMetaTags(property, content) {
            var meta = document.createElement('meta');
            meta.setAttribute('property', property);
            meta.setAttribute('content', content);
            document.getElementsByTagName('head')[0].appendChild(meta);
        },
        /*
        * getRouteList
        * 여행경로 상세정보 조회
         */
        async getRouteList() {
            const postData = new FormData;
            postData.append('tour_idx', this.id);
            if(this.GET_MB_ID != null) postData.append('mb_id', this.GET_MB_ID);
            await Route.routeListDetail(postData).then(res => {
                this.tourInfo = res.data.tourInfo;

                const tourDate = new Date(res.data.tourInfo.sdate);
                let i = 0;
                while (i < res.data.tourInfo.days){
                    this.days[i] = {
                        date: this.$moment(new Date(tourDate)).format('YYYY-MM-DD'),
                        day: i+1,
                        idx: null,
                        path: []
                    };
                    tourDate.setDate(tourDate.getDate() + 1);
                    i++;
                }
                if(res.data.days != null){
                    res.data.days.forEach(function(day) {
                        const idx = this.days.findIndex((d) => d.date === day.date);
                        if(idx > -1){
                            this.days[idx].date = day.date;
                            this.days[idx].idx = day.idx;
                            this.days[idx].path = day.path;
                        }
                    }.bind(this));
                }

                this.isMine = this.GET_MB_ID === this.tourInfo.mb_id;
                this.setImageList();

                if(this.showReply && this.showReplyCnt < 1){
                    this.doReply();
                }
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * setImageList
        * 여행경로 장소 후기 이미지 목록 셋팅
         */
        setImageList(){
            this.imageList = [];
            if(this.days == null) return;
            this.days.forEach(function(day){
                if(day.path == null || day.path.length < 1) return;
                day.path.forEach(function(path){
                    // console.log(path.images);
                    if(path.images == null || path.images.length < 1) return;
                    path.images.forEach(function(item){
                        this.imageList.push({
                            ...item,
                            checked: item.like_yn === 'Y'
                        });
                    }.bind(this))
                }.bind(this));
            }.bind(this));
        },
        /*
        * getBannerAds
        * 광고 배너 조회
         */
        getBannerAds() {
            Route.bannerAds().then(res => {
                if(res.data.resultCode === "1000" && res.data.banner2 != null  && res.data.banner2.length > 0) {
                    this.banners = res.data.banner2;
                    // this.setBannerRolling();
                }
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * showPhotoModal
        * 이미지 선택 시 해당 이미지 크게보기
         */
        showPhotoModal(imgData){
            this.selectedPhotoIdx = this.imageList.findIndex(function(img){ return img.idx === imgData.idx; });
            if(this.GET_MB_ID != null){
                const postData = new FormData;
                postData.append('mb_id', this.GET_MB_ID);
                postData.append('action', 'get');
                postData.append('type', 'route');
                postData.append('idx', imgData.idx);
                etc.like(postData);
            }

            //show photo modal
            this.isPhoto = true;
        },
        /*
        * doViewPlace
        * 장소명 선택 시 장소 화면 이동
         */
        doViewPlace(path){
            this.$router.push('/map/'+path.company_idx).catch(err => {console.error(err)})
        },
        /*
        * doViewAllReviewText
        * 장소 후기 더보기 버튼 선택. 전체 후기 텍스트 표시
         */
        doViewAllReviewText(e, daysIdx, pathIdx){
            if(e.target.className.indexOf('has-overflow') >= 0){
                const textEl = e.target.getElementsByTagName("p")[0];
                textEl.innerHTML = this.days[daysIdx].path[pathIdx].review;
                textEl.style.height = "auto";
                textEl.style.display = "block";
                e.target.classList.remove("overflow2lines")
            }
        },
        /*
        * openMap
        * 지도보기 버튼 선택
         */
        openMap(){
            this.mapWidth = document.body.offsetWidth;
            this.isSticky = true;
            this.slideChk = 0;
        },
        /*
        * onLoadMap
        * 네이버 지도 컴포넌트 로드 완료 시 마커 표시
         */
        onLoadMap(vue){
            this.map = vue;
           if(this.days != null) this.drawMapMarker();
        },
        /*
        * drawMapMarker
        * 여행 일정 별 장소 정보와 이동 동선 정보를 얻어 마커 표시 및 폴리라인 조회 위한 데이터 준비
         */
        drawMapMarker(){
            let polylineData = {};
            this.days.forEach(function(day, dayIdx){
                let markerList = [];
                if(day.path == null){
                    // console.log("no path in "+day.date);
                }
                else{
                    day.path.forEach(function(path, pathIdx){
                        polylineData.tour_day = dayIdx;
                        markerList.push({
                            day: dayIdx + 1,
                            title: pathIdx,
                            lat: Number(path.lat),
                            lng: Number(path.long)
                        });

                        if(dayIdx > 0 && pathIdx === 0){
                            polylineData.start = polylineData.end;
                            polylineData.end = {
                                'lat': path.lat,
                                'lng': path.long
                            };
                            this.getPolyLine(polylineData);
                        }
                        if(pathIdx > 0){
                            polylineData.start = {
                                'lat': day.path[pathIdx-1].lat,
                                'lng': day.path[pathIdx-1].long
                            };
                            polylineData.end = {
                                'lat': path.lat,
                                'lng': path.long
                            };
                            this.getPolyLine(polylineData);
                        }
                        else if(pathIdx === day.path.length - 1){
                            polylineData.end = {
                                'lat': path.lat,
                                'lng': path.long
                            };
                        }
                    }.bind(this));
                }

                this.mapMarkList.push(markerList);
            }.bind(this));
        },
        /*
        * getPolyLine
        * 폴리라인 목록 조회
         */
        getPolyLine(data){
            const postData = new FormData;
            postData.append('tour_day', data.tour_day);
            postData.append('s_lat', data.start.lat);
            postData.append('s_lon', data.start.lng);
            postData.append('e_lat', data.end.lat);
            postData.append('e_lon', data.end.lng);
            Route.routeDrivePath(postData).then(res => {
                const points = res.data.points;
                points.forEach(function(point){
                    point.lng = point.lon;
                });
                this.polylineList.push(points);
                this.polylineOrder[this.polylineList.length-1] = postData.get("tour_day");
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * onMarkerLoaded
        * 이동 장소 별 마커 로드 완료 시 해당 장소의 여행일, 동선 순서 순으로 마커 이미지 표시
         */
        onMarkerLoaded(marker){
            const markerIcon = document.createElement('div');
            markerIcon.classList.add('markerContent');
            markerIcon.title = marker.otherOptions.day+"일차";
            const routeMarker = document.createElement('div');
            routeMarker.classList.add('routeMarker');
            routeMarker.classList.add('day'+ (marker.otherOptions.day%10 === 0? 10 : marker.otherOptions.day%10));
            markerIcon.appendChild( routeMarker );

            const routeMarkerTitle = document.createElement('div');
            routeMarkerTitle.classList.add('order_number');
            routeMarkerTitle.innerText = marker.otherOptions.title+1;
            routeMarker.appendChild( routeMarkerTitle );

            marker.setIcon({
                content: markerIcon
            });
            marker.setCursor('');
        },
        /*
        * onPolylineLoaded
        * 폴리라인 로드 완료 시 여행일자 별 색상 표시
         */
        onPolylineLoaded(polyline){
            const tourDay = Number(polyline.$el.getAttribute("tour-day")) % 3;
            let strokeColor = '#00c7c9';
            switch (tourDay) {
                case 1:
                    strokeColor = '#5899fb';
                    break;
                case 2:
                    strokeColor = '#f3645a';
                    break;
                default:
                    strokeColor = '#00c7c9';
                    break;
            }
            polyline.setOptions({
                strokeWeight: '3',
                strokeColor: strokeColor
            });
            polyline.map = this.map;
        },
        /*
        * getLike
        * 해당 여행경로 좋아요 여부 조회
         */
        getLike(){
            const postData = new FormData;
            if(this.GET_MB_ID != null){
                postData.append('mb_id', this.GET_MB_ID);
                postData.append('action', 'get');
                postData.append('type', 'route');
                postData.append('idx', this.id);
                etc.like(postData).then(res => {
                    res.data.isLike === 'N' ? this.isLike = false : this.isLike = true
                }).catch(err => {
                    console.error(err);
                })
            }
        },
        requireAuth() {
            if(this.GET_MB_ID == null || this.GET_MB_ID === '') {
                this.$confirm("로그인이 필요한 기능입니다. 로그인을 하시겠습니까?").then(()=> {
                    this.$router.push("/")
                }).catch(()=> {
                    //cancel
                })
            }
        },
        /*
        * setLike
        * 해당 여행경로 좋아요 설정
         */
        setLike(){
            const postData = new FormData;
            if(this.GET_MB_ID != null) {
                postData.append('mb_id', this.GET_MB_ID);
                postData.append('action', 'set');
                postData.append('type', 'route');
                postData.append('idx', this.id);
                etc.like(postData).then(res => {
                    // console.log(res.data)
                    res.data.isLike === 'N' ? this.tourInfo.user_like_count-- : this.tourInfo.user_like_count++
                }).catch(err => {
                    console.error(err);
                })
            }
            else {
                this.isLike = false;
                const checkbox = this.$el.querySelector(".btn-like input");
                checkbox.style.display = 'block';
                checkbox.checked = false;
                checkbox.style.display = 'none';
            }
        },
        /*
        * getFavorites
        * 해당 여행경로 찜하기 여부 조회
         */
        getFavorites(){
            const postData = new FormData;
            if(this.GET_MB_ID != null){
                postData.append('mb_id', this.GET_MB_ID);
                postData.append('action', 'get');
                postData.append('type', 'route');
                postData.append('idx', this.id);
                etc.Favorites(postData).then(res => {
                    //console.log(res.data)
                    res.data.isZzim === 'N' ? this.isFavorites = false : this.isFavorites = true
                }).catch(err => {
                    console.error(err);
                })
            }
        },
        /*
        * setFavorites
        * 해당 여행경로 찜하기 설정
         */
        setFavorites(){
            if(this.isShowMenu) this.isShowMenu=false;

            if(this.GET_MB_ID != null) {
                const postData = new FormData;
                postData.append('mb_id', this.GET_MB_ID);
                postData.append('action', 'set');
                postData.append('type', 'route');
                postData.append('idx', this.id);
                etc.Favorites(postData).then(res => {
                    //console.log(res.data)
                    if(res.data.isZzim === 'N'){
                        this.tourInfo.zzim_count--;
                        this.isFavorites = false
                    }
                    else {
                        this.tourInfo.zzim_count++;
                        this.isFavorites = true
                    }
                }).catch(err => {
                    console.error(err);
                })
            }
            else {
                this.isFavorites = false;
                const checkbox = this.$el.querySelector(".btn-favorite input");
                checkbox.style.display = 'block';
                checkbox.checked = false;
                checkbox.style.display = 'none';
                this.requireAuth();
            }
        },
        showSNSMenu(){
            this.isShowMenu = false;
            this.isShowSNSMenu = true;
        },
        /*
        * getReplyList
        * 댓글 목록 조회. 최대 3개까지 화면에 표시
         */
        getReplyList() {
            const postData = new FormData;
            postData.append('tour_idx', this.id);
            Route.replyList(postData).then(res => {
                //console.log(res.data)
                if(res.data.replyList == null) return;

                if(res.data.replyList.length > 3){
                    const cnt = res.data.replyList.length-1;
                    this.replyList = [];
                    for(let i = cnt; i > cnt-3; i--){
                        this.replyList.push(res.data.replyList[i]);
                    }
                }
                else{
                    this.replyList = res.data.replyList;
                }

                this.replyList.forEach(function(item){
                    item.getReg = this.$moment(item.regdt, ["YYYY-MM-DD h:mm:ss"]).fromNow();
                }.bind(this));

            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * doReply
        * 댓글 팝업 표시
         */
        doReply(){
            this.isReply = true;
        },
        /*
        * showReplyMenu
        * 댓글 메뉴 버튼 선택
         */
        showReplyMenu(idx){
            this.isReplyMenu = true;
            this.selectedReply = this.replyList[idx];
        },
        /*
        * editComment
        * 댓글 수정
         */
        editComment(){
            //기획 미완
            this.doReply();
        },
        /*
        * removeComment
        * 댓글 삭제
         */
        removeComment(){
            this.isReplyMenu=false;
            if(this.GET_MB_ID != null) {
                this.$confirm("댓글을 삭제하시겠습니까?").then(result=> {
                    if(!result) return;

                    const postData = new FormData;
                    postData.append('mb_id', this.GET_MB_ID);
                    postData.append('commentidx', this.selectedReply.idx);
                    Route.deleteReply(postData).then(res => {
                        console.log(res.data);
                        this.comment = null;
                        this.replyIdx = null;
                        this.selectedReply = null;
                        this.getReplyList();
                    }).catch(err => {
                        console.error(err);
                    })
                }).catch(error => {
                    console.log(error);
                });
            }
            else {
                this.requireAuth();
            }
        },
        /*
        * doViewReply
        * 댓글 더보기 버튼 선택
         */
        doViewReply(e, idx){
            if(e.target.className.indexOf("overflow3lines") >= 0){
                const textEl = e.target.getElementsByTagName("p")[0];
                textEl.innerHTML = this.replyList[idx].comment;
                textEl.style.height = "auto";
                textEl.style.display = "block";
                e.target.classList.remove("overflow3lines")
            }
        },
        /*
        * copyRoute
        * 경로 가져오기 버튼 선택. 해당 여행경로의 일정을 복사해 로그인한 사용자의 새로운 여행경로 저장
         */
        copyRoute(){
            if(this.GET_MB_ID != null) {
                const postData = new FormData();
                postData.append('mb_id', this.GET_MB_ID);
                postData.append('tourname', this.tourInfo.name);
                postData.append('tourimg', null);
                postData.append('adult_cnt', Number(this.tourInfo.adult_cnt));
                postData.append('kids_cnt', Number(this.tourInfo.kids_cnt));
                postData.append('sdate', this.days[0].date);
                postData.append('edate', this.days[this.days.length - 1].date);

                Route.saveRoute(postData).then(res => {
                    // console.log(res.data);
                    this.touridx = Number(res.data.touridx);

                    const postData = new FormData();
                    postData.append('mb_id', this.GET_MB_ID);
                    postData.append('touridx', this.touridx);

                    let detailArr = [];
                    this.days.forEach(function(dateItem){
                        if(dateItem.path != null && dateItem.path.length > 0){
                            dateItem.path.forEach(function(location){
                                detailArr.push(dateItem.date + "/" + location.company_idx);
                            })
                        }
                    }.bind(this));

                    postData.append('details', detailArr.join("&"));

                    Route.saveRouteDetail(postData).then(res => {
                        console.log(res.data);
                        this.$router.push({
                            name: 'RouteMake',
                            params: {
                                'idx': Number(this.touridx),
                                'isChk_flag': false
                            }
                        });
                    }).catch(err => {
                        console.error(err);
                    })
                }).catch(err => {
                    console.error(err);
                })
            }
            else {
                this.requireAuth();
            }
        },
        /*
        * modifyRout
        * 여행경로 편집
         */
        modifyRout(){
            this.isShowMenu=false;

            if(this.GET_MB_ID != null) {
                this.$router.push({
                    name: 'RouteMake',
                    params: {
                        'idx': Number(this.id),
                        'isChk_flag': true
                    }
                });
            }
            else {
                this.requireAuth();
            }
        },
        /*
        * removeRout
        * 여행경로 삭제
         */
        removeRout(){
            this.isShowMenu=false;

            if(this.GET_MB_ID != null) {
                const postData = new FormData;
                postData.append('mb_id', this.GET_MB_ID);
                postData.append('tour_idx', this.id);
                Route.deleteRoute(postData).then(res => {
                    console.log(res.data);
                    history.back();
                }).catch(err => {
                    console.error(err);
                })
            }
            else {
                this.requireAuth();
            }
        },
        setReviewTextOverflow(){
            const reviewTextBox = document.getElementsByClassName("review-text");
            let reviewTextEl = null;
            if(reviewTextBox.length >= 0){
                reviewTextBox.forEach(function(boxEl){
                    let boxWidth = boxEl.parentElement.parentElement.offsetWidth - 30;
                    reviewTextEl = boxEl.getElementsByTagName("p")[0];
                    if(reviewTextEl == null) return true;

                    if (reviewTextEl.scrollWidth > boxWidth * this.reviewLines){
                        while (reviewTextEl.scrollWidth > boxWidth * this.reviewLines - 70) {
                            reviewTextEl.innerHTML = reviewTextEl.innerHTML.slice(0, -1);
                            this.$forceUpdate();
                        }

                        boxEl.classList.add("overflow2lines");
                        boxEl.classList.add("has-overflow");
                    }
                    else if (reviewTextEl.scrollWidth > boxWidth || reviewTextEl.scrollWidth > boxWidth * this.reviewLines - 70){
                        boxEl.classList.add("has-overflow");
                    }
                }.bind(this))
            }

            const commentTextEl = document.getElementsByClassName("comment-text");
            if(commentTextEl.length < 1) return;
            commentTextEl.forEach(function(el){
                if (el.scrollWidth > el.offsetWidth * this.commentLines){
                    while (el.scrollWidth > el.offsetWidth * this.commentLines - 70) {
                        el.innerHTML = el.innerHTML.slice(0, -1);
                    }
                    el.parentElement.classList.add("overflow3lines");
                }
                if (el.scrollWidth > el.offsetWidth) el.parentElement.classList.add("has-overflow");
            }.bind(this));
        },
        shareLink(snsCode){
            let cUrl;
            let url = encodeURIComponent(document.location.href);
            let title = this.tourInfo.name;
            let imgUrl = `http://img.actionjeju.com/data/user_route_image${this.tourInfo.image}`;
            let likeCount = this.tourInfo.user_like_count;
            let commentCount = this.tourInfo.reply_count;

            switch(snsCode){
                case "naver":
                    //2020.12.08
                    //경로상세페이지 링크 접근 시 404 오류 발생으로 인한 링크카드 생성 불가 이슈 발생
                    //링크 복사 기능으로 대체
                    this.copyLink();
                    // cUrl = "http://blog.naver.com/openapi/share?url=" + encodeURI(url) + "&title=" + encodeURI(title);
                    break;
                case"facebook":
                    //페이스북
                    cUrl = 'http://www.facebook.com/sharer/sharer.php?u='+url+'&t='+encodeURIComponent(title);
                    break;
                case"kakao":
                    //카카오톡
                    window.Kakao.Link.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: title,
                            imageUrl: imgUrl,
                            link: {
                                mobileWebUrl: document.location.href,
                                webUrl: document.location.href,
                            },
                        },
                        social: {
                            likeCount: Number(likeCount),
                            commentCount: Number(commentCount),
                        }
                    });
                    break;
                case"instagram":
                    //인스타그램
                    // cUrl = 'https://story.kakao.com/share?url='+cUrl;
                    break;
            }

            this.isShowSNSMenu = false;
            if(cUrl != null) window.open(cUrl);
        },
        copyLink() {
            var tempElem = document.createElement('textarea');
            tempElem.value = document.location.href;
            document.body.appendChild(tempElem);

            tempElem.select();
            document.execCommand("copy");
            document.body.removeChild(tempElem);

            this.$alert("링크가 복사되었습니다.");
            this.isShowSNSMenu = false;
        }
    },
    created() {
        document.getElementById('app').scrollIntoView();

        this.mainTourIdx = this.GET_MAIN_TOUR_IDX;

        this.mapHeights = [159, window.outerHeight*0.5, window.outerHeight*0.8];
        this.setMapSetting();
        window.addEventListener("resize", this.setMapSetting);

        this.getRouteList();
        this.getBannerAds();
        this.getLike();
        this.getFavorites();
        this.getReplyList();
        EventBus.$on("RouteView", props => {
            this.isPhoto = props;
            this.isReply = props;
            this.isReplyMenu = false;
            this.selectedReply = null;
            this.showReplyCnt++;
            this.getRouteList();
            this.getReplyList();
        });
        this.$on("close-modal", function(){
            this.isPhoto = false;
            this.isReply = false;
        }.bind(this));
    },
    updated() {
        this.setReviewTextOverflow();
    },
    mounted() {
        this.setReviewTextOverflow();
    },
    destroyed() {
        EventBus.$off("RouteView");
        window.removeEventListener("resize", this.setMapSetting);
    }
}
</script>
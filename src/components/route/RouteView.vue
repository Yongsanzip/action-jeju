<template>
    <div class="wrap">
        <main class="con-route">
            <!-- class:sticky toggle -->
            <div v-if="!isReply">
                <div class="post-wrap" :class="{sticky : isSticky}">
                    <div class="post-header">
                        <div class="text-box">
                            <p class="post-title">{{tourInfo.name}}</p>
                            <p class="post-route-date">{{tourInfo.days-1}}박 {{tourInfo.days}}일 여행</p>
                        </div>
                        <a href="javascript:history.back()" class="prev">이전</a>
                        <button class="btn-more" @click="isShowMenu=true">메뉴</button>
                    </div>
                    <div class="post-cover" v-if="!isSticky" :style="{backgroundImage: `url(http://img.actionjeju.com/data/user_route_image${tourInfo.image}`}">
                        <button class="btn-map" @click="openMap">지도보기 ▲</button>
                        <h2 class="post-title">{{tourInfo.name}}</h2>
                        <p class="post-date">{{tourInfo.days-1}}박 {{tourInfo.days}}일 여행</p>
                        <p class="post-write">{{tourInfo.nick}}</p>
                    </div>
                    <div class="route-map" v-if="isSticky" :height="mapHeights[0]+'px'" :class="{middle: slideChk === 1, full: slideChk === 2}">
                        <!--<button class="btn-draw">맵 드로어</button>-->
                        <!-- map -->
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
                            <template v-if="polylineList != null && polylineList.length > 0">
                                <div class="polylinelength">{{polylineList.length}}</div>
                                <naver-polyline v-for="(polyline, idx) in polylineList" :path="polyline" :tour-day="polylineOrder[idx].tour_day" :key="'polyline_'+idx" @load="onPolylineLoaded" />
                            </template>

<!--                            <naver-polyline :path="polylineList" :tour-day="polylineOrder[idx].tour_day" @load="onPolylineLoaded" />-->

                        </naver-maps>
<!--                        <button class="btn-map-size" @click="changeMapSize">지도</button>-->
                        <div class="slide-drawer" :class="slideChk" v-show="slideChk === 0" v-hammer:swipe.down="slidedown"></div>
                        <div class="slide-drawer" :class="slideChk" v-show="slideChk === 1" v-hammer:swipe.up="slideUp" v-hammer:swipe.down="slidedown"></div>
                        <div class="slide-drawer" :class="slideChk" v-show="slideChk === 2" v-hammer:swipe.up="slideUp"></div>
                        <!-- //map -->
                    </div>
                </div>

                <div class="route-wrap">
                    <div class="route-contents">
                        <div class="hashtag-list">
                            <div class="hashtag">제주혼행</div>
                            <div class="hashtag">제주혼행</div>
                            <div class="hashtag">제주혼행</div>
                        </div>
                        <!-- route item -->
                        <div class="route-item" v-for="(item, idx) in days" :key="idx">
                            <div class="travel-header">
                                <div class="travel-day">D-{{item.day}}</div>
                                <p class="travel-title">여행 {{item.day}}일차</p>
                                <p class="travel-date">{{item.date}}</p>
                            </div>
                            <ul class="travel-list">
                                <li v-for="(path, pathIdx) in item.path" :key="pathIdx">
                                    <div class="place-number">{{pathIdx+1}}</div>
                                    <p class="place-name">{{path.company_name}}</p>
                                    <p class="place-time"></p>
                                    <div class="travel-contents">
                                        <div class="review-text" @click="doViewAllReviewText($event, idx, pathIdx)">
                                            <p>{{path.review}}</p>
                                        </div>
                                        <div class="review-image-list" v-show="path.images != null">
                                            <div class="review-image" v-for="(image, imgIdx) in path.images" :key="imgIdx">
    <!--                                            <img src="../../assets/images/img-dummy.png" alt="">-->
                                                <img :src="`http://img.actionjeju.com/data/user_route_after${image.name}`" alt="">
                                            </div>
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
                            <li>
                                <button class="btn-share">공유</button>
                                <p>공유하기</p>
                            </li>
                        </ul>
                        <a href="" class="btn-get-route">경로 가져오기</a>
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
                                    <button class="btn-more">메뉴</button>
                                </div>
                                <div @click="doViewReply($event, idx)">
                                    <p class="comment-text">
                                        {{item.comment}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <!-- //card -->
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
                <div class="recommend-wrap">
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
            </div>
            <transition name="fade">
                <ReplyPopup v-if="isReply"
                            :tourIdx="id"
                            :tour-info="tourInfo"/>
            </transition>
        </main>
        <div class="overlay" :style="(isShowMenu)? '' : 'display:none;'" @click.self="isShowMenu=false">
            <ul class="overlay-menu">
                <li v-show="isMine"><a @click="modifyRout">이 여행경로 편집</a></li>
                <li v-show="isMine"><a @click="removeRout">이 여행경로 삭제</a></li>
                <li v-show="!isMine"><a @click="setFavorites">이 여행경로 찜하기</a></li>
                <li><a href="">SNS 공유하기</a></li>
            </ul>
        </div>
    </div>
</template>
<script>
import {Route, etc} from '@/api';
import {mapGetters} from 'vuex';
import { EventBus } from "../../assets/event-bus";
import ReplyPopup from "../popup/ReplyPopup";

export default {
    name:'RouteView',
    components:{
        ReplyPopup
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
        mapHeights: {
            type: Array,
            default: function() { return [159, 370, 547]; }
        }
    },
    data(){
      return{
          mapWidth: 400,
          mapHeight: this.mapHeights[0],
          slideChk: 0,
          tourInfo:[],
          days:[],
          isSticky: false,
          isMine: true,
          isLike: false,
          isFavorites: false,
          isReply:false,
          replyList:[],
          isShowMenu:false,
          mapMarkList: [],
          polyLineList: [],
          info: false,
          map: null,
          mapOptions: {
              lat: 33.2411822578,
              lng: 126.5935367973,
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
          polylineOrder: [],
          initLayers: ['BACKGROUND', 'BACKGROUND_DETAIL', 'POI_KOREAN', 'TRANSIT', 'ENGLISH', 'CHINESE', 'JAPANESE']
      }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
        slideUp(){
            if(this.slideChk <= 0) return true;
            this.slideChk = this.slideChk - 1;
            this.map.setSize({
                width: this.mapWidth,
                height: this.mapHeights[this.slideChk]
            });
        },
        slidedown(){
            if(this.slideChk > 1) return true;
            this.slideChk = this.slideChk + 1;
            this.map.setSize({
                width: this.mapWidth,
                height: this.mapHeights[this.slideChk]
            });
        },
        getRouteList() {
            const postData = new FormData;
            postData.append('tour_idx', this.id);
            Route.routeListDetail(postData).then(res => {
                //console.log(res.data)
                this.tourInfo = res.data.tourInfo;
                this.days = res.data.days;
                if(this.days != null) this.drawMapMarker();
            }).catch(err => {
                console.error(err);
            })
        },
        doViewAllReviewText(e, daysIdx, pathIdx){
            if(e.target.className.indexOf('has-overflow') >= 0){
                const textEl = e.target.getElementsByTagName("p")[0];
                textEl.innerHTML = this.days[daysIdx].path[pathIdx].review;
                textEl.style.height = "auto";
                textEl.style.display = "block";
                e.target.classList.remove("overflow2lines")
            }
        },
        openMap(){
            this.mapWidth = document.body.offsetWidth;
            this.isSticky = true;
            this.slideChk = 0;
        },
        drawMapMarker(){
            this.polylineList = [];
            let polylineData = {};
            this.days.forEach(function(day, dayIdx){
                let pathList = [];
                if(typeof day.path == "undefined" || day.path == null || day.path.length < 1){
                    console.log("no path in "+day.date);
                }
                else{
                    day.path.forEach(function(path, pathIdx){
                        polylineData.tour_day = dayIdx;
                        pathList.push({
                            day: dayIdx + 1,
                            title: pathIdx,
                            lat: Number(path.lat),
                            lng: Number(path.long)
                        });

                        if(dayIdx > 0 && pathIdx == 0){
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
                        else if(pathIdx == day.path.length - 1){
                            polylineData.end = {
                                'lat': path.lat,
                                'lng': path.long
                            };
                        }
                    }.bind(this));
                }

                this.mapMarkList.push(pathList);
            }.bind(this));
        },
        getPolyLine(data){
            this.polylineOrder.push({
                "tour_day": data.tour_day
            });
            const polylineListIdx = this.polylineList.length;
            this.polylineList.push(null);
            const postData = new FormData;
            postData.append('s_lat', data.start.lat);
            postData.append('s_lon', data.start.lng);
            postData.append('e_lat', data.end.lat);
            postData.append('e_lon', data.end.lng);
            Route.routeDrivePath(postData).then(res => {
                const points = res.data.points;
                points.forEach(function(point){
                    point.lng = point.lon;
                });
                this.polylineList[polylineListIdx] = points;
            }).catch(err => {
                console.error(err);
            })
        },
        onLoadMap(vue){
            this.map = vue;
        },
        onMarkerLoaded(marker){
            const markerIcon = document.createElement('div');
            markerIcon.classList.add('markerContent');
            markerIcon.title = marker.otherOptions.day+"일차";
            const routeMarker = document.createElement('div');
            routeMarker.classList.add('routeMarker');
            routeMarker.classList.add('day'+marker.otherOptions.day);
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
        onPolylineLoaded(polyline){
            // console.log(polyline);
            const tourDay = Number(polyline.$el.getAttribute("tour-day")) % 3;
            let strokeColor = '#00c7c9';
            switch (tourDay) {
                case 1:
                    strokeColor = '#f3645a';
                    break;
                case 2:
                    strokeColor = '#5899fb';
                    break;
                default:
                    strokeColor = '#00c7c9';
                    break;
            }
            polyline.setOptions({
                strokeColor: strokeColor
            });
        },
        changeMapSize(){
            let idx = this.mapHeights.indexOf(this.mapHeight) + 1;
            if(idx == this.mapHeights.length) idx = 0;
            this.mapHeight = this.mapHeights[idx];
            document.getElementsByClassName("route-map")[0].style.height = this.mapHeight+"px";
        },
        getLike(){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'get');
            postData.append('type', 'route');
            postData.append('idx', this.id);
            etc.like(postData).then(res => {
                //console.log(res.data)
                res.data.isLike === 'N' ? this.isLike = false : this.isLike = true
            }).catch(err => {
                console.error(err);
            })
        },
        setLike(){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'route');
            postData.append('idx', this.id);
            etc.like(postData).then(res => {
                console.log(res.data)
                res.data.isLike === 'N' ? this.tourInfo.user_like_count-- : this.tourInfo.user_like_count++
            }).catch(err => {
                console.error(err);
            })
        },
        getFavorites(){
            const postData = new FormData;
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
        },
        setFavorites(){
            if(this.isShowMenu) this.isShowMenu=false;

            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'route');
            postData.append('idx', this.id);
            etc.Favorites(postData).then(res => {
                //console.log(res.data)
                if(res.data.isZzim === 'N'){
                    this.tourInfo.zzim_count--
                    this.isFavorites = false
                }
                else {
                    this.tourInfo.zzim_count++
                    this.isFavorites = true
                }
            }).catch(err => {
                console.error(err);
            })
        },
        getReplyList() {
            const postData = new FormData;
            postData.append('tour_idx', this.id);
            Route.replyList(postData).then(res => {
                //console.log(res.data)
                if(res.data.replyList == null) return;

                if(res.data.replyList.length > 3){
                    this.replyList = [];
                    for(let i=0; i<3; i++){
                        this.replyList.push(res.data.replyList[i]);
                    }
                }
                else{
                    this.replyList = res.data.replyList;
                }

                this.replyList.forEach(function(item){
                    item.getReg = this.$moment(new Date(item.regdt)).fromNow();
                }.bind(this));

            }).catch(err => {
                console.error(err);
            })
        },
        doReply(){
            this.isReply = true;
        },
        doViewReply(e, idx){
            if(e.target.className.indexOf("overflow3lines") >= 0){
                //this.doReply();
                const textEl = e.target.getElementsByTagName("p")[0];
                textEl.innerHTML = this.replyList[idx].comment;
                textEl.style.height = "auto";
                textEl.style.display = "block";
                e.target.classList.remove("overflow3lines")
            }
        },
        modifyRout(){
            this.isShowMenu=false;

            this.$router.push({
                name: 'RouteMake',
                params: {
                    'idx': Number(this.id),
                    'isChk_flag': true
                }
            });
        },
        removeRout(){
            this.isShowMenu=false;

            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('tour_idx', this.id);
            Route.deleteRoute(postData).then(res => {
                console.log(res.data)
                history.back();
            }).catch(err => {
                console.error(err);
            })
        }
        /*
        ,shareLink(){
            const snsCode = "vIconTw";
            let cUrl;
            switch(snsCode){
                case"vIconTw":
                    //트위터
                    cUrl = 'https://twitter.com/intent/tweet?text=페이지제목:&url='+cUrl;
                    break;
                case"vIconTg":
                    //텔레그램
                    cUrl = 'https://telegram.me/share/url?url='+cUrl;
                    break;
                case"vIconFb":
                    //페이스북
                    cUrl = 'http://www.facebook.com/sharer/sharer.php?u='+cUrl;
                    break;
                case"vIconKs":
                    //카카오스토리
                    cUrl = 'https://story.kakao.com/share?url='+cUrl;
                    break;
            }
            window.open(cUrl,'','width=600,height=300,top=100,left=100,scrollbars=yes');
        }
        */
    },
    created() {
        window.scrollTo(0,0);
        this.getRouteList();
        this.getLike();
        this.getFavorites();
        this.getReplyList();
        EventBus.$on("RouteView", props => {
            this.isReply = props;
            this.getRouteList();
            this.getReplyList();
        });
    },
    updated() {
        const reviewTextBox = document.getElementsByClassName("review-text");
        let reviewTextEl = null;
        if(reviewTextBox.length >= 0){
            reviewTextBox.forEach(function(boxEl){
                reviewTextEl = boxEl.getElementsByTagName("p")[0];
                if (reviewTextEl.scrollWidth > reviewTextEl.offsetWidth * this.reviewLines - 60){
                    while (reviewTextEl.scrollWidth > reviewTextEl.offsetWidth * this.reviewLines - 60) {
                        reviewTextEl.innerHTML = reviewTextEl.innerHTML.slice(0, -1);
                    }
                    boxEl.classList.add("overflow2lines");
                }
                if (reviewTextEl.scrollWidth > reviewTextEl.offsetWidth) reviewTextEl.parentElement.classList.add("has-overflow");
            }.bind(this))
        }

        const commentTextEl = document.getElementsByClassName("comment-text");
        if(commentTextEl.length < 1) return;
        commentTextEl.forEach(function(el){
            if (el.scrollWidth > el.offsetWidth * this.commentLines - 60){
                while (el.scrollWidth > el.offsetWidth * this.commentLines - 60) {
                    el.innerHTML = el.innerHTML.slice(0, -1);
                }
                el.parentElement.classList.add("overflow3lines");
            }
            if (el.scrollWidth > el.offsetWidth) el.parentElement.classList.add("has-overflow");
        }.bind(this));

    }
}
</script>
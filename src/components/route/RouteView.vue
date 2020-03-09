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
                    <div class="route-map" v-if="isSticky">
                        <button class="btn-draw">맵 드로어</button>
                    </div>
                </div>
                <!-- map -->

                <!-- //map -->
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
                                        <div class="review-text">
                                            <p class="short" style="white-space: nowrap;" v-show="path.showLongText === false">{{path.review}}</p>
                                            <p class="long" style="overflow: inherit;" v-show="path.isLong === true && path.showLongText === true">{{path.review}}</p>
                                            <a v-show="path.isLong === true && path.showLongText === false" @click="showLongReviewText($event, idx, pathIdx)">더보기</a>
                                        </div>
                                        <div class="review-image-list">
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
                                <div>
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
                <li><a @click="modifyRout">이 여행경로 편집</a></li>
                <li><a @click="removeRout">이 여행일정 삭제</a></li>
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
        }
    },
    data(){
      return{
          tourInfo:[],
          days:[],
          isSticky: false,
          isLike: false,
          isFavorites: false,
          isReply:false,
          replyList:[],
          isShowMenu:false
      }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
        getRouteList() {
            const postData = new FormData;
            postData.append('tour_idx', this.id);
            Route.routeListDetail(postData).then(res => {
                //console.log(res.data)
                this.tourInfo = res.data.tourInfo;
                this.days = res.data.days;
                this.setReviewText();
            }).catch(err => {
                console.error(err);
            })
        },
        setReviewText(){
            for(let i=0; i<this.days.length; i++){
                if(typeof this.days[i].path == "undefined") continue;
                for(let j=0; j<this.days[i].path.length; j++){
                    this.days[i].path[j].isLong = false;
                    this.days[i].path[j].showLongText = false;
                }
            }
        },
        showLongReviewText(envt, daysIdx, pathIdx){
            this.days[daysIdx].path[pathIdx].showLongText = true;
            envt.target.style.display="none";
            envt.target.parentElement.getElementsByClassName("short")[0].style.display="none";
            envt.target.parentElement.getElementsByClassName("long")[0].style.display="inline";
        },
        openMap(){
            this.isSticky = true;
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
        setFavorites(){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'route');
            postData.append('idx', this.id);
            etc.Favorites(postData).then(res => {
                //console.log(res.data)
                res.data.isZzim === 'N' ? this.tourInfo.zzim_count-- : this.tourInfo.zzim_count++
            }).catch(err => {
                console.error(err);
            })
        },
        doReply(){
            this.isReply = true;
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
    },
    created() {
        window.scrollTo(0,0);
        this.getRouteList();
        this.getLike();
        this.getFavorites();
        this.getReplyList();
        EventBus.$on("RouteView", props => {
            this.isReply = props;
        });
    },
    updated() {
        const reviewTextBox = document.getElementsByClassName("review-text");
        let reviewText = null;
        let k = 0;
        for(let j=0; j<this.days.length; j++){
            if(typeof this.days[j].path == "undefined") continue;
            if(this.days[j].path.length < 1) continue;

            for(let i=0; i<this.days[j].path.length; i++){
                //console.log(k, reviewTextBox[k], reviewTextBox[k].getElementsByClassName("short"));
                if(reviewTextBox[k] == null) continue;
                if(reviewTextBox[k].classList.value.indexOf("has-overflow") > -1) continue;

                if(reviewTextBox[k].getElementsByClassName("short").length < 1) continue;
                reviewText = reviewTextBox[k].getElementsByClassName("short")[0];
                if (reviewText.scrollWidth > reviewText.offsetWidth * this.reviewLines - 60){
                    reviewTextBox[k].classList.add("has-overflow");
                    this.days[j].path[i].isLong = true;
                    if(reviewTextBox[k].getElementsByTagName("a") != null && reviewTextBox[k].getElementsByTagName("a").style != null) {
                        reviewTextBox[k].getElementsByTagName("a").style.display = "block";
                    }
                    if(reviewText.innerHTML.length > 150) reviewText.innerHTML.substring(0, 150);
                    reviewTextBox[i].getElementsByTagName("a")[0].style.display = "block";
                }
                while (reviewText.scrollWidth > reviewText.offsetWidth * this.reviewLines - 60) {
                    reviewText.innerHTML = reviewText.innerHTML.slice(0, -1);
                }
                reviewText.innerHTML = reviewText.innerHTML.trim();
                reviewText.style['white-space'] = 'inherit';

                k++;
            }
        }

    }
}
</script>
<template>
    <section class="wrap">
        <header class="sub-header">
            <a href="javascript:history.back()" class="back__btn"></a>
            <h1>{{ placeInfo.company_name }}</h1>
        </header>
        <div class="container con-place">
            <div class="place-slide-box">
                <swiper :options="visualOption">
                    <swiper-slide v-for="(item, idx) in images" :key="idx">
                        <div class="place-slide"
                             :style="{backgroundImage: `url(http://img.actionjeju.com/data/company_image${item}`}"
                        >
                        </div>
                    </swiper-slide>
                    <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
                    <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
                </swiper>
                <div class="menu">
                    <ul class="custom-check">
                        <li class="check_like">
                            <label>
                                <input type="checkbox" :checked="isLike" @change="setLike">
                                <span></span>
                            </label>
                        </li>
                        <li class="check_favorite">
                            <label>
                                <input type="checkbox" :checked="isFavorites" @change="setFavorites">
                                <span></span>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- place map -->
            <!--
            <div class="place-map">
                <button class="btn-close-map">지도 접기 ▲</button>
            </div>
            -->
            <!-- //place map -->
            <div class="surface">
                <div class="center">
                    <h3 class="place-name">{{ placeInfo.company_name }}</h3>
                    <p class="place-score">{{ placeInfo.star_point }}</p>
                    <div class="star_area m-star">
                            <span class="star_rating star">
                                <span :style="{width: `${(placeInfo.star_point*20)}%`}"></span>
                            </span>
                    </div>
                </div>
                <ul class="place-menu-list">
<!--                    <li class="route">경로추가</li>-->
                    <li class="map" @click="doViewMap">지도보기</li>
<!--                    <li class="review" @click="doReview">후기쓰기</li>-->
<!--                    <li class="share">공유하기</li>-->
                </ul>
                <ul class="place-detail-list">
                    <li class="hashtag-list">
                        <div class="hashtag" v-for="(hashtag, idx) in hashes.slice(0, 3)" :key="idx">{{hashtag}}</div>
                    </li>
                    <li class="address">
                        <p>{{placeInfo.company_addr}}</p>
                    </li>
                    <li class="call" v-if="placeInfo.company_tel === ''">-</li>
                    <li class="call" v-else>
                        {{placeInfo.company_tel}}
                        <button class="btn-call" @click="callToPlace(placeInfo.company_tel)">전화하기</button>
                    </li>
                    <li class="intro" v-if="placeInfo.company_desc === ''">-</li>
                    <li class="intro" v-else>
                        <p v-html="placeInfo.company_desc"></p>
                    </li>
                    <li class="time">
                        <p v-if="salesTime === null">-</p>
                        <p v-else>영업시간 오전 {{salesTime.sale_start}}시 ~ 오후 {{salesTime.sale_end}}시</p>
                    </li>
                    <li class="service">
                        <div>
                            <div class="tag" v-for="(item, idx) in facilities" :key="idx">{{item}}</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="surface" v-if="reviewImages != null && reviewImages.length > 0">
                <p class="text">사진</p>
                <div class="place-image-list">
                    <div class="place-image" v-for="(item, idx) in reviewImages.slice(0, 6)" :key="idx">
                        <div class="leftCountBox" v-if="idx+1 == 6" @click="doPhoto(null)">
                            <div class="leftCount">
                                {{reviewImages.length - 6}}+
                            </div>
                        </div>
                        <img :src="`http://img.actionjeju.com/data/user_route_after${item.name}`" :alt="item.idx" @click="doPhoto(idx)">
                        <label class="btn-like">
                            <input type="checkbox" :class="'photoLike_'+item.idx"
                                   :checked="item.like_yn === 'Y'"
                                   @change="setPhotoLike(idx, item.idx)">
                            <div class="shape"></div>
                        </label>
                    </div>
                </div>

            </div>
            <div class="surface">
                <p class="text">후기</p>
                <div class="place-review-list">
                    <!-- review -->
                    <div v-if="reviews === null">
                        <p style="text-align: center;font-size: 11px;padding: 15px 0;">후기가 없습니다.</p>
                    </div>
                    <div v-else class="place-review" v-for="(item, idx) in reviews.slice(0, reviewsLimit)" :key="idx">
                        <div class="profile">
                            <img src="../../assets/images/img-dummy.png" alt="item.tourimg">
                        </div>
                        <div class="review-contents">
                            <div class="score-wrap">
                                <div class="star_area m-star">
                                    <span class="star_rating star">
                                        <span :style="{width: `${(item.after_star*20)}%`}"></span>
                                    </span>
                                </div>
                                <p class="place-score">{{item.after_star}}</p>
                            </div>
                            <div>
                                <p class="review-writer">{{item.mb_id}}</p>
                                <p class="review-time">
                                    {{$moment(item.regdt).fromNow()}}
                                </p>
                            </div>
                            <div>
                                <div class="review-text">
                                    <p class="short" style="white-space: nowrap;" v-show="item.showLongText == null || item.showLongText === false">{{item.cont}}</p>
                                    <p class="long" style="overflow: inherit;" v-show="item.isLong === true && item.showLongText === true">{{item.cont}}</p>
                                    <a v-show="item.isLong === true && item.showLongText === false" @click="showLongReviewText($event, idx)">더보기</a>
                                </div>
                                <!--<p class="review-text">{{item.cont}}</p>-->
                            </div>
                        </div>
                    </div>
                    <!-- //review -->
                </div>
                <div class="review-more" v-if="reviews != null && reviews.length > 0 && reviews.length > reviewsLimit" @click="reviewsLimit = reviewsLimit+30">
                    <p>후기 더보기</p>
                </div>
            </div>
        </div>
        <transition name="fade">
            <modal-review v-if="showReview"
                          :pathidx="this.id"
                          :title="placeInfo.company_name"
            />
            <modal-photo v-if="showModal"
                         :fullScreen="true"
                         :photo-list="reviewImages"
                         :idx="reviewImageIdx"
                         :title="placeInfo.company_name"
            />
            <modal-map v-if="mapModal"
                        :mapOptions = "mapModalOptions"
                        :markPlace = "mapModalPlaceList"
                        :isPopup = "true"
                        style = "position: fixed;top: 0;z-index: 98;"
            />
        </transition>
    </section>
</template>
<script>
import {Route, etc} from '@/api'
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import ModalPhoto from "../popup/PhotoPopup";
import ModalReview from "../popup/ReviewPopup";
import ModalMap from "../search/Map";
import { EventBus } from "../../assets/event-bus";
import {mapGetters} from 'vuex';

export default {
    name: 'PlaceView',
    props: {
        id: {
            type: String,
            default: null
        },
        reviewLines: {
            type: Number,
            default: 3
        }
    },
    components: {
        swiper, swiperSlide, ModalPhoto, ModalReview, ModalMap
    },
    data() {
        return {
            mapModal: false,
            mapModalOptions: {
                lat: 0,
                lng: 0,
                zoom: 10,
                zoomControl: false,
                scaleControl: false,
                logoControl: true,
                logoControlOptions: {
                    position: -10
                },
                mapTypeControl: false,
                mapDataControl: false
            },
            mapModalPlaceList: null,
            showReview:false,
            showModal:false,
            category: null,
            placeInfo:[],
            hashes:[],
            salesTime:[],
            images:[],
            facilities:[],
            reviewImages:[],
            reviewImageIdx:null,
            reviews:[],
            visualOption: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                freeMode: true,
                loop: false,
                speed: 400,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
            },
            isLike:false,
            isFavorites:false,
            isPhotoLike:false,
            reviewsLimit: 30
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
        /*
        * doViewMap
        * 지도보기 선택
         */
        doViewMap(){
            this.mapModalOptions.lat = this.placeInfo.latitude;
            this.mapModalOptions.lng = this.placeInfo.longitude;
            this.mapModalPlaceList = [];
            this.mapModalPlaceList.push({
                latitude: this.placeInfo.latitude,
                longitude: this.placeInfo.longitude,
                company_idx: this.id,
                option: {
                    category: this.category,
                    company_idx: this.id
                }
            });

            this.mapModal = true;
        },
        /*
        * doReview
        * 후기쓰기 선택
         */
        doReview(){
            this.showReview = true;
        },
        /*
        * doPhoto
        * 사진 선택으로 갤러리 화면 이동
         */
        doPhoto(idx){
            this.reviewImageIdx = idx;
            this.showModal = true;
        },
        /*
        * getLike
        * 해당 장소 좋아요 여부 조회
         */
        getLike(){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'get');
            postData.append('type', 'place');
            postData.append('idx', this.id);
            etc.like(postData).then(res => {
                //console.log(res.data)
                res.data.isLike === 'N' ? this.isLike = false : this.isLike = true
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * setLike
        * 해당 장소 좋아요 적용
         */
        setLike(){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'place');
            postData.append('idx', this.id);
            etc.like(postData).then(res => {
                console.log(res.data)
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * getPhotoLike
        * 이미지 별 좋아요 여부 조회
         */
        getPhotoLike(idx){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'get');
            postData.append('type', 'photo');
            postData.append('idx', idx);
            return etc.like(postData)
                .then(res => res.data)
                .then(({isLike}) => isLike)
                .catch(err => {
                    console.error(err);
                })
        },
        /*
        * setPhotoLike
        * 이미지 별 좋아요 여부 적용
         */
        setPhotoLike(imgIdx, idx){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'photo');
            postData.append('idx', idx);
            etc.like(postData).then(res => {
                this.reviewImages[imgIdx].like_yn = res.data.isLike === "Y";
                // console.log(res.data)
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * getFavorites
        * 해당 장소 찜하기 여부 조회
         */
        getFavorites(){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'get');
            postData.append('type', 'place');
            postData.append('idx', this.id);
            etc.Favorites(postData).then(res => {
                //console.log(res.data)
                res.data.isZzim === 'N' ? this.isFavorites = false : this.isFavorites = true
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * setFavorites
        * 해당 장소 찜하기 여부 적용
         */
        setFavorites(){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'place');
            postData.append('idx', this.id);
            etc.Favorites(postData).then(res => {
                console.log(res.data)
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * callToPlace
        * 해당 장소 전화걸기
         */
        callToPlace(phoneNumb){
            if(phoneNumb == null){
                this.$alert('전화번호가 등록되지 않은 업체입니다.');
            }
            location.href="tel:"+phoneNumb;
        },
        /*
        * setReviewText, showLongReviewText
        * 내용이 긴 장소 후기 내용 축소 및 더보기 버튼 표시.
         */
        setReviewText(){
            if(this.reviews == null) return false;
            for(let i=0; i<this.reviews.length; i++){
                this.reviews.isLong = false;
                this.reviews.showLongText = false;
            }
        },
        showLongReviewText(envt, idx){
            this.reviews[idx].showLongText = true;
            envt.target.style.display="none";
            envt.target.parentElement.getElementsByClassName("short")[0].style.display="none";
            envt.target.parentElement.getElementsByClassName("long")[0].style.display="block";
        }
    },
    async created() {
        try {
            window.scrollTo(0,0);
            const postData = new FormData();
            postData.append('place_idx', this.id);
            postData.append('mb_id', this.GET_MB_ID);
            await Route.place(postData)
                .then(res => res.data)
                .then(info => {
                    this.category = info.category;
                    this.placeInfo = info.placeInfo;
                    this.images = info.images;
                    this.hashes = info.hashes;
                    this.salesTime = info.salesTime;
                    this.facilities = info.facilities;
                    if (info.reviewImages){
                        info.reviewImages.forEach(async (e) => {
                            const getLike = await this.getPhotoLike(e.idx);
                            e.checked = getLike === 'Y';
                            if(document.getElementsByClassName("photoLike_"+e.idx).length > 0) document.getElementsByClassName("photoLike_"+e.idx)[0].checked = e.checked;
                        });
                    }
                    this.reviewImages = info.reviewImages;
                    this.reviews = info.reviews;
                    this.setReviewText();
                    //console.log(this.reviewImages)
                })
                .catch(console.error);
            EventBus.$on("PlaceView", props => {
                this.showModal = props;
                this.showReview = props;
                this.mapModal = props;
            });
            this.getLike();
            this.getFavorites();
        } catch (e) {
            console.error(e);
        }
    },
    updated() {
        const reviewTextBox = document.getElementsByClassName("review-text");
        let reviewText = null;
        if(this.reviews == null) return false;
        for(let i=0; i<this.reviews.length; i++){

            if(reviewTextBox[i] == null) continue;
            if(reviewTextBox[i].classList.value.indexOf("has-overflow") > -1) continue;

            reviewText = reviewTextBox[i].getElementsByClassName("short")[0];
            if (reviewText.scrollWidth > reviewText.offsetWidth * this.reviewLines - 80){
                reviewTextBox[i].classList.add("has-overflow");
                this.reviews[i].isLong = true;
                if(reviewTextBox[i].getElementsByTagName("a") != null && reviewTextBox[i].getElementsByTagName("a").style != null) {
                    reviewTextBox[i].getElementsByTagName("a").style.display = "block";
                }
                if(reviewText.innerHTML.length > 150) reviewText.innerHTML.substring(0, 150);
                reviewTextBox[i].getElementsByTagName("a")[0].style.display = "block";
            }
            while (reviewText.scrollWidth > reviewText.offsetWidth * this.reviewLines - 80) {
                reviewText.innerHTML = reviewText.innerHTML.slice(0, -1);
            }
            reviewText.innerHTML = reviewText.innerHTML.trim();
            reviewText.style['white-space'] = 'inherit';

        }
    },
    destroyed() {
        EventBus.$off("PlaceView");
    }
}
</script>
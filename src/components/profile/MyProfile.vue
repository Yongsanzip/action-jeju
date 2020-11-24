<template>
    <section class="wrap">
        <header class="header sub-header">
            <a href="javascript:history.back()" class="back__btn"></a>
            <h1>마이 액션제주</h1>
            <ul class="header-menu">
                <li class="notice">
                    <a href="" class="link"></a>
                    <div class="new"></div>
                </li>
                <li class="setting">
                    <router-link to="/setting" class="link"></router-link>
                </li>
            </ul>
        </header>
        <div class="container con-profile">
            <div class="profile-box">
                <div>
                    <div>
                        <div>
                            <div class="profile-image">
                                <img :src="profile.profile_img" alt="">
                            </div>
                            <label class="edit-image">
                                <input type="file" ref="profileImg" name="profileImg" accept="image/*" @change="profileImgChanged">
                                <div class="shape">이미지 업로드</div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <div>{{myTourList.length | currency}}</div>
                        <div>나의 제주여행</div>
                    </div>
                    <div>
                        <div>{{profile.point | currency}}</div>
                        <div>액션포인트</div>
                    </div>
                    <div>
                        <router-link to="/profileMod" class="btn-white" >프로필편집</router-link>
                    </div>
                </div>
                <div>
                    <p>{{profile.nick}}</p>
                    <p>{{GET_MB_ID}}</p>
                </div>
            </div>
            <div class="contents">
                <ul class="list-menu">
                    <li v-for="(list, index) in navList" :key="index"
                        :class="{ active : el_Active === index}"
                        @click="el_Active = index">
                        <button type="button" @click="getList(list.type)">{{list.text}}</button>
                    </li>
                </ul>
                <div class="list-contents" v-if="profileList === null">
                    <p style="font-size:13px;text-align: center;">{{noDataText}}</p>
                </div>
                <div class="list-contents" v-else>
                    <div v-for="(item, idx) in profileList.slice(0, this.listLimit)" :key="idx" :class="{photo__list : item.image_name}">
                        <dynamic-list :data="item" :type="type"></dynamic-list>
                    </div>
                    <!-- card more -->
                    <div class="card-more" v-show="type != 'photolike' && profileList.length > this.listLimit" @click="showMoreList">
                        <p>{{(type == 'zzimplace')? '장소' : (type == 'placereview')? '후기' : (type == 'reply')? '댓글' : '경로'}} 더보기</p>
                    </div>
                    <!-- //card-more -->
                    <modal-photo v-if="showPhotoModal"
                                 :photo-list="profileList"
                                 :idx="selectedPhotoIdx"
                                 :hasListView="false"
                                 :writerNick="profileList[selectedPhotoIdx].mb_nick"
                                 :allLike="true"
                                 :fullScreen="true"
                    />
                </div>
            </div>
            <div class="banner-ads">
                <a v-if="banners[showBannerIdx] != null" :href="banners[showBannerIdx].url != null? banners[showBannerIdx].url : '#'" :target="banners[showBannerIdx].url.length > 0? '_blank' : ''">
                    <img :src="`http://img.actionjeju.com/data/banner${banners[showBannerIdx].name}`" alt="" style="width: 100%;" v-on:load="loadedBannerImg" />
                </a>
            </div>
        </div>
    </section>
</template>
<script>
import { profile, Route, etc } from "@/api";
import {mapGetters} from 'vuex';
import DynamicList from "../profile/DynamicList";
import { EventBus } from "../../assets/event-bus";
import ModalPhoto from "../popup/PhotoPopup";

export default {
    name: 'MyProfile',
    components: {DynamicList, ModalPhoto},
    props: {
        originListLimit: {
            type: Number,
            default: 30
        }
    },
    data(){
        return{
            profile:[],
            profileList:[],
            myTourList: [],
            type:null,
            el_Active: 0,
            noDataText:null,
            navList:[
                {text: '나의 제주여행', type : 'mytravel'},
                {text: '찜한 제주여행', type : 'likejejutravel'},
                {text: '찜한 장소', type : 'zzimplace'},
                {text: '사진좋아요', type : 'photolike'},
                {text: '장소후기', type : 'placereview'},
                {text: '경로댓글', type : 'reply'},
            ],
            listLimit: this.originListLimit,
            showPhotoModal: false,
            banners: [],
            showBannerIdx: 0,
            bannerTimer: null,
        }
    },
    filters: {
        currency: function(v){
            return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
        /*
        * getBannerAds
        * 광고 배너 조회
         */
        getBannerAds() {
            const postData = new FormData();
            postData.append('mb_id', this.GET_MB_ID);
            etc.bannerAds_profile(postData).then(res => {
                if(res.data.resultCode === "1000" && res.data.banner1 != null  && res.data.banner1.length > 0) {
                    this.banners = res.data.banner1;
                    this.$forceUpdate();

                    this.setBannerRolling();
                }
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * setBannerRolling
        * 광고 배너 자동 롤링 (3초 간격)
         */
        setBannerRolling() {
            if(this.bannerTimer != null) clearInterval (this.bannerTimer);
            this.bannerTimer = setInterval(function() {
                this.showBannerIdx = this.showBannerIdx + 1;
                if(this.showBannerIdx >= this.banners.length) this.showBannerIdx = 0;
            }.bind(this), 3000);

        },
        /*
        * getProfile
        * 사용자 정보 조회
         */
        getProfile(){
            const postData = new FormData();
            postData.append('mb_id', this.GET_MB_ID);

            profile.profile(postData).then(res => {
                const getResult = res.data;
                this.profile = getResult;
                // console.log(getResult.result_code)
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * profileImgChanged
        * 프로필 이미지 변경
         */
        profileImgChanged() {
            // const file = e.target.files[0];
            // this.url = URL.createObjectURL(file)
            this.doModifyImg();
        },

        /*
        * doModifyImg
        * 프로필 이미지 변경 저장
         */
        doModifyImg(){
            const data = new FormData();
            data.append('mb_id', this.GET_MB_ID);
            data.append('myfile', this.$refs.profileImg.files[0]);

            profile.profileImage(data)
                .then(res => {
                    const getResult = res.data;
                    console.log(getResult);
                    window.location.reload();
                }).catch(err => {
                console.error(err);
            })
        },
        /*
        * getList
        * 선택된 탭 별 목록 조회
         */
        getList(type, isReload = false){
            if(this.type === type && !isReload) return;
            this.profileList = [];
            this.listLimit = this.originListLimit;
            if (type) this.type = type;
            if (this.type === 'mytravel'){//나의 제주여행
                const postData = new FormData();
                postData.append('type', 'mine');
                postData.append('mb_id', this.GET_MB_ID);

                Route.routeList(postData).then(res => {
                    this.profileList = res.data.tours;
                    this.myTourList = res.data.tours;
                    this.noDataText = "작성된 제주여행이 없습니다."
                    //console.log(this.profileList)
                }).catch(err => {
                    console.error(err);
                });
            } else if (this.type === 'likejejutravel'){//찜한 제주여행
                const postData = new FormData();

                postData.append('type', 'zzim');
                postData.append('mb_id', this.GET_MB_ID);
                //postData.append('mb_id', 'petitemn@nate.com');
                Route.routeList(postData).then(res => {
                    this.profileList = res.data.tours;
                    this.noDataText = "찜한 제주여행이 없습니다."
                    //console.log(this.profileList)
                }).catch(err => {
                    console.error(err);
                })
            } else if (this.type === 'zzimplace'){//찜한 장소
                const postData = new FormData();

                postData.append('mb_id', this.GET_MB_ID);
                //postData.append('mb_id', 'petitemn@nate.com');
                profile.zzimPlace(postData).then(res => {
                    this.profileList = res.data.placeList;
                    this.noDataText = "찜한 장소가 없습니다."
                    //console.log(this.profileList)
                }).catch(err => {
                    console.error(err);
                })
            }else if (this.type === 'photolike'){ //사진 좋아요
                const postData = new FormData();
                // postData.append('mb_id', 'petitemn@nate.com');
                postData.append('mb_id', this.GET_MB_ID);

                profile.likePhoto(postData).then(res => {
                    this.profileList = res.data.photos.map(function(item){
                        return {
                            ...item,
                            name: item.image_name
                        }
                    });
                    this.noDataText = "좋아요 사진이 없습니다."
                }).catch(err => {
                    console.error(err);
                })
            }else if (this.type === 'placereview'){ //장소 후기
                const postData = new FormData();
                postData.append('mb_id', this.GET_MB_ID);

                profile.myReview(postData).then(res => {
                    this.profileList = res.data.reviews;
                    this.noDataText = "장소후기가 없습니다."
                }).catch(err => {
                    console.error(err);
                })
            }else if (this.type === 'reply'){
                const postData = new FormData();
                // postData.append('mb_id', 'petitemn@nate.com');
                postData.append('mb_id', this.GET_MB_ID);

                profile.myReply(postData).then(res => {
                    this.profileList = res.data.replys;
                    this.noDataText = "댓글이 없습니다."
                }).catch(err => {
                    console.error(err);
                })
            }
        },
        /*
        * showMoreList
        * 목록 더보기
         */
        showMoreList(){
            this.listLimit = this.listLimit + this.originListLimit;
        },
        loadedBannerImg() {
            this.$el.querySelector(".list-contents").style.height =  document.body.offsetHeight - (document.body.offsetWidth * this.$el.querySelector(".banner-ads img").clientHeight/this.$el.querySelector(".banner-ads img").clientWidth) - 40 - 155 - 64 - 46 + 'px';
        }
    },
    created() {
        this.getBannerAds();
        this.getProfile();
        this.getList(this.navList[this.el_Active].type);
        EventBus.$on("MyProfile", (type, idx) => {
            if(type === "myTravel"){
                this.getList("mytravel", true);
            }
            else if(type === "photo"){
                if(idx == null){
                    this.showPhotoModal = false;
                    this.getList(this.type, true);
                    document.getElementsByClassName("container")[0].style['z-index'] = 1;
                }
                else{
                    let selectedPhotoIdx = null;
                    this.profileList.filter(function(item, i){
                        if(item.image_idx === idx){
                            selectedPhotoIdx = i;
                            return i;
                        }
                    });
                    this.showPhotoModal = true;
                    this.selectedPhotoIdx = selectedPhotoIdx;
                    document.getElementsByClassName("container")[0].style['z-index'] = 999;
                }
            }
        });
    },
    destroyed() {
        EventBus.$off("MyProfile");
    }
}
</script>
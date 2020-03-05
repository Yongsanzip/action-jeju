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
                    <router-link to="/setting" class="link"></router-link>>
                </li>
            </ul>
        </header>
        <div class="container con-profile">
            <div class="profile-box">
                <div class="">
                    <div class="profile-image">
                        <img :src="profile.profile_img" alt="">
                    </div>
                    <div class="edit-image">
                        <a href=""></a>
                    </div>
                </div>
                <div>
                    <p class="nickname">{{profile.nick}}</p>
                    <p class="email">{{GET_MB_ID}}</p>
                </div>
                <div>
                    <router-link to="/profileMod" class="btn-white" >프로필편집</router-link>
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
                    <div v-for="(item, idx) in profileList" :key="idx" :class="{photo__list : item.image_name}">
                        <dynamic-list :data="item" :type="type" :count="profileList.length"></dynamic-list>
                    </div>
                    <modal-photo v-if="showPhotoModal"
                                 :photo-list="profileList"
                                 :idx="selectedPhotoIdx"
                                 :hasListView="false"
                                 :writerNick="profileList[selectedPhotoIdx].mb_nick"
                                 :allLike="true"
                    />
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { profile, Route} from "@/api";
import {mapGetters} from 'vuex';
import DynamicList from "../profile/DynamicList";
import { EventBus } from "../../assets/event-bus";
import ModalPhoto from "../popup/PhotoPopup";

export default {
    name: 'MyProfile',
    components: {DynamicList, ModalPhoto},
    data(){
        return{
            profile:[],
            profileList:[],
            type:'mytravel',
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
            showPhotoModal: false
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
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
        getList(type){
            this.profileList = [];
            if (type) this.type = type;
            if (this.type === 'mytravel'){//나의 제주여행
                const postData = new FormData();
                postData.append('type', 'mine');
                postData.append('mb_id', this.GET_MB_ID);

                Route.routeList(postData).then(res => {
                    this.profileList = res.data.tours;
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
                    this.profileList = res.data.photos;
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
        showDetailImgView(photoIdx, listIdx){
            console.log(photoIdx, listIdx);
        }
    },
    created() {
        this.getProfile();
        this.getList(this.navList[this.el_Active].type);
        EventBus.$on("MyProfile", idx => {
            if(idx == null){
                this.showPhotoModal = false;
                document.getElementsByClassName("container")[0].style['z-index'] = 1;
            }
            else{
                let selectedPhotoIdx = null;
                this.profileList.filter(function(item, i){
                   if(item.image_idx == idx){
                       selectedPhotoIdx = i;
                       return i;
                   }
                });
                this.showPhotoModal = true;
                this.selectedPhotoIdx = selectedPhotoIdx;
                document.getElementsByClassName("container")[0].style['z-index'] = 999;
            }
        });
    }
}
</script>
<template>
    <section class="wrap modal">
        <main class="container" :style="fullScreen? 'height: 100%; margin-top: 0;' : ''">
            <div class="image-detail-view">
                <div class="detail-header" v-if="hasListView">
                    <p class="name">{{title}}</p>
                    <button class="btn-prev" @click="close">이전</button>
                    <button class="btn-list" @click="isShowList=true" v-show="!isShowList">목록보기</button>
                </div>
                <div class="detail-header" v-else>
                    <button class="btn-close" @click="close">닫기</button>
                    <p class="writer-nick" v-if="writerNick != null">{{writerNick}}</p>
                </div>
                <transition name="fade">
                    <div class="image-viewer-block" v-show="!isShowList">
                        <div class="detail-view">
                            <swiper :options="visualOption" ref="imgSwiper" @slideChange="ChangeSwiperSlide">
                                <swiper-slide v-for="(item, idx) in imageList" :key="idx">
                                    <div class="place-slide" :style="{backgroundImage: `url(http://img.actionjeju.com/data/user_route_after${item.name})`}">
                                    </div>
                                </swiper-slide>
                                <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
                                <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
                                <div class="swiper-pagination" style="display: none;"></div>
                            </swiper>
                        </div>
                        <div class="detail-footer">
                            <label class="favorite">
                                <input type="checkbox"
                                       :checked="imageList[pageInfo.current - 1].checked"
                                       @change="setThisPhotoLike">
                                <div class="shape"></div>
                            </label>
                            <p class="paginate">{{pageInfo.current}} / {{pageInfo.total}}</p>
                        </div>
                    </div>
                </transition>
                <transition name="fade">
                <div class="image-list image-viewer-block" v-show="isShowList">
                    <div class="image-item" v-for="(item, idx) in imageList" :key="idx">
                        <img :src="'http://img.actionjeju.com/data/user_route_after/'+item.name" @click="showDetail(idx)"/>
                        <label class="btn-like">
                            <input type="checkbox" :class="'photoLike_'+item.idx"
                                   :checked="item.checked"
                                   @change="setPhotoLike(idx, item.idx)">
                            <div class="shape"></div>
                        </label>
                    </div>
                </div>
                </transition>
            </div>
        </main>
    </section>
</template>
<script>
import {etc} from '@/api'
import { EventBus } from "../../assets/event-bus";
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import {mapGetters} from 'vuex';

export default {
    name: 'PhotoPopup',
    components: {
        swiperSlide,
        swiper
    },
    props:{
        photoList: {
            type: Array,
            default() {
                return []
            },
            require: true
        },
        title: {
            type: String,
        },
        idx: {
            type: Number,
            default: 0
        },
        hasListView: {
            type: Boolean,
            default: true
        },
        allLike: {
            type: Boolean,
            default: false
        },
        fullScreen: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            imageList: this.photoList.map(function(item){
                return {
                    ...item,
                    checked: item.checked || item.like_yn === 'Y' || this.allLike
                }
            }.bind(this)),
            isShowList: false,
            showModal: false,
            visualOption:{
                initialSlide: (this.idx == null)? 0 : this.idx,
                slidesPerView: 1,
                slidesPerGroup: 1,
                freeMode: false,
                loop: false,
                speed: 400,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                pagination: {
                    el: '.swiper-pagination',
                    type: 'fraction',
                },
            },
            pageInfo: {
                current: this.idx+1,
                total: this.photoList.length
            },
            writerNick: null,
            isChecked: false,
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods: {
        /*
        * close
        * 닫기 버튼 선택
         */
        close() {
            EventBus.$emit("PlaceView", this.showModal, this.imageList);
            EventBus.$emit('MyProfile', "photo", null);
            EventBus.$emit('RouteView', this.showModal);
        },
        /*
        * ChangeSwiperSlide
        * 이미지 넘길 때 등록자명과 체크여부 확인
         */
        ChangeSwiperSlide(){
            this.pageInfo.current = this.$refs.imgSwiper.swiper.activeIndex + 1;
            this.writerNick = this.imageList[this.$refs.imgSwiper.swiper.activeIndex].mb_nick;
            this.isChecked = this.imageList[this.$refs.imgSwiper.swiper.activeIndex].checked || this.imageList[this.$refs.imgSwiper.swiper.activeIndex].like_yn === 'Y';

            this.$forceUpdate();
        },
        /*
        * showDetail
        * 이미지 목록에서 크게보기로 이동
         */
        showDetail(idx){
            this.$refs.imgSwiper.swiper.activeIndex = idx;
            this.pageInfo.current = idx+1;
            this.isShowList=false;
        },
        /*
        * setPhotoLike
        * 사진 좋아요
         */
        setPhotoLike(imgIdx, idx){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'photo');
            postData.append('idx', idx);
            etc.like(postData).then(res => {
                this.imageList[imgIdx].checked = res.data.isLike === "Y";
                // console.log(res.data)
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * setThisPhotoLike
        * 크게보기 화면에서의 사진 좋아요
         */
        setThisPhotoLike(){
            this.setPhotoLike(
                this.$refs.imgSwiper.swiper.activeIndex,
                this.imageList[this.$refs.imgSwiper.swiper.activeIndex].idx || this.imageList[this.$refs.imgSwiper.swiper.activeIndex].image_idx
            );
        }
    },
    created() {
        if(this.idx == null){
            this.isShowList=true;
        }
        else{
            this.writerNick = this.imageList[this.idx] != null? this.imageList[this.idx].mb_nick : "";
        }
    }
}
</script>
<template>
    <section class="wrap modal">
        <main class="con-route">
            <div class="overlay">
                <div class="place-review">
                    <div class="input-place-review-block">
                        <div class="review-header">
                            <button type="button" class="btn-close" @click="close()">모달닫기</button>
                            <h3 class="place-name">{{title}} <span>후기쓰기</span></h3>
                            <div class="btn-write" @click="save">완료</div>
                        </div>
                        <div class="rate-wrap">
                            <star-rating :rounded-corners="true"
                                         active-color="rgb(243,100,90)"
                                         :star-size="28"
                                         :show-rating="false"
                                         :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]"
                                         @rating-selected="setCurrentSelectedRating"
                            ></star-rating>
                            <p class="rate-text">{{currentSelectedRating}}</p>
                        </div>
                        <div class="review-textarea">
                            <textarea placeholder="이 장소의 경험을 함께 공유해 보세요" spellcheck="false" v-model="reviewText"></textarea>
                        </div>
                        <div class="review-image-list">
                            <div v-if="photoList.length == 0" class="add-image image-item" :class="'add-image-'+photoList.length" @click.self="addImage(photoList.length)">
                                이미지 추가
                                <input type="file" style="display: none;" accept="image/*" multiple/>
                            </div>
                            <swiper :options="swiperOption">
                                <swiper-slide :class="'image-item add-image-'+idx"
                                              v-for="(photoItem, idx) in photoList"
                                              :key="idx"
                                >
                                    <div v-if="idx == 0" class="add-image image-item" :class="'add-image-'+photoList.length" @click.self="addImage(photoList.length)">
                                        이미지 추가
                                        <input type="file" style="display: none;" accept="image/*" multiple/>
                                    </div>

                                    <div v-else :style="{'background-image': `url(${photoItem.src}`}" class="image-box">
                                        <button class="btn-remove" @click="removeImage(photoItem.idx)">사진삭제</button>
                                    </div>
                                    <!--                                        <div v-if="idx+1 == photoList.length" style="width: 30px;">-->

                                    <!--                                        </div>-->
                                    <!--                                        <div class="image-box">-->
                                    <!--                                            <div class="centered">-->
                                    <!--                                                <img v-bind:src="photoItem.src" alt="">-->
                                    <!--                                            </div>-->
                                    <!--                                        </div>-->
                                    <!--                                        <button class="btn-remove" @click="removeImage(photoItem.idx)">사진삭제</button>-->
                                </swiper-slide>
                            </swiper>
                        </div>
                    </div>
                    <!-- 입력완료시 active 클래스 추가 -->
                    <div class="review-complate active" @click="save">
                        완료
                    </div>
                </div>
            </div>
        </main>
    </section>
</template>
<script>
import {mapGetters} from 'vuex';
import { EventBus } from "../../assets/event-bus";
import StarRating from "vue-star-rating/dist/star-rating.min"
import { Route } from "@/api";
import {swiper, swiperSlide} from 'vue-awesome-swiper'

export default {
    name: 'ReviewPopup',
    components:{
        StarRating, swiper, swiperSlide
    },
    props:{
        location: {
            type: Object,
            default() {
                return []
            }
        },
        title: {
            type: String,
        },
        pathidx: {
            type: String,
        },
        review: {
            type: String,
        }
    },
    data() {
        return {
            showReview:false,
            currentRating:0,
            currentSelectedRating: "",
            stars:null,
            reviewText: null,
            swiperOption: {
                slidesPerView: 'auto',
                slidesPerGroup: 1,
                freeMode: true,
                loop: false,
                speed: 400,
            },
            photoList: null
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods: {
        /*
        * addImage
        * 이미지 추가
         */
        addImage(idx){
            const addImgEl = document.getElementsByClassName('add-image-'+idx)[0];
            const imgInput = addImgEl.getElementsByTagName("input");

            const imgChangeEvnt = function(e){
                console.log(e.target.files);
                // const file = e.target.files[0];
                // this.photoList.push({
                //     idx: idx,
                //     src: URL.createObjectURL(file),
                //     filename: file.name
                // });
                const files = e.target.files;
                const filesArr = Array.prototype.slice.call(files);
                filesArr.forEach(function(f) {
                   if(!f.type.match("image.*")){
                       alert("이미지만 업로드 가능합니다.");
                       return;
                   }

                   if(this.photoList.length == 0){
                       this.photoList.push({
                           idx: 0,
                           src: "",
                           filename: "이미지추가"
                       })
                   }
                    this.photoList.push({
                        idx: idx,
                        src: URL.createObjectURL(f),
                        filename: f.name
                    });
                }.bind(this));
                imgInput[0].removeEventListener('change', imgChangeEvnt);
            }.bind(this);

            imgInput[0].addEventListener('change', imgChangeEvnt);
            imgInput[0].click();
        },
        /*
        * removeImage
        * 이미지 제거
         */
        removeImage(idx){
            const imgItem = this.photoList.find(function(item) {
                return item.idx === idx;
            });
            const imgItemIdx = this.photoList.indexOf(imgItem);
            if (imgItemIdx > -1) this.photoList.splice(imgItemIdx, 1);
        },
        /*
        * setCurrentSelectedRating
        * 별점 선택.
        * 별점 하단 문구 변경
         */
        setCurrentSelectedRating: function(rating) {
            switch (rating) {
                case 1:
                    this.currentSelectedRating = "별로예요.";
                    break;
                case 2:
                    this.currentSelectedRating = "조금 아쉬워요.";
                    break;
                case 3:
                    this.currentSelectedRating = "보통이예요.";
                    break;
                case 4:
                    this.currentSelectedRating = "좋아요.";
                    break;
                case 5:
                    this.currentSelectedRating = "최고예요! 추천해요!!";
                    break;
            }
            this.stars = rating;
            // console.log(rating)
        },
        /*
        * save
        * 후기 저장
         */
        save() {
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('pathidx', this.pathidx);
            postData.append('star', this.stars * 2);
            postData.append('comment', this.reviewText);

            const images = [];
            // let src;
            this.photoList.forEach(function (item) {
                // src = item.src.split("/");
                // images.push('/'+src.pop());

                if(item.src == '') return false;
                images.push('/'+item.filename);
            });
            // postData.append('images', images.join('&'));

            Route.writeReview(postData).then(res => {
                console.log(res.data);
                if(res.data.resultCode == "1000"){
                    //성공
                    EventBus.$emit("Make2", 'review', true, this.showReview);
                }
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * close
        * 닫기 버튼 선택
         */
        close() {
            EventBus.$emit("Make2", 'review', null, this.showReview);
            EventBus.$emit("PlaceView", this.showReview);
        },
    },
    created() {
        console.log(this.location);
        if(this.location != null) {
            this.reviewText = this.location.review;
            this.pathidx = this.location.idx;
            const images = [];
            if(this.location.images != null && this.location.images.length > 0){
                this.location.images.forEach(function(image, idx){
                    if(idx == 0){
                        images.push({
                            idx: 0,
                            src: "",
                            filename: "이미지추가"
                        })
                    }
                    images.push({
                        idx: idx,
                        src: "http://img.actionjeju.com/data/user_route_after/"+image.name,
                        filename: image.name
                    });
                }.bind(this));
            }
            this.photoList = images;
        }
        else{
            this.reviewText = this.review;
            this.pathidx = this.pathidx;
        }
    }
}
</script>
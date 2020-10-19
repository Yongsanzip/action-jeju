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
                                         v-model="stars"
                                         @rating-selected="setCurrentSelectedRating"
                            ></star-rating>
                            <p class="rate-text">{{currentSelectedRating}}</p>
                        </div>
                        <div class="review-textarea">
                            <label>
                                <textarea placeholder="이 장소의 경험을 함께 공유해 보세요" spellcheck="false" v-model="reviewText"></textarea>
                            </label>
                        </div>
                        <div class="review-image-list">
<!--                            <div v-if="photoList.length == 0" class="add-image image-item" :class="'add-image-'+photoList.length" @click.self="addImage(photoList.length)">-->
<!--                                이미지 추가0-->
<!--                                <input type="file" class="imageFile" style="display: none;" accept="image/*" multiple/>-->
<!--                            </div>-->
                            <swiper :options="swiperOption">
                                <swiper-slide class="image-item"
                                              v-for="(photoItem, idx) in photoList"
                                              :key="idx"
                                >
                                    <div v-if="idx === 0" class="add-image image-item" :class="'add-image-'+photoList.length" @click.self="addImage(photoList.length)">
                                        이미지 추가
                                        <div class="imageFiles" style="display: none;">
                                            <input type="file" class="imageFile" style="display: none;" accept="image/*" multiple/>
                                        </div>

                                    </div>

                                    <div v-else :style="{'background-image': `url(${photoItem.src}`}" class="image-box">
                                        <button class="btn-remove" @touchstart="removeImage(photoItem.idx)" @click="removeImage(photoItem.idx)">사진삭제</button>
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
            photoList: null,
            removeFileList: null,
            removeImageList: null
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
            // console.log(idx);
            if(this.photoList.length-1 >= 10){
                //최대 10장 등록 가능
                alert("후기 사진은 최대 10장 등록 가능합니다.");
                return false;
            }

            const addImgEl = document.getElementsByClassName('imageFiles')[0];
            var imgInput = null;
            const cntImgInput = addImgEl.getElementsByClassName("imageFile").length;
            for(var i = 0; i < cntImgInput; i++){
                if(addImgEl.getElementsByClassName("imageFile")[i].files.length < 1) imgInput = addImgEl.getElementsByClassName("imageFile")[i];
            }

            const imgChangeEvnt = function(e){
                const files = e.target.files;
                const filesArr = Array.prototype.slice.call(files);
                let isOver = false;
                filesArr.forEach(function(f) {
                    if(this.photoList.length-1 >= 10){
                        //최대 10장 등록 가능
                        isOver = true;
                        return false;
                    }
                    if(!f.type.match("image.*")){
                        alert("이미지만 업로드 가능합니다.");
                        return;
                    }

                    this.photoList.push({
                        idx: idx,
                        src: URL.createObjectURL(f),
                        filename: f.name
                    });
                }.bind(this));
                imgInput.removeEventListener('change', imgChangeEvnt);

                if(isOver){
                    alert("후기 사진은 최대 10장 등록 가능합니다.");
                }

                const newFileEl = document.createElement("input");
                newFileEl.setAttribute("type", "file");
                newFileEl.setAttribute("style", "display: none");
                newFileEl.setAttribute("accept", "image/*");
                newFileEl.setAttribute("multiple", "multiple");
                newFileEl.classList.add('imageFile');

                const parentEl = document.getElementsByClassName('imageFiles')[0];
                parentEl.appendChild(newFileEl);
            }.bind(this);

            imgInput.addEventListener('change', imgChangeEvnt);
            // imgInput.click();
            imgInput.dispatchEvent(new MouseEvent("click"));
        },
        /*
        * removeImage
        * 이미지 제거
         */
        removeImage(idx){
            const removeimgItem = this.photoList.find(function(item) {
                return item.idx === idx;
            });

            if(this.removeFileList == null || this.removeFileList.length < 1) this.removeFileList = [];
            this.removeFileList.push(removeimgItem.filename);

            this.location.images.forEach(function(image){
                if(removeimgItem.filename === image.name){
                    if(this.removeImageList == null || this.removeImageList.length < 1) this.removeImageList = [];
                    this.removeImageList.push(image.idx);
                }
            }.bind(this));

            const imgItemIdx = this.photoList.indexOf(removeimgItem);
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
            postData.append('comment', this.reviewText == null? '' : this.reviewText);
            if(this.removeImageList != null && this.removeImageList.length > 0){
                postData.append('removeImages', this.removeImageList.join("&"));
            }

            const imgFileEls = document.getElementsByClassName("imageFile");
            let cnt = 0;
            for(let i=0; i<imgFileEls.length; i++){
                imgFileEls[i].files.forEach(function(file){
                    // console.log(file);
                    if(this.removeImageList == null || this.removeImageList.length < 1){
                        postData.append('images'+cnt, file);
                        cnt++;
                    }
                    else if(this.removeImageList.length > 0
                        && this.removeFileList.indexOf(file.name) < 0){
                        //업로드 취소한 이미지 제외
                        postData.append('images'+cnt, file);
                        cnt++;
                    }

                }.bind(this))
            }

            Route.writeReview(postData).then(res => {
                console.log(res.data);
                if(res.data.resultCode === "1000"){
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
        if(this.location != null) {
            this.reviewText = this.location.review;
            this.pathidx = this.location.idx;
            if(this.location.stars != null) {
                this.setCurrentSelectedRating(this.location.stars/2);
            }
            if(this.photoList == null) this.photoList = [];
            if(this.location.images != null && this.location.images.length > 0){
                this.location.images.forEach(function(image, idx){
                    if(idx === 0){
                        this.photoList.push({
                            idx: -1,
                            src: "",
                            filename: "이미지추가"
                        })
                    }
                    this.photoList.push({
                        idx: idx,
                        src: "http://img.actionjeju.com/data/user_route_after/"+image.name,
                        filename: image.name
                    });
                }.bind(this));
            }
            if(this.photoList == null || this.photoList.length < 1){
                this.photoList = [];
                this.photoList.push({
                    idx: -1,
                    src: "",
                    filename: "이미지추가"
                })
            }
        }
        else{
            this.reviewText = this.review;
            // this.pathidx = this.pathidx;
            if(this.photoList == null) this.photoList = [];
            this.photoList.push({
                idx: -1,
                src: "",
                filename: "이미지추가"
            })
        }
    }
}
</script>
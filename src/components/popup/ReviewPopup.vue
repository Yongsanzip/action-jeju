<template>
    <section class="wrap modal">
        <main class="header-mt con-route">
            <div class="overlay">
                <div class="place-review">
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
                                     @current-rating="showCurrentRating"
                                     @rating-selected="setCurrentSelectedRating"
                        ></star-rating>
                        <p class="rate-text">좋아요. 추천해요!</p>
                    </div>
                    <div class="review-textarea">
                        <textarea placeholder="이 장소의 경험을 함께 공유해 보세요" spellcheck="false" v-model="reviewText"></textarea>
                    </div>
                    <div class="review-image-list">
                        <div class="add-image image-item" :class="'add-image-'+photoList.length" @click.self="addImage(photoList.length)">
                            이미지 추가
                            <input type="file" style="display: none;" accept="image/*" />
                        </div>
                        <div v-for="(photoItem, idx) in photoList" :class="'image-item add-image-'+idx" :key="idx">
                            <div class="image-box">
                                <div class="centered">
                                    <img v-bind:src="photoItem.src" alt="">
                                </div>
                            </div>
                            <button class="btn-remove" @click="removeImage(idx)">사진삭제</button>
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

export default {
    name: 'ReviewPopup',
    components:{
        StarRating
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
        pathidx: {
            type: String,
        }
    },
    data() {
        return {
            showReview:false,
            currentRating:0,
            stars:null,
            reviewText: null
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods: {
        addImage(idx){
            const addImgEl = document.getElementsByClassName('add-image-'+idx)[0];
            const imgInput = addImgEl.getElementsByTagName("input");

            const imgChangeEvnt = function(e){
                const file = e.target.files[0];
                this.photoList.push({
                    idx: idx,
                    src: URL.createObjectURL(file)
                });
                imgInput[0].removeEventListener('change', imgChangeEvnt);
            }.bind(this);

            imgInput[0].addEventListener('change', imgChangeEvnt);
            imgInput[0].click();
        },
        removeImage(idx){
            const imgItem = this.photoList.find(function(item) {
                return item.idx === idx;
            });
            const imgItemIdx = this.photoList.indexOf(imgItem);
            if (imgItemIdx > -1) this.photoList.splice(imgItemIdx, 1);
        },
        showCurrentRating(rating){
            this.currentRating = (rating === 0) ? this.currentSelectedRating : "Click to select " + rating + " stars";
            console.log(this.pathidx);
        },
        setCurrentSelectedRating: function(rating) {
            this.currentSelectedRating = "You have Selected: " + rating + " stars";
            this.stars = rating;
            console.log(rating)
        },
        save() {
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('pathidx', this.pathidx);
            postData.append('star', this.stars * 2);
            postData.append('comment', this.reviewText);

            const images = [];
            let src;
            this.photoList.forEach(function (item) {
                src = item.src.split("/");
                images.push('/'+src.pop());
            });
            postData.append('images', images.join('&'));

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
        close() {
            EventBus.$emit("Make2", 'review', null, this.showReview);
            EventBus.$emit("PlaceView", this.showReview);
        },
    },
    created() {
        this.pathidx = this.pathidx;
    }
}
</script>
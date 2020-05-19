<template>
    <div class="card-review-wrap">
        <!-- card -->
        <div class="card-review" @click="doView(data.company_idx)">
            <div class="review-image-box">
                <img :src="`http://img.actionjeju.com/data/company_image${data.company_img}`" alt="">
            </div>
            <div class="review-contents-box">
                <p class="review-place">{{data.company_name}}</p>
                <div>
                    <div class="star_area m-star">
                        <span class="star_rating star">
                            <span :style="{width: `${(data.star*20)}%`}"></span>
                        </span>
                    </div>
                    <p class="review-score">
                        {{data.star}}
                    </p>
                    <p class="review-time">
                        {{$moment(data.reg_date).fromNow()}}
                    </p>
                </div>
                <div style="white-space: nowrap;">
                    <p class="review-text" style="width: max-content;white-space: initial;" ref="comment">{{data.comment}}</p>
                    <p class="review-text" ref="commentView"></p>
                    <a style="display: none;">더보기</a>
                </div>
            </div>
        </div>
        <!-- //card -->
    </div>
</template>
<script>
import "moment/locale/ko";
export default {
    name: 'PlaceReview',
    props:['data'],
    data(){
        return {
            reviewLines: 3,
            isLong: false
        }
    },
    methods:{
        /*
        * doView
        * 장소 화면 이동
         */
        doView(idx){
            this.$router.push(`/map/${idx}`)
        }
    },
    created() {
    },
    mounted() {
        const reviewTextEl = this.$refs.comment;
        const limitWidth = reviewTextEl.parentElement.offsetWidth;

        console.log(reviewTextEl.offsetWidth, limitWidth, limitWidth * this.reviewLines - 75);
        if (reviewTextEl.offsetWidth > limitWidth * this.reviewLines - 75){
            this.$refs.commentView.classList.add("has-overflow");
            while (reviewTextEl.offsetWidth > limitWidth * this.reviewLines - 75) {
                reviewTextEl.innerHTML = reviewTextEl.innerHTML.slice(0, -1);
            }
            this.isLong = true;
            this.$refs.commentView.nextSibling.style.display = "block"
        }
        reviewTextEl.style.display = "none";
        this.$refs.commentView.innerHTML = reviewTextEl.innerHTML.trim()
    }
}
</script>
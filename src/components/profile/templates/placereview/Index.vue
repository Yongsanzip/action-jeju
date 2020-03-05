<template>
    <div class="card-review-wrap">
        <!-- card -->
        <div class="card-review">
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
                <div>
                    <p class="review-text">{{data.comment}}</p>
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
    methods:{
    },
    created() {
    }
}
</script>
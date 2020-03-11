<template>
    <div class="comment-card">
        <div class="profile" :idx="data.tour_idx">
            <img v-if="data.tourimg != null" :src="`http://img.actionjeju.com/data/user_route_image${data.tourimg}`" alt="">
            <img v-else src="../../../../assets/images/img-dummy.png" :alt="data.tourimg">
        </div>
        <div class="review-contents">
            <div class="score-wrap">
                <div class="star_area m-star">
                                <span class="star_rating star">
                                    <span :style="{width: `${(4.5*20)}%`}"></span>
                                </span>
                </div>
                <p class="place-score">4.5</p>
            </div>
            <div>
                <p class="review-writer">{{data.mb_id}}</p>
                <p class="review-time">
                    {{$moment(data.regdt).fromNow()}}
                </p>
            </div>
            <div>
                <div class="review-text">
                    <p>{{data.after_comment}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ReviewList',
    props:['data'],
    methods: {
    }
}
</script>
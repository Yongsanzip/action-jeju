<template>
    <div class="card-route-wrap">
        <!-- card -->
        <div class="card-route">
            <div class="route-image-box">
                <img :src="`${$store.state.user_img_route}/${data.tourimg}`" alt="">
            </div>
            <div class="route-contents-box">
                <div>
                    <p class="route-name">{{data.mytourname}}</p>
                    <p class="route-write">{{data.mb_nick}}</p>
                </div>
                <p class="route-text no-word-break" ref="comment">
                    {{data.comment}}
                </p>
            </div>
            <a href="#" class="link" @click="viewReply"></a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Review',
    props:['data'],
    data() {
        return {
            commentLines: 3
        }
    },
    methods: {
        /*
        * viewReply
        * 댓글 위치로 이동
         */
        viewReply() {
            this.$router.push({
                name: 'RouteView',
                params: {
                    'id': this.data.touridx,
                    'showReply': true,
                    'replyIdx': this.data.idx
                }
            });
        }
    },
    mounted() {
        const el = this.$refs.comment;

        if (el.scrollWidth > el.offsetWidth){
            el.parentElement.classList.add("has-overflow");
        }

        if (el.scrollWidth > el.offsetWidth * this.commentLines - 70){
            while (el.scrollWidth > el.offsetWidth * this.commentLines - 70) {
                el.innerHTML = el.innerHTML.slice(0, -1);
            }
            el.parentElement.classList.add("overflow3lines");
            el.classList.remove('no-word-break');
        }

    }
}
</script>
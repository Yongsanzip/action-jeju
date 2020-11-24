<template>
    <section class="wrap modal">
        <main class="con-video">
            <button type="button" class="btn-close" @click="close">닫기</button>
            <video ref="video" controls>
                <source :src="video != null? video.movie_filename : null">
            </video>
        </main>
    </section>
</template>
<script>

export default {
    name: 'VideoPopup',
    components: {
    },
    props: {
        video: {
            type: Object,
            default: function(){ return {} }
        }
    },
    data() {
        return {
            myVideo: null,
        }
    },
    methods: {
        /*
        * close
        * 닫기 버튼 선택
         */
        close() {
            this.$parent.$emit("close-modal");
        },
        /*
        * togglePlay
        * 재생 / 일시정지 토글
         */
        togglePlay() {
            if(this.$refs.video.paused){
                this.$refs.video.play();
            }
            else this.$refs.video.pause();
        }
    },
    mounted() {
        this.$refs.video.play();
    }
}
</script>
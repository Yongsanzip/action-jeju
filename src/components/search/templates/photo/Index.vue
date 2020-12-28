<template>
    <div class="img-list"
         @click="doView(data.image_idx, data.tour_idx)"
         :style="{backgroundImage: `url(${$store.state.user_after_route}${data.name}`}"
    >
    </div>
</template>
<script>
export default {
    name: 'PhotoList',
    props:['data'],
    methods:{
        doView(image_idx, tour_idx){
            this.$router.replace({path: this.$route.path, query: {type: 'route', idx: tour_idx, text: document.querySelector("input[type=search]").value}});
            this.$router.push(`/route/${tour_idx}`).catch(err => {err})
        }
    }
}
</script>
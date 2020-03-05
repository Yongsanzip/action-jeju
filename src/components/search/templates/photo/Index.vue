<template>
    <div class="img-list"
         @click="doView(data.tour_idx)"
         :style="{backgroundImage: `url(http://img.actionjeju.com/data/user_route_after${data.image_name}`}"
    >
    </div>
</template>
<script>
export default {
    name: 'PhotoList',
    props:['data'],
    methods:{
        doView(idx){
            this.$router.push(`/map/${idx}`).catch(err => {err})
        }
    }
}
</script>
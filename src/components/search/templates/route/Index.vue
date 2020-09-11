<template>
    <div class="route-card" @click="doView(data.tour_idx)">
        <div class="card-image" :style="{backgroundImage: `url('http://img.actionjeju.com/data/user_route_image${data.tourimg}')`}"></div>
        <div class="card-contents">
            <div class="card-title">
                <p>{{data.tourname}}</p>
                <div class="like">{{data.user_like_point}}</div>
            </div>
            <div class="card-info">
                <p class="card-tern">{{data.days-1}}박 {{data.days}}일 여행</p>
                <p class="card-writer">{{data.mb_nick}}</p>
            </div>
            <div class="list-hashtag">
                <div class="hashtag" v-for="item in data.hashes" :key="item">
                    {{item}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'RouteList',
    props:['data'],
    methods:{
        doView(idx){
            this.$router.replace({path: this.$route.path, query: {type: 'route', idx: idx, text: document.querySelector("input[type=search]").value}});
            const path = `/route/${idx}`;
            if (this.$route.path !== path) this.$router.push(path).catch(err => {console.error(err)})
        }
    }
}
</script>
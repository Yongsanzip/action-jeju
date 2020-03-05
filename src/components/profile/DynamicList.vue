<template>
    <div>
        <component :is="component" :data="data" v-if="component"></component>
        <!-- card more -->
        <div class="card-more" v-show="type == 'mytravel' && count > this.listLimit" @click="showMoreList">
            <p>경로 더보기{{count}}</p>
        </div>
        <!-- //card-more -->
    </div>
</template>
<script>
export default {
    name : 'DynamicList',
    props:['data','type', 'count'],
    data(){
        return{
            component: null,
            listLimit: 30
        }
    },
    computed:{
        loader(){
            if (!this.type){
                return null
            }
            return() => import(`./templates/${this.type}/Index`)
        }
    },
    methods: {
        showMoreList(){
            this.listLimit = this.listLimit + 30;
        }
    },
    mounted() {
        this.loader()
            .then(() => {
                this.component = () => this.loader()
            })
            .catch(() => {
                this.component = () => import('./templates/mytravel/Index')
            })
    }
}
</script>
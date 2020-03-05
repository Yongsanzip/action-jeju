<template>
    <div>
        <component :is="component" :data="data" v-if="component"></component>
    </div>
</template>
<script>
export default {
    name : 'DynamicList',
    props:['data','type'],
    data(){
        return{
            component: null
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
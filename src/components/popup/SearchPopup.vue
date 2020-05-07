<template>
    <section class="wrap modal">
        <header class="header sub-header">
            <button type="button" class="close" @click="close">닫기</button>
            <h1>장소 검색</h1>
        </header>
        <div class="container con-route">
            <div class="place-wrap">
                <div class="search-form">
                    <input type="text" class="search-field" placeholder="장소를 검색하세요" v-model="searchText">
                    <button type="button" class="btn-search" @click="doSearch"></button>
                </div>
                <div class="loader" v-if="loading">Loading...</div>
                <ul class="place-list" v-if="isSearch">
                    <li v-for="(item, idx) in searchList" :key="idx">
                        <div class="place-icon"></div>
                        <div class="place-info">
                            <p class="place-name">{{item.company_name}}</p>
                            <p class="place-adress">{{item.company_addr}}</p>
                        </div>
                        <button class="btn-white" @click="doSelect(item)">선택</button>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>
<script>
import { EventBus } from "../../assets/event-bus";
import { search } from "@/api";

export default {
    name: 'SearchPopup',
    components:{
    },
    data() {
        return {
            showModal: false,
            searchText:'',
            loading:false,
            searchList:[],
            isSearch:false,
            isFirst:true,
            page:1,
        }
    },
    methods: {
        doSearch() {
            const postData = new FormData();
            postData.append('keyword', this.searchText);
            this.loading = true;
            this.searchList = [];
            search.searchPlace(postData).then(res => {
                const getResult = res.data;
                // console.log(getResult)
                //console.log(getResult)
                if (this.searchText === ''){
                    this.$alert('검색어를 입력해주세요');
                    this.loading = false;
                    return false
                }else{
                    if (getResult.searchList === null){
                        this.$alert("검색 결과가 없습니다");
                        this.loading = false;
                        return false
                    }else{
                        this.searchList = res.data.searchList;
                        this.isSearch = true;
                        this.loading = false;
                    }
                }
            }).catch(err => {
                console.error(err);
            })
        },
        infiniteHandler($state) {
            const postData = new FormData();
            if(this.isFirst && this.searchText == ""){
                $state.loaded();
                $state.complete();
            }
            else{
                postData.append('keyword', this.searchText);
                search.searchPlace(postData,{
                    params: {
                        page: this.page,
                    },
                }).then((res) => {
                    console.log(res)
                    if (res.data.searchList) {
                        this.page += 1;
                        this.searchList.push(...res.data.searchList);
                        $state.loaded();
                    } else {
                        //$state.complete();
                    }
                });
            }
        },
        doSelect(item){
            EventBus.$emit("Make2", 'place', item, this.showModal);
        },
        close() {
            EventBus.$emit("Make2", 'place', null, this.showModal);
        }
    }
}
</script>
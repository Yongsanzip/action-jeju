<template>
    <section class="wrap modal">
        <header class="header sub-header">
            <button type="button" class="close" @click="close">닫기</button>
            <h1>장소 검색</h1>
        </header>
        <div class="container con-route">
            <div class="place-wrap">
                <div class="search-form">
                    <input type="search" class="search-field" placeholder="장소를 검색하세요" v-model="searchText" @keyup="onKeyUpSearch">
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
import { search } from "@/api";

export default {
    name: 'SearchPopup',
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
        /*
        * onKeyUpSearch
        * 검색 필드 키이벤트
         */
        onKeyUpSearch(e) {
            if(e.keyCode === 13){
                //enter key
                this.doSearch();
            }
        },
        /*
        * doSearch
        * 검색 버튼 선택
         */
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
        /*
        * doSelect
        * 선택 버튼 선택
         */
        doSelect(item){
            this.$parent.$emit('Make2', 'place', item, this.showModal);
        },
        /*
        * close
        * 닫기 버튼 선택
         */
        close() {
            this.$parent.$emit("Make2", 'place', null, this.showModal);
        }
    }
}
</script>
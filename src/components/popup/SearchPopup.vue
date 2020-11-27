<template>
    <section class="wrap modal">
        <header class="header sub-header">
            <button type="button" class="close" @click="close">닫기</button>
            <h1>장소 검색</h1>
        </header>
        <div class="container con-route">
            <div class="place-wrap">
                <div class="search-form">
                    <input type="search"
                           class="search-field"
                           placeholder="장소를 검색하세요"
                           v-model="searchText"
                           @keyup="onKeyUpSearch"
                           @focus="focusOnSearchInput"
                    >
                    <button type="button" class="btn-search" @click="doSearch"></button>
                </div>
                <div class="loader" v-if="loading">Loading...</div>
                <ul class="place-list" v-if="!loading && isSearch == null">
                    <template v-if="isShowFavoriteKeywords">
                        <div class="favoriteKeyword title">인기 검색어</div>
                        <li class="favoriteKeyword" v-for="(item, idx) in favoriteKeywords" :key="idx">
                            <a @click="setKeyword(item.mysearchlist)">{{item.mysearchlist}}</a>
                        </li>
                    </template>
                    <template v-else>
                        <div class="favoritePlace title">인기 장소</div>
                        <div class="favoritePlace categories">
                            <label
                                v-for="(category, idx) in placeCategories"
                                :key="idx"
                                >
                                <input name="category" type="radio" :value="category.id" :class="{'all': category.id === 'all'}" @change="changeFavoriteCategory"><div>{{category.name}}</div>
                            </label>
                        </div>
                        <template v-if="searchList.length > 0">
                            <li class="" v-for="(item, idx) in searchList" :key="idx">
                                <div class="place-icon" :style="{'background': item.company_img != null? `url(${item.company_img}) no-repeat center` : '', 'background-size': 'cover'}"></div>
                                <div class="place-info">
                                    <p class="place-name">{{item.company_name}}</p>
                                    <p class="place-adress">{{item.company_addr}}</p>
                                </div>
                                <button class="btn-white" @click="doSelect(item)">선택</button>
                            </li>
                        </template>
                        <template v-else>
                            <div class="noResult">해당 카테고리에 대한 결과가 없습니다.</div>
                        </template>
                    </template>
                </ul>
                <ul class="place-list" v-else-if="!loading && isSearch">
                    <li v-for="(item, idx) in searchList" :key="idx">
                        <div class="place-icon" :style="{'background': item.company_img != null? `url(${item.company_img}) no-repeat center` : '', 'background-size': 'cover'}"></div>
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
            isSearch: null,
            isFirst:true,
            page:1,
            favoritePlaces: [],
            favoriteKeywords: [],
            isShowFavoriteKeywords: false,
            favoriteCategory: 'all',
            placeCategories: [{
                id: 'all',
                name: '전체'
            },{
                id: '01',
                name: '맛집'
            },{
                id: '02',
                name: '카페'
            },{
                id: '03',
                name: '숙박'
            },{
                id: '04',
                name: '체험'
            },{
                id: '05',
                name: '쇼핑'
            },{
                id: '06',
                name: '레저'
            },{
                id: '07',
                name: '트래킹'
            },{
                id: '08',
                name: '액티비티'
            },{
                id: '09',
                name: '전시'
            },{
                id: '10',
                name: '휴양'
            }]
        }
    },
    methods: {
        /*
        * getFavoriteKeyword
        * 인기검색어 조회
         */
        getFavoriteKeyword() {
            search.mySearchList().then(res=>{
                this.favoriteKeywords = res.data.mysearchdata;
            })
        },
        /*
        * getFavoritePlaceList
        * 인기 장소 조회
         */
        getFavoritePlaceList() {
            search.recentSearchList().then(res=>{
                if(res.data.searchdata_cnt != null && res.data.searchdata_cnt > 0){
                    // this.searchList = res.data.searchdata;
                    this.searchList = res.data.searchdata.map(function(item){
                        return {
                            ...item,
                            company_img: item.company_img != null ? item.company_img : null
                        }
                    });
                    this.favoritePlaces = res.data.searchdata;
                }
            })
        },
        /*
        * changeFavoriteCategory
        * 인기 장소 카테고리 선택 변경
         */
        changeFavoriteCategory(e) {
            if(e.target.value === 'all'){
                this.searchList = this.favoritePlaces;
                return;
            }
            this.searchList = this.favoritePlaces.filter(function(place){
                return place.company_cate === e.target.value;
            })
        },
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
        focusOnSearchInput() {
            this.isShowFavoriteKeywords = true;
        },
        setKeyword(keyWord){
            this.isShowFavoriteKeywords = false;
            this.searchText = keyWord;
            this.doSearch();
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
                this.isSearch = true;

                const getResult = res.data;
                // console.log(getResult)
                //console.log(getResult)
                if (this.searchText === ''){
                    this.$alert('검색어를 입력해주세요');
                }else{
                    if (getResult.searchList === null || getResult.searchList.length < 1){
                        this.$alert("검색 결과가 없습니다");
                    }else{
                        this.searchList = res.data.searchList.map(function(item){
                            return {
                                ...item,
                                company_img: item.company_img != null && item.company_img.length > 0? item.company_img[0] : null
                            }
                        });
                    }
                }
                this.loading = false;
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
    },
    created() {
        this.getFavoriteKeyword();
        this.getFavoritePlaceList();
    }
}
</script>
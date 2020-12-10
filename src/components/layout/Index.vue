<template>
    <div class="root" :class="{openSearch: isActive}">
        <router-view :key="$route.fullPath"></router-view>
<!--        <div v-if="isSearch" style="width: 100%; height: 100%;position: absolute;top: 0;"></div>-->
        <div class="con-search">
            <!--{{slideChk}}-->
            <div class="search-surface">
                <div class="slide-drawer" :class="slideChk" v-show="slideChk === 0"></div>
                <div class="slide-drawer" :class="slideChk" v-show="slideChk === 1" v-hammer:swipe="doSlide"></div>
                <div class="slide-drawer" :class="slideChk" v-show="slideChk === 2" v-hammer:swipe="doSlide"></div>
                <div class="search-form" v-show="slideChk < 2">
                    <label>
                        <input type="search" v-on:keyup.enter="clickSearch()" class="search-field" :placeholder="searchTitle" v-model="searchText">
                    </label>
                    <div class="favoriteKeyword" v-if="$route.query.text == null">
                        <div>인기 검색어</div>
                        <ul>
                            <li v-for="(word, idx) in favoriteKeywords.slice(0, 3)" :key="idx" @click="setSearchKeyword(word.mysearchlist)">{{word.mysearchlist}}</li>
                        </ul>
                    </div>
                </div>
                <!-- search result -->
                <div class="search-result-box" v-if="isSearch">
                    <p class="search-keyword">
                        <span v-text="$route.query.text"></span>
                        검색결과
                        <button class="btn-close" @click="closeSearch()"></button>
                    </p>
                    <ul class="search-category">
                        <li v-for="(item,index) in tabList"
                            :key="item.text"
                            :class="{ active : el_Active === index }"
                        >
                            <button type="button" @click="clickSearch(item.type)"><span>{{item.text}}</span></button>
                        </li>
                    </ul>
                    <!-- search result -->
                    <div class="search-result-list" :class="{fullOpen : slideChk === 2, noResult: searchList.length === 0}" ref="searchList">
                        <template v-if="type === 'place' && searchList != null && searchList.length > 0">
                            <div class="regist-place">
                                <button class="regist-place-btn" @click="showRegistPlaceModal">장소추가</button>
                            </div>
                        </template>
                        <div class="loader" v-if="loading">Loading...</div>
                        <template v-if="searchList != null && searchList.length > 0">
                            <div v-for="(item, idx) in searchList" :key="idx" :class="setClass(item)">
                                <dynamic-list :data="item" :type="type"></dynamic-list>
                            </div>
                        </template>
                        <template v-else >
                            <div class="no-result">
                                <div>
                                    <button v-if="type === 'route'" @click="doNavAction(navList[2])">여행경로 만들기</button>
                                    <button v-else @click="showRegistPlaceModal">새로운 장소 등록</button>
                                </div>
                                <div class="description">
                                    <template v-if="type === 'route'">찾으시는 여행경로가 없다면 액션제주에서<br/>직접 만들어 보세요 :)</template>
                                    <template v-else>찾으시는 장소가 없다면 액션제주에<br/>직접 알려주세요 :)</template>
                                </div>
                            </div>
                        </template>
                    </div>
                    <!-- //search result -->
                </div>
                <!-- //search-result -->
            </div>
        </div>
        <nav class="navigation">
            <ul>
                <li v-for="(nav, index) in navList" :key="index">
                    <div @click="doNavAction(nav)" :class="[nav.class, {active : ($route.fullPath === nav.path && !isActive) || (nav.class === 'nav-search' && isActive)}]">{{nav.text}}</div>
                </li>
            </ul>
        </nav>
        <place-make v-if="isshowRegistPlaceModal"></place-make>
    </div>
</template>

<script>
import { EventBus } from "../../assets/event-bus";
import { search } from "@/api";
import DynamicList from "../search/DynamicList";
import PlaceMake from "../make/placeMake";

export default {
    name: "Index",
    components: {PlaceMake, DynamicList},
    data(){
      return{
          isActive : false,
          slideChk:0,
          navActive: 1,
          el_Active: 0,
          isSearch: false,
          searchText: '',
          searchList:[],
          type:'route',
          loading:false,
          searchTitle: null,
          tabList:[
              {text: '여행경로' , type: 'route'},
              {text: '장소', type: 'place'},
              {text: '사진' , type: 'photo'},
              {text: '후기' , type: 'review'},
          ],
          navList:[
              {text: '홈', path : '/main', class : 'nav-home'},
              {text: '여행경로', path : '/route', class : 'nav-route'},
              {text: '경로작성', path : '/make', class : 'nav-write'},
              {text: '검색', path : '', class : 'nav-search'},
              {text: '프로필', path : '/profile', class : 'nav-profile'},
          ],
          isshowRegistPlaceModal: false,
          favoriteKeywords: [],
      }
    },
    methods:{
        getFavoriteKeywords() {
            search.mySearchList().then(res=>{
                this.favoriteKeywords = res.data.mysearchdata;
            })
        },
        showRegistPlaceModal(){
            this.isshowRegistPlaceModal = true;
        },
        setClass(item){
            const type = this.tabList[this.el_Active].type;
            let classList = [];

            if(type === 'route' && item.tour_idx != null) classList.push("route__list");
            else if(type === 'place' && item.company_idx != null) classList.push("place__list");
            else if(item.image_name != null) classList.push("photo__list");

            return classList.join(" ");
        },
        /*
        * getSearchTitle
        * 검색키워드(placeholder) 조회
         */
        getSearchTitle(){
            if(!this.isActive){
                this.$store.dispatch('SAVE_IS_SHOW_LOADING', true);
                const postData = new FormData;
                postData.append('request_code', 'mainTitleSearch');
                search.searchMainTitle(postData).then(res => {
                    // console.log(res.data)
                    this.searchTitle = res.data.searches.name;
                    this.isActive = true;
                    this.$store.dispatch('SAVE_IS_SHOW_LOADING', false);

                    if(this.$route.query.text != null && this.$route.query.text !== ''){
                        this.searchText = this.$route.query.text;
                        this.doSearch(this.$route.query.type != null? this.$route.query.type : null);
                    }
                }).catch(err => {
                    console.error(err);
                })
            }
            else{
                this.closeSearch();
            }
        },
        /*
        * openSearch
        * 검색 화면 표시
         */
        openSearch(navActive){
            //this.isActive = !this.isActive;
            if (navActive !== 3){
                this.isActive = !this.isActive;
            }else{
                this.isActive = true;
            }
        },
        /*
        * doSlide
        * 검색 화면 크기 조절
         */
        doSlide(e){
            if(e.angle > 0){
                //down
                this.slidedown();
            }
            else{
                //up
                this.slideUp();
            }
        },
        /*
        * slideUp
        * 검색 화면 사이즈 up
         */
        slideUp(){
            this.slideChk = 2;
            this.$forceUpdate();
        },
        /*
        * slidedown
        * 검색 화면 사이즈 down
         */
        slidedown(){
            this.slideChk = 1;
            this.$forceUpdate();
        },
        /*
        * closeSearch
        * 검색 화면 숨김
         */
        closeSearch(){
            if(this.$route.query.text != null && this.$route.query.text !== '') {
                this.$router.replace({
                    path: '/map'
                });
            }
            else{
                this.isActive = false;
                this.slideChk = 0;
                this.isSearch = false;
                this.searchText = '';
                this.type = 'route';
                if (this.isSearch){
                    this.slideChk = 1;
                }else{
                    this.slideChk = 0;
                }
                this.$forceUpdate();
            }
        },
        setSearchKeyword(keyword) {
            this.searchText = keyword;
            this.clickSearch();
        },
        /*
        * clickSearch
        * 선택한 검색 탭 적용
         */
        clickSearch(type = this.tabList[this.el_Active].type){
            if (this.searchText === ""){
                this.$alert("검색어를 입력해주세요");
                return false;
            }else{
                this.searchList = [];
                this.navActive = 3;

                if (this.$route.fullPath.indexOf("/map") < 0){
                    this.$router.push({
                        path: '/map',
                        query: {
                            type: this.type,
                            text: this.searchText
                        }
                    })
                }
                else if(this.$route.fullPath.indexOf("/map") > -1 && this.$route.params["id"] != null){
                    this.$router.replace({
                        path: '/map',
                        query: {
                            type: this.type,
                            text: this.searchText,
                        }
                    })
                }
                else{
                    this.$router.replace({
                        path: '/map',
                        query: {
                            type: type,
                            text: this.searchText
                        }
                    })
                }
            }
        },
        /*
        * doSearch
        * 입력한 검색어를 선택된 검색 탭에서 검색
         */
        doSearch(type = this.tabList[this.el_Active].type) {
            if (type) this.type = type;
            this.el_Active = this.tabList.findIndex(tab => tab.type === this.type);

            if (this.searchText === ""){
                this.$store.dispatch('SAVE_IS_SHOW_LOADING', false);
                this.$alert("검색어를 입력해주세요");
                return false;
            }
            else{
                this.$store.dispatch('SAVE_IS_SHOW_LOADING', true);
                this.loading = true;
                this.searchList = [];
                this.navActive = 3;
                if(event != null) event.preventDefault();
                document.getElementsByClassName("search-field")[0].blur();

                EventBus.$emit("insertGps", this.searchText);

                const postData = new FormData();
                postData.append('keyword', this.searchText);
                postData.append('type', this.type);
                if (this.type === 'route' || this.type ==='photo' || this.type ==='review'){
                    search.search(postData).then(res => {
                        if (res.data.searchList == null){
                            // this.$alert("검색 결과가 없습니다");
                            this.searchList = [];
                            this.isSearch = true;
                            this.loading = false;
                            if(this.slideChk < 1) this.slideChk = 1;
                            //return false
                        }else{
                            this.searchList = res.data.searchList;
                            this.isSearch = true;
                            this.loading = false;
                            if(this.slideChk < 1) this.slideChk = 1;

                            this.$forceUpdate();

                            //하이라이트
                            this.$nextTick(function(){
                                if(this.$route.query.idx != null && this.$route.query.idx !== ''){
                                    if(this.type === 'route'){
                                        this.doFocusOnSelectedSearchItem(this.searchList.findIndex(searchItem => Number(searchItem.tour_idx) === Number(this.$route.query.idx)));
                                    }
                                    else if(this.type === 'photo'){
                                        this.doFocusOnSelectedSearchItem(this.searchList.findIndex(searchItem => Number(searchItem.image_idx) === Number(this.$route.query.idx)));
                                    }
                                }
                            });
                        }
                        this.setMapInformation();
                        this.$store.dispatch('SAVE_IS_SHOW_LOADING', false);
                    }).catch(err => {
                        console.error(err);
                    })
                }
                else if (this.type ==='place'){
                    const postData = new FormData();
                    postData.append('keyword', this.searchText);

                    search.searchPlace(postData).then(res => {
                        const getResult = res.data;
                        if (getResult.searchCnt === 0){
                            // this.$alert("검색 결과가 없습니다");
                            this.searchList = [];
                            this.isSearch = true;
                            this.loading = false;
                            if(this.slideChk < 1) this.slideChk = 1;
                            this.$store.dispatch('SAVE_IS_SHOW_LOADING', false);
                            return false
                        }else{
                            this.searchList = res.data.searchList;
                            this.isSearch = true;
                            this.loading = false;
                            if(this.slideChk < 1) this.slideChk = 1;
                            this.$forceUpdate();

                            this.$nextTick(function(){
                                if(this.$route.query.idx != null && this.$route.query.idx !== ''){
                                    this.doFocusOnSelectedSearchItem(this.searchList.findIndex(searchItem => Number(searchItem.company_idx) === Number(this.$route.query.idx)));
                                }
                            });
                        }
                        this.setMapInformation();
                        this.$store.dispatch('SAVE_IS_SHOW_LOADING', false);
                    }).catch(err => {
                        console.error(err);
                    })
                }
            }
        },
        doFocusOnSelectedSearchItem(idx){
            if(idx < 0) return false;

            if(document.getElementsByClassName("search-result-list").length > 0 && document.getElementsByClassName("search-result-list")[0].children.length > 0){
                document.getElementsByClassName("search-result-list")[0].scrollTo({top: document.getElementsByClassName("search-result-list")[0].children[idx].offsetTop, left: 0, behavior: 'smooth'})
            }
        },
        /*
        * doNavAction
        * 선택한 하단 메뉴 화면으로 이동
         */
        doNavAction(nav){
            const idx = this.navList.indexOf(nav);
            if (idx === 3){
                this.getSearchTitle();
            }else{
                this.closeSearch();
                if(nav.path && nav.path !== this.$route.fullPath) this.$router.push(nav.path)
            }
        },
        /*
        * setMapInformation
        * 현재 검색 결과 지도화면에 적용
         */
        setMapInformation(){
            this.$nextTick(() => {
                let placeList = this.searchList;
                placeList.forEach(function(place, idx){
                    placeList[idx].option = {
                        'category': place.category,
                        'company_idx': place.company_idx
                    }
                });
                EventBus.$emit("Map", placeList);
            });
        }
    },
    created() {
        this.getFavoriteKeywords();
        if(this.$route.fullPath.indexOf("/map") > -1 && this.$route.query.type != null && this.$route.query.type !== ''){
            this.getSearchTitle();
        }

        //index.vue 컴포넌트 생성시 마다 EventBus 중복 생성으로 인한 search.php api 중복 호출 방지
        EventBus.$off("Index");
        EventBus.$once("Index", (hashName, type, isActive) => {
            this.isActive = isActive;
            this.setSearchKeyword(hashName);
            // this.clickSearch('route');
        });

        this.$on("close-place-make", function(){
            this.isshowRegistPlaceModal = false;
        }.bind(this));
        this.$on("research", function(){
           this.doSearch();
        });
    }
}
</script>

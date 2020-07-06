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
                    <input type="text" v-on:keyup.enter="clickSearch()" class="search-field" :placeholder="searchTitle" v-model="searchText">
                </div>
                <!-- search result -->
                <div class="search-result-box" v-if="isSearch">
                    <p class="search-keyword">
                        <span>{{searchText}}</span>
                        검색결과
                        <button class="btn-close" @click="closeSearch()"></button>
                    </p>
                    <ul class="search-category">
                        <li v-for="(item,index) in tabList"
                            :key="item.text"
                            :class="{ active : el_Active === index }"
                            @click="el_Active = index"
                        >
                            <button type="button" @click="doSearch(item.type)"><span>{{item.text}}</span></button>
                        </li>
                    </ul>
                    <!-- search result -->
                    <div class="search-result-list" :class="{fullOpen : slideChk === 2}" ref="searchList">
                        <div class="loader" v-if="loading">Loading...</div>
                        <div v-for="(item, idx) in searchList" :key="idx" :class="{photo__list : item.image_name}">
                            <dynamic-list :data="item" :type="type"></dynamic-list>
                        </div>
                    </div>
                    <!-- //search result -->
                </div>
                <!-- //search-result -->
            </div>
        </div>
        <nav class="navigation">
            <ul>
                <li v-for="(nav, index) in navList" :key="index">
                    <button type="button" @click="doNavAction(nav)" :ref="nav.class">
                        <p :class="[nav.class, {active : ($route.fullPath === nav.path && !isActive) || (nav.class == 'nav-search' && isActive)}]">{{nav.text}}</p>
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import { EventBus } from "../../assets/event-bus";
import { search } from "@/api";
import DynamicList from "../search/DynamicList";

export default {
    name: "Index",
    components: {DynamicList},
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
          ]
      }
    },
    methods:{
        /*
        * getSearchTitle
        * 검색키워드(placeholder) 조회
         */
        getSearchTitle(){
            const postData = new FormData;
            postData.append('request_code', 'mainTitleSearch');
            search.searchMainTitle(postData).then(res => {
                // console.log(res.data)
                this.searchTitle = res.data.searches.name;
                (this.isActive) ? this.isActive = false : this.isActive = true
            }).catch(err => {
                console.error(err);
            })
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
                if (type) this.type = type;
                this.loading = true;
                this.searchList = [];
                this.navActive = 3;

                if (this.$route.fullPath.indexOf("/map") < 0 ||
                    (this.$route.fullPath.indexOf("/map") > -1 && this.$route.params["id"] != null)){
                    this.$router.push({
                        name: 'mapComp',
                        params: {
                            searchText: this.searchText
                        }
                    });
                }
                else{
                    this.doSearch(type);
                }
            }
        },
        /*
        * doSearch
        * 입력한 검색어를 선택된 검색 탭에서 검색
         */
        doSearch(type = this.tabList[this.el_Active].type) {
            if (this.searchText === ""){
                this.$alert("검색어를 입력해주세요");
                return false;
            }
            else{
                if (type) this.type = type;
                this.loading = true;
                this.searchList = [];
                this.navActive = 3;
                if(event != null) event.preventDefault();
                document.getElementsByClassName("search-field")[0].blur();

                const postData = new FormData();
                postData.append('keyword', this.searchText);
                postData.append('type', this.type);
                if (this.type == 'route' || this.type =='photo' || this.type =='review'){
                    //console.log('여행경로')
                    search.search(postData).then(res => {
                        // console.log(getResult)
                        // console.log(getResult.result_code)
                        if (res.data.searchList == null){
                            this.$alert("검색 결과가 없습니다");
                            this.searchList = [];
                            this.isSearch = true;
                            this.loading = false;
                            if(this.slideChk < 1) this.slideChk = 1;
                            //return false
                        }else{
                            this.el_Active = this.tabList.findIndex(tab => tab.type == this.type);
                            this.searchList = res.data.searchList;
                            this.isSearch = true;
                            this.loading = false;
                            if(this.slideChk < 1) this.slideChk = 1;
                        }
                        this.setMapInformation();
                    }).catch(err => {
                        console.error(err);
                    })
                }
                else if (this.type =='place'){
                    //console.log('장소')
                    const postData = new FormData();
                    postData.append('keyword', this.searchText);

                    search.searchPlace(postData).then(res => {
                        const getResult = res.data;
                        if (getResult.searchCnt === 0){
                            this.$alert("검색 결과가 없습니다");
                            this.searchList = [];
                            this.isSearch = true;
                            this.loading = false;
                            if(this.slideChk < 1) this.slideChk = 1;
                            return false
                        }else{
                            this.searchList = res.data.searchList;
                            this.isSearch = true;
                            this.loading = false;
                            if(this.slideChk < 1) this.slideChk = 1;
                        }
                        this.setMapInformation();
                    }).catch(err => {
                        console.error(err);
                    })
                }
            }
        },
        /*
        * doNavAction
        * 선택한 하단 메뉴 화면으로 이동
         */
        doNavAction(nav){
            const idx = this.navList.indexOf(nav);
            //console.log(idx);
            if (idx === 3){
                this.getSearchTitle();
            }else{
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
        EventBus.$on("Index", (hashName, type, isActive) => {
            this.searchText = hashName;
            this.type = type;
            this.isActive = isActive;
            this.clickSearch('route');

            //index.vue 컴포넌트 생성시 마다 EventBus 중복 생성으로 인한 search.php api 중복 호출 방지
            EventBus.$off("Index");
        });
    }

}
</script>

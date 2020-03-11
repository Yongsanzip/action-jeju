<template>
    <div class="root" :class="{openSearch: isActive}">
        <router-view :key="$route.fullPath"></router-view>
        <div class="con-search">
            <!--{{slideChk}}-->
            <div class="search-surface">
                <div class="slide-drawer" v-if="slideChk === 0" v-hammer:swipe.down="closeSearch"></div>
                <div class="slide-drawer" v-if="slideChk === 1" v-hammer:swipe.up="slideUp"></div>
                <div class="slide-drawer" v-if="slideChk === 2" v-hammer:swipe.down="slidedown"></div>
                <div class="search-form">
                    <input type="text" v-on:keyup.enter="clickSearch()" class="search-field" placeholder="요즘 핫한 애월카페는 어디?" v-model="searchText">
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
                        <p :class="[nav.class, {active : $route.fullPath === nav.path}]">{{nav.text}}</p>
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
        closeSearch(){
            this.isActive = false;
            this.slideChk = 0;
            if (this.isSearch){
                this.slideChk = 1;
            }else{
                this.slideChk = 0;
            }
        },
        slideUp(){
          this.slideChk = 2;
        },
        slidedown(){
            this.slideChk = 1;
        },
        doNavAction(nav){
            const idx = this.navList.indexOf(nav);
            //console.log(idx);
            if (idx === 3){
                (this.isActive) ? this.isActive = false : this.isActive = true
            }else{
                if(nav.path && nav.path !== this.$route.fullPath) this.$router.push(nav.path)
            }
        },
        openSearch(navActive){
            //this.isActive = !this.isActive;
            if (navActive !== 3){
                this.isActive = !this.isActive;
            }else{
                this.isActive = true;
            }
        },
        clickSearch(type = this.tabList[this.el_Active].type){
            if (this.searchText === ""){
                this.$alert("검색어를 입력해주세요");
                return false;
            }else{
                if (type) this.type = type;
                this.loading = true;
                this.searchList = [];
                this.navActive = 3;

                if (this.$route.fullPath.indexOf("/map") < 0){
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
                            this.isSearch = false;
                            this.loading = false;
                            this.slideChk = 0;
                            this.el_Active = 0;
                            //return false
                        }else{
                            this.el_Active = this.tabList.findIndex(tab => tab.type == this.type);
                            this.searchList = res.data.searchList;
                            this.isSearch = true;
                            this.loading = false;
                            this.slideChk = 1;
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
                            this.isSearch = false;
                            this.loading = false;
                            this.slideChk = 0;
                            this.el_Active = 0;
                            return false
                        }else{
                            this.searchList = res.data.searchList;
                            this.isSearch = true;
                            this.loading = false;
                            this.slideChk = 1;
                        }
                        this.setMapInformation();
                    }).catch(err => {
                        console.error(err);
                    })
                }
            }
        },
        doScrollToTarget(el){
            console.log(el);
        },
        setMapInformation(){
            this.$nextTick(() => {
                EventBus.$emit("Map", this.searchList);
            });
        }
    },
    created() {
        EventBus.$on("Index", (hashName, type, isActive) => {
            this.searchText = hashName;
            this.type = type;
            this.isActive = isActive;
            this.clickSearch('route');
        });
        EventBus.$on("scrollToTarget", (el) => {
           this.doScrollToTarget(el);
        });
    },

}
</script>

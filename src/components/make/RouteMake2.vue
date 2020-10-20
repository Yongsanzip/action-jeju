<template>
    <section class="wrap">
        <header class="header sub-header">
            <router-link to="/main" class="close">이전</router-link>
            <h1>여행경로 만들기</h1>
<!--            <h1>{{(isTitle)? '여행경로 수정' : '여행경로 만들기'}}</h1>-->
            <button type="button" class="next" @click="complete">완료</button>
        </header>
        <div class="container con-route con-route-make" :class="{ 'overflow-y' : isReview === true}">
            <div class="route-map" style="margin-top: 0;" :style="{height: Math.floor(mapHeights[slideChk]) + 'px'}">
                <!-- map -->
                <naver-maps
                        :height="mapHeights[0]"
                        :width="mapWidth"
                        :map-options="mapOptions"
                        :initLayers="initLayers"
                        @load="onLoadMap"
                >
                </naver-maps>
                <div class="slide-drawer" :class="slideChk" v-show="slideChk === 0" v-hammer:swipe="doSlide"></div>
                <div class="slide-drawer" :class="slideChk" v-show="slideChk === 1" v-hammer:swipe="doSlide"></div>
                <div class="slide-drawer" :class="slideChk" v-show="slideChk === 2" v-hammer:swipe="doSlide"></div>
                <!-- //map -->
            </div>
            <div>
                <div class="route-wrap">
                    <div class="route-header">
                        <div>
                            <h3 class="route-title" v-if="isTitle">{{getTitle}}</h3>
                            <button class="btn-edit-info" v-if="isTitle" @click="doEditRouteInfo">여행정보 수정</button>
                        </div>
                        <div>
                            <p class="route-date">
                                {{$moment(edate).diff($moment(sdate), 'days')}}박 {{$moment(edate).diff($moment(sdate), 'days')+1}}일
                                ({{sdate}} - {{this.$moment(edate).format('MM-DD')}})
                            </p>
                            <button class="btn-edit-route" @click="doEditRouteOrder">경로편집</button>
                        </div>
                    </div>
                    <div class="route-contents">
                        <!-- route item -->
                        <draggable v-bind="dragOptionsDays" :list="locationList" :sort="false">
                        <div class="route-item" v-for="(date, dateIdx) in dateList" :idx="dateIdx" :key="dateIdx">
                            <div class="travel-header">
                                <div class="travel-day noto-sans">D-{{dateIdx+1}}</div>
                                <p class="travel-title">여행 {{dateIdx+1}}일차</p>
                                <p class="travel-date noto-sans">{{date.fulldate}}</p>
                            </div>
                            <ul class="travel-list">
                                <draggable v-bind="dragOptions" :class="{'edit-route-block': isEditRoute}" :sort="isEditRoute" :list="locationList[dateIdx]" @end="updateLocationListOrder">
                                    <li v-for="(item, idx) in locationList[dateIdx]" :idx="idx" :key="idx" :class="'edit-route-item '+date.date" >
                                        <div class="place-number">{{idx+1}}</div>
                                        <p class="place-name" @click="writeReview(date.fulldate2, item)">{{item.company_name}}</p>
                                        <p class="place-time">{{item.distance_data}} {{item.duration_data}}</p>
                                        <button v-if="isEditRoute" class="btn-close" @touchstart="deletePlace($event, dateIdx, idx)" @click="deletePlace($event, dateIdx, idx)">장소제거</button>
                                        <div class="travel-contents" v-if="!isEditRoute">
                                            <p class="review-text">
                                                {{item.review}}
                                            </p>
                                            <div class="review-image-list" v-if="item.images != null && item.images.length > 0">
                                                <div class="review-image" v-for="(imgItem, imgIdx) in item.images" :key="imgIdx">
                                                    <img :src="`http://img.actionjeju.com/data/user_route_after/${imgItem.name}`" alt="">
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </draggable>
                            </ul>
                            <div class="btn-wrap" v-if="!isEditRoute">
                                <button class="btn-white" @click="addRoute(dateIdx)">장소추가</button>
                            </div>
                        </div>
                        </draggable>
                        <!-- //route item -->
                    </div>
                </div>
            </div>
        </div>
        <div class="btns">
            <!-- 입력완료시 active 클래스 추가 -->
            <a class="btn-step active" @click="complete">
                완료
            </a>
        </div>
        <transition name="fade">
            <modal-search v-if="showModal"/>
            <ReviewPopup v-if="isReview"
                         :location="selectedLocation"
                         :title="selectedLocation.company_name"
                         :review="selectedLocation.review"
                         :pathidx="selectedLocation.idx"/>
        </transition>
    </section>
</template>
<script>
import {mapGetters} from 'vuex';
import ModalSearch from "../popup/SearchPopup";
// import { EventBus } from "../../assets/event-bus";
import { Route } from "@/api";
import "moment/locale/ko";
import ReviewPopup from "../popup/ReviewPopup";
import draggable from 'vuedraggable'

export default {
    name: 'Make2',
    components:{
        ModalSearch,
        ReviewPopup,
        draggable
    },
    props: {
        title: {
            type: String,
        },
        sdate:{
            type: String,
        },
        edate:{
            type:String
        },
        touridx:{
            type: Number
        }
    },
    data(){
        return{
            isDiff: false,
            isEditRoute: false,
            isReview:false,
            showModal:false,
            getTitle:'',
            isTitle:true,
            marker: null,
            map: null,
            routeList: [],
            dateList:[],
            locationList:[],
            selectedDateIdx:null,
            dataArr:[],
            slideChk: 0,
            mapOptions: {
                lat: 33.3811822578,
                lng: 126.5585367973,
                zoom: 9,
                zoomControl: false,
                scaleControl: false,
                logoControl: true,
                logoControlOptions: {
                    position: -10
                },
                mapTypeControl: false,
                mapDataControl: false
            },
            mapWidth: 0,
            mapHeight: 159,
            mapHeights: [159, 370, 547],
            initLayers: ['BACKGROUND', 'BACKGROUND_DETAIL', 'POI_KOREAN', 'TRANSIT', 'ENGLISH', 'CHINESE', 'JAPANESE'],
            selectedLocation: null
        }
    },
    computed: {
        dragOptionsDays() {
            return {
                animation: 0,
                group: "description",
                disabled: true,
            };
        },
        dragOptions() {
            return {
                animation: 0,
                group: "description",
                disabled: !this.isEditRoute,
            };
        },
        ...mapGetters(['GET_MB_ID'])
    },
    methods: {
        updateLocationListOrder() {
            this.$forceUpdate();
        },
        setMapSetting() {
            this.mapWidth = window.innerWidth;
            this.mapHeight = this.mapHeights[this.slideChk];
            if(this.map != null){
                this.map.setSize({width: this.mapWidth, height: this.mapHeight});
            }
        },
        /*
        * onLoadMap
        * 네이버 지도 컴포넌트 로드 완료 시 마커 표시
         */
        onLoadMap(vue){
            this.mapWidth = document.body.offsetWidth;
            this.map = vue;
        },
        /*
        * doSlide
        * 지도 크기 조절
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
        * 지도 크기 작게
         */
        slideUp(){
            if(this.slideChk <= 0) return true;
            this.slideChk = this.slideChk - 1;
            this.setMapSetting();
        },
        /*
        * slidedown
        * 지도 크기 크게
         */
        slidedown(){
            if(this.slideChk > 1) return true;
            this.slideChk = this.slideChk + 1;
            this.setMapSetting();
        },
        /*
        * addRoute
        * 장소추가 버튼 선택
         */
        addRoute(selectedDateIdx){
            this.selectedDateIdx = selectedDateIdx;
            this.showModal = true;
        },
        /*
        * doEditRouteInfo
        * RouteMake.vue 화면으로 이동 (여행경로 제목, 인원수, 여행일자 수정 화면)
         */
        doEditRouteInfo(){
            this.$parent.isChk = false;
        },
        /*
        * doEditRouteOrder
        * 경로편집 버튼 선택
        * 일정 순서 변경 가능 상태 토글
         */
        doEditRouteOrder(){
            this.isEditRoute=!this.isEditRoute;
        },
        /*
        * deletePlace
        * 장소 제거
         */
        deletePlace(e, dateIdx, locateIdx){
            e.stopPropagation();
            e.preventDefault();

            const editRouteItem = document.getElementsByClassName("edit-route-item "+this.dateList[dateIdx]["date"]);
            const locationList = this.locationList[dateIdx];
            let changedLocationList = [];
            editRouteItem.forEach(function(el, i){
                if(i !== locateIdx) changedLocationList.push(locationList[el.getAttribute("idx")]);
            });
            this.locationList[dateIdx] = changedLocationList;
            this.$forceUpdate();
            this.isDiff = true;
        },
        /*
        * getDateList
        * 여행 기간 정보 셋팅
         */
        getDateList(){
            // Usage
            let dt = this.sdate;
            const endDate = this.edate;
            while (dt <= endDate) {
                const dt_date = new Date(dt);

                this.dateList.push({
                    fulldate: this.$moment(dt_date).format('YYYY.MM.DD'),
                    fulldate2: this.$moment(dt_date).format('YYYY-MM-DD'),
                    date: dt_date.getDate()
                });
                this.locationList[dt] = [];

                dt_date.setDate(dt_date.getDate() + 1);
                dt = this.$moment(dt_date).format('YYYY-MM-DD');
            }
        },
        /*
        * getRouteDetail
        * 여행경로 상세 정보 셋팅
         */
        getRouteDetail() {
            const postData = new FormData;
            postData.append('tour_idx', this.touridx);
            postData.append('mb_id', this.GET_MB_ID);
            Route.routeListDetail(postData).then(res => {
                this.getTitle = res.data.tourInfo.name;
                this.locationList = [];
                this.routeList = [];

                this.dateList.forEach(function(item, idx){
                    this.locationList[idx] = [];
                }.bind(this));

                if(res.data.days != null){
                    this.routeList = res.data.days;
                    res.data.days.forEach(function(item){
                        if(item.day > this.locationList.length && item.path != null) {
                            item.path.forEach(function(pathItem){
                                if(this.locationList[this.locationList.length - 1] == null) this.locationList[this.locationList.length - 1] = [];
                                this.locationList[this.locationList.length - 1].push(pathItem);
                            }.bind(this))
                        }
                        else {
                            this.locationList[item.day - 1] = item.path;
                        }
                    }.bind(this));
                }
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * setRouteDetail
        * 여행경로 상세 정보 저장
         */
        setRouteDetail(callback = null){
            let is_full_days_location = true;
            this.locationList.forEach(function (locations) {
                if(locations == null || locations.length < 1) is_full_days_location = false;
            });
            if(!is_full_days_location) {
                this.$alert('모든 여행 일자에 여행 장소를 추가해주세요.');
                return;
            }

            const postData = new FormData();
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('touridx', this.touridx);

            let detailArr = [];
            this.dateList.forEach(function(dateItem, dateIdx){
                for(let i=0; i<this.locationList[dateIdx].length; i++){
                    if(this.locationList[dateIdx][i] != null) detailArr.push(dateItem.fulldate2+"/"+this.locationList[dateIdx][i].company_idx);
                }
            }.bind(this));
            postData.append('details', detailArr.join("&"));

            Route.saveRouteDetail(postData).then(res => {
                console.log(res.data);
                this.getRouteDetail();
                this.isDiff = false;
                if(callback != null) {
                    callback();
                }
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * writeReview
        * 장소 후기 작성 팝업 표시
         */
        writeReview(date, location){
            if(this.isEditRoute) return;
            this.isReview = true;
            this.selectedLocation = location;
        },
        /*
        * complete
        * 완료 버튼 선택
         */
        complete() {
            this.setRouteDetail(function(){
                this.$router.push("/route/" + this.touridx);
            }.bind(this));

        }
    },
    created() {
        this.mapHeights = [159, window.outerHeight*0.5, window.outerHeight*0.8];
        this.setMapSetting();
        window.addEventListener("resize", this.setMapSetting);

        /*
        * 장소 검색 및 후기 작성 팝업 닫을 때 여행경로 상세 정보 재조회
         */
        this.$on("Make2", function(path, item, props) {
            if(path === 'place'){
                this.showModal = props;
                if(item != null){
                    if(this.locationList[this.selectedDateIdx] == null) this.locationList[this.selectedDateIdx] = [];
                    this.locationList[this.selectedDateIdx].push(item);
                    // this.setRouteDetail();
                }
            }
            else if(path === 'review'){
                this.isReview = props;
                if(item === true) this.getRouteDetail();
            }
        });
        this.getTitle = this.title;
        this.getDateList();
        this.getRouteDetail();
    },
    destroyed() {
        this.$off("Make2");
        window.removeEventListener("resize", this.setMapSetting);
    }
}
</script>
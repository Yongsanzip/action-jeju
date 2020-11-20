<template>
    <section class="wrap">
        <header class="header sub-header">
            <h1>여행경로 만들기</h1>
<!--            <h1>{{(isTitle)? '여행경로 수정' : '여행경로 만들기'}}</h1>-->
            <button class="close" @click="close">이전</button>
        </header>
        <div class="container con-route con-route-make" :class="{ 'overflow-y' : isReview === true || showModal === true}">
            <div class="route-map" style="margin-top: 0;" :style="{height: Math.floor(mapHeights[slideChk]) + 'px'}">
                <!-- map -->
                <naver-maps
                        :height="mapHeights[0]"
                        :width="mapWidth"
                        :map-options="mapOptions"
                        :initLayers="initLayers"
                        @load="onLoadMap"
                >
                    <template v-for="(pathList, idx) in mapMarkList">
                        <naver-marker v-for="(path, pathIdx) in pathList" :otherOptions="path" :key="idx + '-' + pathIdx" :lat="path.lat" :lng="path.lng" @load="onMarkerLoaded">
                        </naver-marker>
                    </template>

                    <template v-for="(polyline, idx) in polylineList">
                        <naver-polyline :path="polyline" :tour-day="polylineOrder[idx]" :key="'polyline_'+idx" @load="onPolylineLoaded" />
                    </template>
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
        },
        isNew: {
            type: Boolean,
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
            mapMarkList: [],
            polylineList: [],
            polylineOrder: [],
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
        /*
        * updateLocationListOrder
        * 장소 순서 변경
         */
        updateLocationListOrder() {
            this.isDiff = true;
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
            if(this.dateList != null) this.drawMapMarker();
        },
        /*
        * drawMapMarker
        * 여행 일정 별 장소 정보와 이동 동선 정보를 얻어 마커 표시 및 폴리라인 조회 위한 데이터 준비
         */
        drawMapMarker(){
            if(this.locationList.length < 1 || this.dateList.length < 1) {
                return;
            }

            let polylineData = {};
            this.dateList.forEach(function(day, dayIdx) {
                let markerList = [];
                this.locationList[dayIdx].forEach(function(path, pathIdx){
                    polylineData.tour_day = dayIdx;
                    markerList.push({
                        day: dayIdx + 1,
                        title: pathIdx,
                        lat: Number(path.lat),
                        lng: Number(path.long)
                    });

                    if(dayIdx > 0 && pathIdx === 0){
                        polylineData.start = polylineData.end;
                        polylineData.end = {
                            'lat': path.lat,
                            'lng': path.long
                        };
                        this.getPolyLine(polylineData);
                    }
                    if(pathIdx > 0){
                        polylineData.start = {
                            'lat': this.locationList[dayIdx][pathIdx-1].lat,
                            'lng': this.locationList[dayIdx][pathIdx-1].long
                        };
                        polylineData.end = {
                            'lat': path.lat,
                            'lng': path.long
                        };
                        this.getPolyLine(polylineData);
                    }
                    else if(pathIdx === this.locationList[dayIdx].length - 1){
                        polylineData.end = {
                            'lat': path.lat,
                            'lng': path.long
                        };
                    }

                }.bind(this));

                this.mapMarkList.push(markerList);

            }.bind(this));
        },
        /*
        * getPolyLine
        * 폴리라인 목록 조회
         */
        getPolyLine(data){
            const postData = new FormData;
            postData.append('tour_day', data.tour_day);
            postData.append('s_lat', data.start.lat);
            postData.append('s_lon', data.start.lng);
            postData.append('e_lat', data.end.lat);
            postData.append('e_lon', data.end.lng);
            Route.routeDrivePath(postData).then(res => {
                const points = res.data.points;
                points.forEach(function(point){
                    point.lng = point.lon;
                });
                this.polylineList.push(points);
                this.polylineOrder[this.polylineList.length-1] = postData.get("tour_day");
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * onMarkerLoaded
        * 이동 장소 별 마커 로드 완료 시 해당 장소의 여행일, 동선 순서 순으로 마커 이미지 표시
         */
        onMarkerLoaded(marker){
            const markerIcon = document.createElement('div');
            markerIcon.classList.add('markerContent');
            markerIcon.title = marker.otherOptions.day+"일차";
            const routeMarker = document.createElement('div');
            routeMarker.classList.add('routeMarker');
            routeMarker.classList.add('day'+ (marker.otherOptions.day%10 === 0? 10 : marker.otherOptions.day%10));
            markerIcon.appendChild( routeMarker );

            const routeMarkerTitle = document.createElement('div');
            routeMarkerTitle.classList.add('order_number');
            routeMarkerTitle.innerText = marker.otherOptions.title+1;
            routeMarker.appendChild( routeMarkerTitle );

            marker.setIcon({
                content: markerIcon
            });
            marker.setCursor('');
        },
        /*
        * onPolylineLoaded
        * 폴리라인 로드 완료 시 여행일자 별 색상 표시
         */
        onPolylineLoaded(polyline){
            const tourDay = Number(polyline.$el.getAttribute("tour-day")) % 3;
            let strokeColor = '#00c7c9';
            switch (tourDay) {
                case 1:
                    strokeColor = '#5899fb';
                    break;
                case 2:
                    strokeColor = '#f3645a';
                    break;
                default:
                    strokeColor = '#00c7c9';
                    break;
            }
            polyline.setOptions({
                strokeWeight: '3',
                strokeColor: strokeColor
            });
            polyline.map = this.map;
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

                dt_date.setDate(dt_date.getDate() + 1);
                dt = this.$moment(dt_date).format('YYYY-MM-DD');
            }
        },
        /*
        * getRouteDetail
        * 여행경로 상세 정보 셋팅
         */
        getRouteDetail() {
            this.$store.dispatch('SAVE_IS_SHOW_LOADING', true);
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

                if(this.map != null) this.drawMapMarker();
                this.$store.dispatch('SAVE_IS_SHOW_LOADING', false);
            }).catch(err => {
                console.error(err);
                this.$store.dispatch('SAVE_IS_SHOW_LOADING', false);
            })
        },
        /*
        * saveRouteDetail
        * 여행경로 상세 정보 저장
         */
        saveRouteDetail(callback = null){
            this.$store.dispatch('SAVE_IS_SHOW_LOADING', true);
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
                this.$store.dispatch('SAVE_IS_SHOW_LOADING', false);
            }).catch(err => {
                console.error(err);
                this.$store.dispatch('SAVE_IS_SHOW_LOADING', false);
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
        * close
        * 닫기 버튼 선택
         */
        close() {
            if(this.isDiff || this.isNew) {
                console.log(this.isNew);
                console.log(this.isDiff);
                //
                // //변경된 내용 존재
                // //신규 작성 경로 && 작성 내용 없음
                this.$confirm("현재 작성한 경로를 저장하지 않고 화면을 닫으시겠습니까?").then(()=> {
                    if(this.isNew){
                        const postData = new FormData;
                        postData.append('mb_id', this.GET_MB_ID);
                        postData.append('tour_idx', this.touridx);
                        Route.deleteRoute(postData).then(res => {
                            console.log(res.data);
                            this.$router.go(-1);
                        }).catch(err => {
                            console.error(err);
                        })
                    }
                    else {
                        this.$router.go(-1);
                    }
                })
            }
            else {
                this.$router.go(-1);
            }
        },
        /*
        * complete
        * 완료 버튼 선택
         */
        complete() {
            let is_full_days_location = true;
            this.locationList.forEach(function (locations) {
                if(locations == null || locations.length < 1) is_full_days_location = false;
            });
            if(!is_full_days_location) {
                this.$alert('모든 여행 일자에 여행 장소를 추가해주세요.');
                return;
            }

            this.saveRouteDetail(function(){
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
                if(item != null){
                    if(this.locationList[this.selectedDateIdx] == null) this.locationList[this.selectedDateIdx] = [];
                    this.locationList[this.selectedDateIdx].push(item);
                    this.saveRouteDetail(function(){
                        this.showModal = props;
                        this.isDiff = true;
                    }.bind(this));
                    return;
                }
                this.showModal = props;
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
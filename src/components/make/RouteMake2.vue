<template>
    <section class="wrap">
        <header class="header sub-header" style="z-index: 1;">
            <router-link to="/main" class="close">이전</router-link>
            <h1>{{(isTitle)? '여행경로 수정' : '여행경로 만들기'}}</h1>
            <button type="button" class="next" @click="complete">완료</button>
        </header>
        <div class="container con-route overflow-y">
            <div class="route-map" style="margin-top: 0;">
                <!-- map -->
                <naver-maps
                        :width="mapSettings.width"
                        :height="mapSettings.height"
                        :initLayers="['BACKGROUND', 'BACKGROUND_DETAIL', 'BYCYCLE', 'CADASTRAL', 'CTT', 'HIKING_TRAIL', 'PANORAMA', 'POI_KOREAN', 'TRANSIT']"
                        :mapOptions="mapOptions"
                >
                </naver-maps>
                <!-- //map -->
            </div>
            <div class="all-route-wrap">
                <div class="route-wrap">
                    <div class="route-header">
                        <div>
                            <h3 class="route-title" v-if="isTitle">{{getTitle}}</h3>
                            <button class="btn-edit-info" v-if="isTitle" @click="doEditRouteInfo">여행정보 수정</button>
                            <input type="text" v-if="!isTitle" v-model="getTitle">
                            <button class="btn-edit-info" v-if="!isTitle" @click="doApply">여행정보 확인</button>
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
                        <div class="route-item" v-for="(date, dateIdx) in dateList" :idx="dateIdx" :key="dateIdx">
                            <div class="travel-header">
                                <div class="travel-day noto-sans">D-{{dateIdx+1}}</div>
                                <p class="travel-title">여행 {{dateIdx+1}}일차</p>
                                <p class="travel-date noto-sans">{{date.fulldate}}</p>
                            </div>
                            <ul class="travel-list">
                                <template v-if="!isEditRoute">
                                    <li v-for="(item, idx) in locationList[date.fulldate2]" :key="idx" :idx="idx">
                                        <div class="place-number noto-sans">{{idx+1}}</div>
                                        <p class="place-name" @click="writeReview(date.fulldate2, item)">{{item.company_name}}</p>
                                        <p class="place-time"></p>
                                        <div class="travel-contents">
                                            <!-- add travel this -->
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
                                </template>
                                <template v-if="isEditRoute">
                                    <draggable class="edit-route-block"  draggable=".edit-route-item">
                                        <li v-for="(item, idx) in locationList[date.fulldate2]" :key="idx" :idx="idx" :class="'edit-route-item '+date.date">
                                            <div class="place-number">{{idx+1}}</div>
                                            <p class="place-name" @click="writeReview(date.fulldate2, item)">{{item.company_name}}</p>
                                            <p class="place-time">약 1시간 55분 소요</p>
                                            <button class="btn-close" @click="deletePlace($event, dateIdx, idx)">장소제거</button>
                                        </li>
                                    </draggable >
                                </template>

                            </ul>
                            <div class="btn-wrap" v-if="!isEditRoute">
                                <button class="btn-white" @click="addRoute(date.fulldate2)">장소추가</button>
                            </div>
                        </div>
                        <!-- //route item -->
                    </div>
                </div>
                <transition name="fade">
                    <ReviewPopup v-if="isReview"
                                 :title="selectedLocation.company_name"
                                 :review="selectedLocation.review"
                                 :pathidx="selectedLocation.idx"/>
                </transition>
                <div>
                    <!-- 입력완료시 active 클래스 추가 -->
                    <a class="btn-step active" @click="complete">
                        완료
                    </a>
                </div>
            </div>
        </div>
        <modal-search v-if="showModal" :date="selectedDate"/>
    </section>
</template>
<script>
import {mapGetters} from 'vuex';
import ModalSearch from "../popup/SearchPopup";
import { EventBus } from "../../assets/event-bus";
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
            dateList:[],
            locationList:[],
            selectedDate:null,
            dataArr:[],
            mapOptions: {
                lat: 33.38,
                lng: 126.56,
                zoom: 6,
                zoomControl: false,
                scaleControl: false,
                logoControl: true,
                logoControlOptions: {
                    position: -10
                },
                mapTypeControl: false,
                mapDataControl: false
            },
            mapSettings:{
                width:0,
                height:0
            },
            selectedLocation: null
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
        addRoute(selectedDate){
            console.log("selectedDate::", selectedDate);
            this.selectedDate = selectedDate;
            this.showModal = true;
        },
        doEditRouteInfo(){
            console.log(this.touridx);
            console.log(this);
            this.$parent.isChk = false;
        },
        doEditRouteOrder(){
            let locationOrder = null;
            let routeItems = null;
            if(this.isEditRoute){
                if(this.dateList != null){
                    this.dateList.forEach(function(date){
                        routeItems = document.getElementsByClassName("edit-route-item "+date.date);
                        if(routeItems.length < 1) return;

                        locationOrder = [];
                        routeItems.forEach(function(routeItem){
                            locationOrder.push(this.locationList[date.fulldate2][routeItem.getAttribute("idx")]);
                        }.bind(this));

                        this.locationList[date.fulldate2] = locationOrder;
                    }.bind(this))

                    this.setRouteDetail();
                }
                // console.log(this.locationList);
            }
            this.isEditRoute=!this.isEditRoute;
        },
        deletePlace(e, dateIdx, locateIdx){
            const editRouteItem = document.getElementsByClassName("edit-route-item "+this.dateList[dateIdx]["date"]);
            const locationList = this.locationList[this.dateList[dateIdx]["fulldate2"]];
            let changedLocationList = [];
            editRouteItem.forEach(function(el, i){
                if(i != locateIdx) changedLocationList.push(locationList[el.getAttribute("idx")]);
            });
            this.locationList[this.dateList[dateIdx]["fulldate2"]] = changedLocationList;
            this.$forceUpdate();
            this.isDiff = true;
            // document.getElementsByClassName("edit-route-item "+this.dateList[dateIdx]["date"])[locateIdx].remove();
        },
        doApply(){
            if (this.getTitle.replace(/^\s+|\s+$/g, '' ) === "" || this.getTitle === ''){
                this.$alert('제목을 입력해 주세요.')
                return false
            }else{
                this.isTitle = true;
            }
        },
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
        getRouteDetail() {
            const postData = new FormData;
            postData.append('tour_idx', this.touridx);
            Route.routeListDetail(postData).then(res => {
                //console.log(res.data)
                // this.tourInfo = res.data.tourInfo;
                // this.days = res.data.days;

                this.getTitle = res.data.tourInfo.name;
                this.locationList = [];

                this.dateList.forEach(function(item){
                    this.locationList[item.fulldate2] = [];
                }.bind(this));

                if(res.data.days != null){
                    res.data.days.forEach(function(item){
                        this.locationList[item.date] = item.path;
                    }.bind(this));
                }
            }).catch(err => {
                console.error(err);
            })
        },
        setRouteDetail(){
            const postData = new FormData();
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('touridx', this.touridx);

            console.log(this.locationList);

            let detailArr = [];
            this.dateList.forEach(function(dateItem){
                for(let i=0; i<this.locationList[dateItem.fulldate2].length; i++){
                    if(this.locationList[dateItem.fulldate2][i] != null) detailArr.push(dateItem.fulldate2+"/"+this.locationList[dateItem.fulldate2][i].company_idx);
                }
            }.bind(this));
            //console.log("detailArr::", detailArr);
            postData.append('details', detailArr.join("&"));

            Route.saveRouteDetail(postData).then(res => {
                console.log(res.data);
                this.getRouteDetail();
                this.isDiff = false;
            }).catch(err => {
                console.error(err);
            })
        },
        writeReview(date, location){
            // console.log(date, location);
            this.isReview = true;
            this.selectedLocation = location;
        },
        complete() {
            this.$router.push("/route/" + this.touridx);
        }
    },
    created() {
        this.mapSettings.width = window.innerWidth;
        this.mapSettings.height = window.innerHeight;

        EventBus.$on("Make2", (path, item, props) => {
            if(path == 'place'){
                this.showModal = props;
                if(item != null){
                    if(this.locationList[this.selectedDate] != null && item != null){
                        this.locationList[this.selectedDate].push(item);
                        console.log(3, this.locationList);
                    }
                    this.setRouteDetail();
                    return;
                }
            }
            else if(path == 'review'){
                this.isReview = props;
                if(item === true) this.getRouteDetail();
                return;
            }
        });
        this.getTitle = this.title;
        this.touridx = this.touridx;
        this.getDateList();
        this.getRouteDetail();
    }
}
</script>
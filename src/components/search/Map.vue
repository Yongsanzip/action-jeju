<template>
    <section class="wrap con-map">
        <div class="post-wrap">
            <div class="post-header">
                <a @click="close" class="prev">이전</a>
<!--                <button class="btn-more">메뉴</button>-->
            </div>
            <div class="map-wrap">
                <naver-maps
                        :width="mapSettings.width"
                        :height="mapSettings.height"
                        :initLayers="['BACKGROUND', 'BACKGROUND_DETAIL', 'BYCYCLE', 'CADASTRAL', 'CTT', 'HIKING_TRAIL', 'PANORAMA', 'POI_KOREAN', 'TRANSIT']"
                        :mapOptions="mapOptions"
                        @load="onLoadMap"
                >
                    <naver-marker v-for="(item, idx) in mapMarkerList" :key="idx"
                                  :lat="Number(item.latitude)"
                                  :lng="Number(item.longitude)"
                                  :otherOptions = "item.option"
                                  @click="onMarkerClicked"
                                  @load="onMarkerLoaded"
                    />
                </naver-maps>
                <div v-if="isPopup" class="btn-map-block">
                    <button class="btn-map" @click="close">지도접기 <img src="../../assets/images/svg/ic-triangle-down-white.svg"></button>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { EventBus } from "../../assets/event-bus";
import jejuIcon from '../../assets/images/svg/map/cate_00.svg';
import restaurantIcon from '../../assets/images/svg/map/cate_01.svg';
import coffeeIcon from '../../assets/images/svg/map/cate_02.svg';
import museumIcon from '../../assets/images/svg/map/cate_03.svg';
import concertIcon from '../../assets/images/svg/map/cate_04.svg';
import shopIcon from '../../assets/images/svg/map/cate_05.svg';
import golfIcon from '../../assets/images/svg/map/cate_06.svg';
import hikeIcon from '../../assets/images/svg/map/cate_07.svg';
import surfIcon from '../../assets/images/svg/map/cate_08.svg';
import galleryIcon from '../../assets/images/svg/map/cate_09.svg';
import beachIcon from '../../assets/images/svg/map/cate_10.svg';

import jejuIconActive from '../../assets/images/svg/map/map_marker00.svg';
import restaurantIconActive from '../../assets/images/svg/map/map_marker01.svg';
import coffeeIconActive from '../../assets/images/svg/map/map_marker02.svg';
import museumIconActive from '../../assets/images/svg/map/map_marker03.svg';
import concertIconActive from '../../assets/images/svg/map/map_marker04.svg';
import shopIconActive from '../../assets/images/svg/map/map_marker05.svg';
import golfIconActive from '../../assets/images/svg/map/map_marker06.svg';
import hikeIconActive from '../../assets/images/svg/map/map_marker07.svg';
import surfIconActive from '../../assets/images/svg/map/map_marker08.svg';
import galleryIconActive from '../../assets/images/svg/map/map_marker09.svg';
import beachIconActive from '../../assets/images/svg/map/map_marker10.svg';

export default {
    name: "Map",
    props: {
        mapOptions: {
            type: Object,
            default: function(){ return {
                lat: 33.0811822578,
                lng: 126.5585367973,
                zoom: 9,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                logoControl: true,
                logoControlOptions: {
                    position: -10
                },
                mapDataControl: false
            }}
        },
        markPlace: {
            type: Array
        },
        isPopup: {
            type: Boolean,
            default: false
        },
        searchText: {
            type: String,
            default: null
        }
    },
    data(){
        return{
            map: null,
            mapMarkerList: [],
            mapMarkers: [],
            placeList:[],
            info: false,
            jejuIcon: jejuIcon,
            restaurantIcon: restaurantIcon,
            coffeeIcon: coffeeIcon,
            museumIcon: museumIcon,
            concertIcon: concertIcon,
            shopIcon: shopIcon,
            golfIcon: golfIcon,
            hikeIcon: hikeIcon,
            surfIcon: surfIcon,
            galleryIcon: galleryIcon,
            beachIcon: beachIcon,

            jejuIconActive: jejuIconActive,
            restaurantIconActive: restaurantIconActive,
            coffeeIconActive: coffeeIconActive,
            museumIconActive: museumIconActive,
            concertIconActive: concertIconActive,
            shopIconActive: shopIconActive,
            golfIconActive: golfIconActive,
            hikeIconActive: hikeIconActive,
            surfIconActive: surfIconActive,
            galleryIconActive: galleryIconActive,
            beachIconActive: beachIconActive,
            count: 1,
            selectedMarker: null,
            mapSettings:{
                width:0,
                height:0
            }
        }
    },
    methods:{
        setMapSetting() {
            this.mapSettings.width = window.innerWidth;
            this.mapSettings.height = (window.innerHeight - 60);
            if(this.map != null){
                this.map.setSize(this.mapSettings);
            }
        },
        onLoadMap(vue){
            this.map = vue;
            this.mapMarkerList = this.placeList;
        },
        onMarkerClicked(evnt){
            const markerIcon = document.createElement('img');
            markerIcon.classList.add('markerIcon');
            markerIcon.classList.add('marker-'+evnt.overlay.category);
            markerIcon.src = this.getMarkerIcon(evnt.overlay.category, false);

            if(this.selectedMarker != null){
                //선택해제
                this.selectedMarker.setIcon({
                    content: markerIcon
                });
            }

            if(evnt == null) return false;
            const activeMarkerIcon = document.createElement('img');
            activeMarkerIcon.classList.add('markerIcon');
            activeMarkerIcon.classList.add('marker-'+evnt.overlay.category);
            activeMarkerIcon.src = this.getMarkerIcon(evnt.overlay.category, true);
            // activeMarkerIcon.innerText = evnt.overlay.category;
            evnt.overlay.setIcon({
                content: activeMarkerIcon
            });
            this.selectedMarker = evnt.overlay;

            //선택한 마커 항목으로 검색결과 목록 스크롤 이동
            if(evnt.overlay.company_idx != null
            && document.getElementsByClassName("search-result-list").length > 0
            && document.getElementsByClassName("search-result-list")[0].getElementsByClassName('idx-'+evnt.overlay.company_idx) != null
            && document.getElementsByClassName("search-result-list")[0].getElementsByClassName('idx-'+evnt.overlay.company_idx).length > 0){
                document.getElementsByClassName("search-result-list")[0].scrollTo({
                    top: document.getElementsByClassName("search-result-list")[0].getElementsByClassName('idx-'+evnt.overlay.company_idx)[0].parentElement.offsetTop-10,
                    left: 0,
                    behavior: "smooth"
                });
            }
        },
        onMarkerLoaded(marker) {
            if(marker.otherOptions.category == null){
                // marker.onRemove();
                return false;
            }
            this.mapMarkers.push(marker);
            const markerIcon = document.createElement('img');
            markerIcon.classList.add('markerIcon');
            markerIcon.src = (this.isPopup)? this.getMarkerIcon(marker.otherOptions.category, true) : this.getMarkerIcon(marker.otherOptions.category, false);
            markerIcon.innerText = marker.otherOptions.company_idx;

            marker.setIcon({
                content: markerIcon
            });
            marker.setCursor('');
        },
        getMarkerIcon(category, isActive){
            let val = this.jejuIcon;
            if(isActive) val = this.jejuIconActive;

            switch (category) {
                case 'map_01':
                    //맛집
                    val = this.restaurantIcon;
                    if(isActive) val = this.restaurantIconActive;
                    break;
                case 'map_02':
                    //카페
                    val = this.coffeeIcon;
                    if(isActive) val = this.coffeeIconActive;
                    break;
                case 'map_03':
                    //숙박
                    val = this.museumIcon;
                    if(isActive) val = this.museumIconActive;
                    break;
                case 'map_04':
                    //체험
                    val = this.concertIcon;
                    if(isActive) val = this.concertIconActive;
                    break;
                case 'map_05':
                    //쇼핑
                    val = this.shopIcon;
                    if(isActive) val = this.shopIconActive;
                    break;
                case 'map_06':
                    //레저
                    val = this.golfIcon;
                    if(isActive) val = this.golfIconActive;
                    break;
                case 'map_07':
                    //트래킹
                    val = this.hikeIcon;
                    if(isActive) val = this.hikeIconActive;
                    break;
                case 'map_08':
                    //액티비티
                    val = this.surfIcon;
                    if(isActive) val = this.surfIconActive;
                    break;
                case 'map_09':
                    //전시
                    val = this.galleryIcon;
                    if(isActive) val = this.galleryIconActive;
                    break;
                case 'map_10':
                    //휴양
                    val = this.beachIcon;
                    if(isActive) val = this.beachIconActive;
                    break;
            }
            return val;
        },
        close(){
            if(this.markPlace != null){
                EventBus.$emit("PlaceView", false);
            }
            else{
                history.back();
            }
        }
    },
    created() {
        this.setMapSetting();
        window.addEventListener("resize", this.setMapSetting);

        if(this.markPlace != null){
            this.placeList = this.markPlace;
        }

        if(this.searchText != null){
            EventBus.$emit("Index", this.searchText, 'route', true);
        }

        EventBus.$on("Map", (getList) => {
            if(this.mapMarkers != null && this.mapMarkers.length > 0){
                this.mapMarkers.forEach(function(marker){
                    marker.onRemove();
                });
                this.mapMarkers = [];
            }

            this.placeList = getList;
            if(this.map != null){
                // this.map.loadNaverMapsComponents();
                if(this.placeList.length > 0){
                    this.placeList.forEach(function(place){
                        this.mapMarkerList.push(place);
                    }.bind(this))
                }
            }
            EventBus.$off("Map");
        })
    },
    destroyed() {
        window.removeEventListener("resize", this.setMapSetting);
    }
}
</script>

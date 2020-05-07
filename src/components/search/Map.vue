<template>
    <section class="wrap con-map">
        <div class="post-wrap">
            <div class="post-header">
                <a @click="close" class="prev">이전</a>
                <button class="btn-more">메뉴</button>
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
import customIcon from '../../assets/images/svg/marker.svg';
import customIconActive from '../../assets/images/svg/map/map_marker02.svg';

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
            placeList:[],
            info: false,
            icon: customIcon,
            iconActive: customIconActive,
            count: 1,
            selectedMarker: null,
            mapSettings:{
                width:0,
                height:0
            }
        }
    },
    methods:{
        onLoadMap(vue){
            this.map = vue;
            this.mapMarkerList = this.placeList;
        },
        onMarkerClicked(evnt){
            const markerIcon = document.createElement('img');
            markerIcon.classList.add('markerIcon');
            markerIcon.src = this.icon;

            if(this.selectedMarker != null){
                //선택해제
                this.selectedMarker.setIcon({
                    content: markerIcon
                });
            }

            if(evnt == null) return false;
            markerIcon.src = this.iconActive;
            evnt.overlay.setIcon({
                content: markerIcon
            });
            this.selectedMarker = evnt.overlay;
        },
        onMarkerLoaded(marker) {
            const markerIcon = document.createElement('img');
            markerIcon.classList.add('markerIcon');
            markerIcon.src = (this.isPopup)? this.iconActive : this.icon;

            marker.setIcon({
                content: markerIcon
            });
            marker.setCursor('');
        },
        close(){
            EventBus.$emit("PlaceView", false);
        }
    },
    created() {
        this.mapSettings.width = window.innerWidth;
        this.mapSettings.height = (window.innerHeight - 60);

        if(this.markPlace != null){
            this.placeList = this.markPlace;
        }

        if(this.searchText != null){
            EventBus.$emit("Index", this.searchText, 'route', true);
        }

        EventBus.$on("Map", (getList) => {
            this.placeList = getList;
            if(this.map != null){
                this.mapMarkerList = this.placeList;
            }
        })
    }
}
</script>

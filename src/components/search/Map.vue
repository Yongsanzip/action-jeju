<template>
    <section class="wrap" style="height:100%">
        <div class="map-wrap">
            <naver-maps
                    :width="mapSettings.width"
                    :height="mapSettings.height"
                    :initLayers="['BACKGROUND', 'BACKGROUND_DETAIL', 'BYCYCLE', 'CADASTRAL', 'CTT', 'HIKING_TRAIL', 'PANORAMA', 'POI_KOREAN', 'TRANSIT']"
                    :mapOptions="mapOptions"
            >
                <naver-marker v-for="(item, idx) in placeList" :key="idx"
                              :lat="Number(item.latitude)"
                              :lng="Number(item.longitude)"
                              @click="onMarkerClicked"
                              @load="onMarkerLoaded"
                />
            </naver-maps>
            <div v-if="isPopup">
                <button class="btn-map" @click="close">지도접기 ▼</button>
            </div>
        </div>
    </section>
</template>
<script>
import { EventBus } from "../../assets/event-bus";
import customIcon from '../../assets/images/svg/marker.svg';
import customIconActive from '../../assets/images/map_02_on.png';

export default {
    name: "Map",
    props: {
        mapOptions: {
            type: Object,
            default: function(){ return {
                lat: 33.38,
                lng: 126.56,
                zoom: 6,
                zoomControl: false,
                mapTypeControl: false,
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
            placeList:[],
            info: false,
            icon: customIcon,
            iconActive: customIconActive,
            count: 1,
            selectedMarker: null,
            marker: null,
            mapSettings:{
                width:0,
                height:0
            }
        }
    },
    methods:{
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
        })
    }
}
</script>

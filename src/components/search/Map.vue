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
                              @click="onMarkerClicked(item.company_idx)"
                              @load="onMarkerLoaded"
                />
            </naver-maps>
        </div>
    </section>
</template>
<script>
import { EventBus } from "../../assets/event-bus";
import customIcon from '../../assets/images/svg/marker.svg';
import customIconActive from '../../assets/images/map_02_on.png';

export default {
    name: "Map",
    data(){
        return{
            placeList:[],
            info: false,
            icon: customIcon,
            iconActive: customIconActive,
            count: 1,
            marker: null,
            mapOptions: {
                lat: 33.38,
                lng: 126.56,
                zoom: 6,
                zoomControl: false,
                mapTypeControl: false,
            },
            mapSettings:{
                width:0,
                height:0
            }
        }
    },
    methods:{
        onMarkerClicked(idx){
            //EventBus.$emit("PlaceList", idx);
            console.log(idx);
        },
        onMarkerLoaded(vue) {
            const {marker} = vue;
            //console.dir(marker.eventTarget)
            marker.eventTarget.width = 32;
            marker.eventTarget.height = 32;
            this.marker = marker;
            this.marker.setIcon({
                url: this.icon,
                size: {
                    width: 32,
                    height: 32
                }
            });
        }
    },
    created() {
        this.mapSettings.width = window.innerWidth;
        this.mapSettings.height = (window.innerHeight - 60);

        EventBus.$on("Map", (getList) => {
            this.placeList = getList;
        })
    }
}
</script>

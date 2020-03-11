<template>
    <div class="wrap">
        <main class="con-route">
            <!-- class:sticky toggle -->
            <div v-if="!isReply">
                <div class="post-wrap" :class="{sticky : isSticky}">
                    <div class="post-header">
                        <div class="text-box">
                            <p class="post-title">{{tourInfo.name}}</p>
                            <p class="post-route-date">{{tourInfo.days-1}}박 {{tourInfo.days}}일 여행</p>
                        </div>
                        <a href="javascript:history.back()" class="prev">이전</a>
                        <button class="btn-more" @click="isShowMenu=true">메뉴</button>
                    </div>
                    <div class="post-cover" v-if="!isSticky" :style="{backgroundImage: `url(http://img.actionjeju.com/data/user_route_image${tourInfo.image}`}">
                        <button class="btn-map" @click="openMap">지도보기 ▲</button>
                        <h2 class="post-title">{{tourInfo.name}}</h2>
                        <p class="post-date">{{tourInfo.days-1}}박 {{tourInfo.days}}일 여행</p>
                        <p class="post-write">{{tourInfo.nick}}</p>
                    </div>
                    <div class="route-map" v-if="isSticky" :height="mapHeights[0]+'px'">
                        <!--<button class="btn-draw">맵 드로어</button>-->
                        <naver-maps
                                :height="mapHeights[mapHeights.length-1]"
                                :width="mapWidth"
                                :map-options="mapOptions"
                                :initLayers="initLayers"
                                @load="onLoadMap"
                        >

                            <template v-for="(pathList, idx) in mapMarkList">
                                <naver-marker v-for="(path, pathIdx) in pathList" :otherOptions="path" :key="idx + '-' + pathIdx" :lat="path.lat" :lng="path.lng" @load="onMarkerLoaded">
                                </naver-marker>
                            </template>
                            <template v-if="polylineList != null">
                                <naver-polyline v-for="(polyline, idx) in polylineList" :options="polylineOpt[idx]" :path="polyline" :key="'polyline_'+idx" strokeColor="#ff0000" fillColor="#ff0000" @load="onPolylineLoaded" />
                            </template>
                        </naver-maps>
                        <button class="btn-map-size" @click="changeMapSize">지도</button>
                    </div>
                </div>
                <!-- map -->

                <!-- //map -->
                <div class="route-wrap">
                    <div class="route-contents">
                        <div class="hashtag-list">
                            <div class="hashtag">제주혼행</div>
                            <div class="hashtag">제주혼행</div>
                            <div class="hashtag">제주혼행</div>
                        </div>
                        <!-- route item -->
                        <div class="route-item" v-for="(item, idx) in days" :key="idx">
                            <div class="travel-header">
                                <div class="travel-day">D-{{item.day}}</div>
                                <p class="travel-title">여행 {{item.day}}일차</p>
                                <p class="travel-date">{{item.date}}</p>
                            </div>
                            <ul class="travel-list">
                                <li v-for="(path, pathIdx) in item.path" :key="pathIdx">
                                    <div class="place-number">{{pathIdx+1}}</div>
                                    <p class="place-name">{{path.company_name}}</p>
                                    <p class="place-time"></p>
                                    <div class="travel-contents">
                                        <div class="review-text" @click="doViewAllReviewText($event, idx, pathIdx)">
                                            <p>{{path.review}}</p>
                                        </div>
                                        <div class="review-image-list" v-show="path.images != null">
                                            <div class="review-image" v-for="(image, imgIdx) in path.images" :key="imgIdx">
    <!--                                            <img src="../../assets/images/img-dummy.png" alt="">-->
                                                <img :src="`http://img.actionjeju.com/data/user_route_after${image.name}`" alt="">
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <!-- //route item -->
                        <ul class="post-menu-list">
                            <li>
                                <label class="btn-like">
                                    <input type="checkbox" :checked="isLike" @change="setLike">
                                    <div class="shape"></div>
                                </label>
                                <p v-if="tourInfo.user_like_count >= 999">999+</p>
                                <p v-else>{{tourInfo.user_like_count}}</p>
                            </li>
                            <li>
                                <label class="btn-favorite">
                                    <input type="checkbox" :checked="isFavorites" @change="setFavorites">
                                    <div class="shape"></div>
                                </label>
                                <p v-if="tourInfo.zzim_count >= 999">999+</p>
                                <p v-else>{{tourInfo.zzim_count}}</p>
                            </li>
                            <li>
                                <button type="button" class="btn-comment" @click="doReply"></button>
                                <p v-if="tourInfo.reply_count >= 999">999+</p>
                                <p v-else>{{tourInfo.reply_count}}</p>
                            </li>
                            <li>
                                <button class="btn-share">공유</button>
                                <p>공유하기</p>
                            </li>
                        </ul>
                        <a href="" class="btn-get-route">경로 가져오기</a>
                    </div>
                </div>
                <div class="comment-wrap" v-if="tourInfo.reply_count > 0">
                    <div>
                        <p class="title">댓글 {{tourInfo.reply_count}}</p>
                        <a class="write-comment" @click="isReply=true">댓글쓰기</a>
                    </div>
                    <div class="comment-list">
                        <!-- card -->
                        <div class="comment-card" v-for="(item, idx) in replyList" :key="idx">
                            <div class="comment-profile">
                                <img src="../../assets/images/img-dummy.png" alt="">
                            </div>
                            <div class="comment-box">
                                <div>
                                    <p class="comment-name">{{item.mb_nick}}</p>
                                    <p class="comment-time">{{item.getReg}}</p>
                                    <button class="btn-more">메뉴</button>
                                </div>
                                <div @click="doViewReply($event, idx)">
                                    <p class="comment-text">
                                        {{item.comment}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <!-- //card -->
                    </div>
                    <div class="comment-footer">
                        <a class="all-comment" @click="isReply=true">댓글 전체보기</a>
                    </div>

                </div>
                <div class="comment-wrap no-comment" v-else>
                    <div>
                        <p class="title">댓글이 없습니다</p>
                        <a class="write-comment" @click="isReply=true">댓글쓰기</a>
                    </div>
                </div>
                <div class="recommend-wrap">
                    <div>
                        <p class="title">이런 제주여행은 어떠세요?</p>
                        <a class="more" @click="$router.push('/route')">더보기</a>
                    </div>
                    <div class="card-list">
                        <!-- card -->
                        <div class="card" style="background-image: url('../../assets/images/img-dummy.png');">
                            <div class="card-text">
                                <p class="card-title">세상의 모든 초록빛, 제주 숲으로 안내합니다</p>
                                <ul class="hashtag-list">
                                    <li>사려니숲길</li>
                                    <li>힐링여행</li>
                                    <li>곶자왈도립공원</li>
                                </ul>
                            </div>
                            <label class="btn-like">
                                <input type="checkbox">
                                <div class="shape"></div>
                            </label>
                            <p class="card-writer">제주조아</p>
                            <p class="card-date">3박 4일 여행</p>
                            <a class="link" @click="$router.push('/route/11')"></a>
                        </div>
                        <!-- //card -->
                        <!-- card -->
                        <div class="card" style="background-image: url('../../assets/images/img-dummy.png');">
                            <div class="card-text">
                                <p class="card-title">세상의 모든 초록빛, 제주 숲으로 안내합니다</p>
                                <ul class="hashtag-list">
                                    <li>사려니숲길</li>
                                    <li>힐링여행</li>
                                    <li>곶자왈도립공원</li>
                                </ul>
                            </div>
                            <label class="btn-like">
                                <input type="checkbox">
                                <div class="shape"></div>
                            </label>
                            <p class="card-writer">제주조아</p>
                            <p class="card-date">3박 4일 여행</p>
                            <a class="link" @click="$router.push('/route/52')"></a>
                        </div>
                        <!-- //card -->
                    </div>
                </div>
            </div>
            <transition name="fade">
                <ReplyPopup v-if="isReply"
                            :tourIdx="id"
                            :tour-info="tourInfo"/>
            </transition>
        </main>
        <div class="overlay" :style="(isShowMenu)? '' : 'display:none;'" @click.self="isShowMenu=false">
            <ul class="overlay-menu">
                <li v-show="isMine"><a @click="modifyRout">이 여행경로 편집</a></li>
                <li v-show="isMine"><a @click="removeRout">이 여행경로 삭제</a></li>
                <li v-show="!isMine"><a @click="setFavorites">이 여행경로 찜하기</a></li>
                <li><a href="">SNS 공유하기</a></li>
            </ul>
        </div>
    </div>
</template>
<script>
import {Route, etc} from '@/api';
import {mapGetters} from 'vuex';
import { EventBus } from "../../assets/event-bus";
import ReplyPopup from "../popup/ReplyPopup";

export default {
    name:'RouteView',
    components:{
        ReplyPopup
    },
    props: {
        id: {
            type: String,
            default: null
        },
        reviewLines: {
            type: Number,
            default: 2
        },
        commentLines: {
            type: Number,
            default: 3
        },
        mapHeights: {
            type: Array,
            default: function() { return [159, 370, 547]; }
        }
    },
    data(){
      return{
          mapWidth: 400,
          mapHeight: this.mapHeights[0],
          tourInfo:[],
          days:[],
          isSticky: false,
          isMine: true,
          isLike: false,
          isFavorites: false,
          isReply:false,
          replyList:[],
          isShowMenu:false,
          mapMarkList: [],
          polyLineList: null,
          info: false,
          map: null,
          mapOptions: {
              lat: 33.2411822578,
              lng: 126.5935367973,
              zoom: 9,
              zoomControl: false,
              mapTypeControl: false
          },
          polylineOpt: [],
          initLayers: ['BACKGROUND', 'BACKGROUND_DETAIL', 'POI_KOREAN', 'TRANSIT', 'ENGLISH', 'CHINESE', 'JAPANESE']
      }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
        getRouteList() {
            const postData = new FormData;
            postData.append('tour_idx', this.id);
            Route.routeListDetail(postData).then(res => {
                //console.log(res.data)
                this.tourInfo = res.data.tourInfo;
                this.days = res.data.days;

                if(this.days != null) this.drawMapMarker();

                // this.polylineList = [[{"tour_day":1,"lng":126.4897599,"lat":33.4521972},{"tour_day":1,"lng":126.4896944,"lat":33.4521859},{"tour_day":1,"lng":126.4896299,"lat":33.4521808},{"tour_day":1,"lng":126.4880251,"lat":33.452414},{"tour_day":1,"lng":126.4879698,"lat":33.4524496},{"tour_day":1,"lng":126.4879423,"lat":33.4525017},{"tour_day":1,"lng":126.4879342,"lat":33.4525548},{"tour_day":1,"lng":126.4879191,"lat":33.4526512},{"tour_day":1,"lng":126.4879017,"lat":33.4527539},{"tour_day":1,"lng":126.4878978,"lat":33.4528152},{"tour_day":1,"lng":126.4874482,"lat":33.4528927},{"tour_day":1,"lng":126.4873601,"lat":33.4534349},{"tour_day":1,"lng":126.4873421,"lat":33.4535024},{"tour_day":1,"lng":126.4873148,"lat":33.4535446},{"tour_day":1,"lng":126.4872745,"lat":33.4535848},{"tour_day":1,"lng":126.4872665,"lat":33.4538048},{"tour_day":1,"lng":126.4872208,"lat":33.4542221},{"tour_day":1,"lng":126.4872124,"lat":33.4542995},{"tour_day":1,"lng":126.4871372,"lat":33.454841},{"tour_day":1,"lng":126.4869117,"lat":33.4562831},{"tour_day":1,"lng":126.4868806,"lat":33.4564605},{"tour_day":1,"lng":126.4868116,"lat":33.4568415},{"tour_day":1,"lng":126.4867562,"lat":33.4569754},{"tour_day":1,"lng":126.4867274,"lat":33.4570464},{"tour_day":1,"lng":126.486711,"lat":33.4570752},{"tour_day":1,"lng":126.4866242,"lat":33.4572278},{"tour_day":1,"lng":126.4861242,"lat":33.4582158},{"tour_day":1,"lng":126.485912,"lat":33.4585081},{"tour_day":1,"lng":126.4859033,"lat":33.4585197},{"tour_day":1,"lng":126.485462,"lat":33.4590825},{"tour_day":1,"lng":126.4853895,"lat":33.4592091},{"tour_day":1,"lng":126.4853438,"lat":33.4593503},{"tour_day":1,"lng":126.4853147,"lat":33.4595368},{"tour_day":1,"lng":126.4852868,"lat":33.4599911},{"tour_day":1,"lng":126.4852802,"lat":33.4606495},{"tour_day":1,"lng":126.4852759,"lat":33.4611112},{"tour_day":1,"lng":126.4852747,"lat":33.4612158},{"tour_day":1,"lng":126.4852743,"lat":33.4619915},{"tour_day":1,"lng":126.48527,"lat":33.4620762},{"tour_day":1,"lng":126.4852491,"lat":33.4624909},{"tour_day":1,"lng":126.4851999,"lat":33.4628333},{"tour_day":1,"lng":126.4851716,"lat":33.4629476},{"tour_day":1,"lng":126.485149,"lat":33.4630412},{"tour_day":1,"lng":126.4850142,"lat":33.4635289},{"tour_day":1,"lng":126.4850041,"lat":33.4635658},{"tour_day":1,"lng":126.4849327,"lat":33.4638791},{"tour_day":1,"lng":126.4849236,"lat":33.4639169},{"tour_day":1,"lng":126.4849033,"lat":33.4639997},{"tour_day":1,"lng":126.4848986,"lat":33.4640303},{"tour_day":1,"lng":126.4848499,"lat":33.464425},{"tour_day":1,"lng":126.4848503,"lat":33.4644809},{"tour_day":1,"lng":126.4848504,"lat":33.4645621},{"tour_day":1,"lng":126.4849152,"lat":33.4648232},{"tour_day":1,"lng":126.4848998,"lat":33.4652173},{"tour_day":1,"lng":126.4849046,"lat":33.4656367},{"tour_day":1,"lng":126.4849425,"lat":33.466262},{"tour_day":1,"lng":126.4850131,"lat":33.4688863},{"tour_day":1,"lng":126.4849859,"lat":33.4692784},{"tour_day":1,"lng":126.4849668,"lat":33.4695362},{"tour_day":1,"lng":126.484963,"lat":33.4695812},{"tour_day":1,"lng":126.4849508,"lat":33.4697074},{"tour_day":1,"lng":126.4849348,"lat":33.4698813},{"tour_day":1,"lng":126.4847667,"lat":33.4709154},{"tour_day":1,"lng":126.4845766,"lat":33.4720782},{"tour_day":1,"lng":126.4844701,"lat":33.4725382},{"tour_day":1,"lng":126.4844241,"lat":33.4727011},{"tour_day":1,"lng":126.4843507,"lat":33.4729061},{"tour_day":1,"lng":126.4843384,"lat":33.4729403},{"tour_day":1,"lng":126.4842648,"lat":33.4731597},{"tour_day":1,"lng":126.4841967,"lat":33.4733747},{"tour_day":1,"lng":126.4841172,"lat":33.4736392},{"tour_day":1,"lng":126.4839381,"lat":33.4742267},{"tour_day":1,"lng":126.4837181,"lat":33.4750042},{"tour_day":1,"lng":126.4834449,"lat":33.4760057},{"tour_day":1,"lng":126.483436,"lat":33.4760318},{"tour_day":1,"lng":126.4833981,"lat":33.4761461},{"tour_day":1,"lng":126.4833535,"lat":33.4762774},{"tour_day":1,"lng":126.4833401,"lat":33.4763197},{"tour_day":1,"lng":126.4832888,"lat":33.4764662},{"tour_day":1,"lng":126.4832188,"lat":33.4766614},{"tour_day":1,"lng":126.4829218,"lat":33.4774851},{"tour_day":1,"lng":126.4825094,"lat":33.4786046},{"tour_day":1,"lng":126.4824484,"lat":33.4787565},{"tour_day":1,"lng":126.4823841,"lat":33.4789165},{"tour_day":1,"lng":126.4823697,"lat":33.4789534},{"tour_day":1,"lng":126.4823109,"lat":33.4791044},{"tour_day":1,"lng":126.4822509,"lat":33.4792654},{"tour_day":1,"lng":126.4821008,"lat":33.4796808},{"tour_day":1,"lng":126.4815251,"lat":33.4812319},{"tour_day":1,"lng":126.481453,"lat":33.4814162},{"tour_day":1,"lng":126.4812778,"lat":33.481762},{"tour_day":1,"lng":126.4812396,"lat":33.4818997},{"tour_day":1,"lng":126.481188,"lat":33.4820733},{"tour_day":1,"lng":126.4811303,"lat":33.4822289},{"tour_day":1,"lng":126.4809903,"lat":33.4825993},{"tour_day":1,"lng":126.4809615,"lat":33.482673},{"tour_day":1,"lng":126.4806018,"lat":33.4834214},{"tour_day":1,"lng":126.4804672,"lat":33.4837035},{"tour_day":1,"lng":126.4804077,"lat":33.4838175},{"tour_day":1,"lng":126.4803623,"lat":33.4839281},{"tour_day":1,"lng":126.4803368,"lat":33.4839883},{"tour_day":1,"lng":126.4802484,"lat":33.4841878},{"tour_day":1,"lng":126.4800294,"lat":33.4846893},{"tour_day":1,"lng":126.4799962,"lat":33.4847647},{"tour_day":1,"lng":126.4798457,"lat":33.4851189},{"tour_day":1,"lng":126.4797727,"lat":33.485286},{"tour_day":1,"lng":126.4797517,"lat":33.4853309},{"tour_day":1,"lng":126.4795725,"lat":33.4857416},{"tour_day":1,"lng":126.4794748,"lat":33.4859997},{"tour_day":1,"lng":126.4790534,"lat":33.4863182},{"tour_day":1,"lng":126.4789012,"lat":33.4864468},{"tour_day":1,"lng":126.4785872,"lat":33.4866995},{"tour_day":1,"lng":126.4784915,"lat":33.4867825},{"tour_day":1,"lng":126.477789,"lat":33.4873919},{"tour_day":1,"lng":126.4777118,"lat":33.487458},{"tour_day":1,"lng":126.4778036,"lat":33.4875237},{"tour_day":1,"lng":126.478174,"lat":33.487791},{"tour_day":1,"lng":126.4783755,"lat":33.4879505},{"tour_day":1,"lng":126.4783755,"lat":33.4879505},{"tour_day":1,"lng":126.478174,"lat":33.487791},{"tour_day":1,"lng":126.4778036,"lat":33.4875237},{"tour_day":1,"lng":126.4777118,"lat":33.487458},{"tour_day":1,"lng":126.477789,"lat":33.4873919},{"tour_day":1,"lng":126.4784915,"lat":33.4867825},{"tour_day":1,"lng":126.4785872,"lat":33.4866995},{"tour_day":1,"lng":126.4789012,"lat":33.4864468},{"tour_day":1,"lng":126.4790534,"lat":33.4863182},{"tour_day":1,"lng":126.4794748,"lat":33.4859997},{"tour_day":1,"lng":126.4795725,"lat":33.4857416},{"tour_day":1,"lng":126.4797517,"lat":33.4853309},{"tour_day":1,"lng":126.4797727,"lat":33.485286},{"tour_day":1,"lng":126.4798457,"lat":33.4851189},{"tour_day":1,"lng":126.4799962,"lat":33.4847647},{"tour_day":1,"lng":126.4800294,"lat":33.4846893},{"tour_day":1,"lng":126.4802484,"lat":33.4841878},{"tour_day":1,"lng":126.4803368,"lat":33.4839883},{"tour_day":1,"lng":126.4803623,"lat":33.4839281},{"tour_day":1,"lng":126.4804077,"lat":33.4838175},{"tour_day":1,"lng":126.4804672,"lat":33.4837035},{"tour_day":1,"lng":126.4806018,"lat":33.4834214},{"tour_day":1,"lng":126.4809615,"lat":33.482673},{"tour_day":1,"lng":126.4809903,"lat":33.4825993},{"tour_day":1,"lng":126.4811303,"lat":33.4822289},{"tour_day":1,"lng":126.481188,"lat":33.4820733},{"tour_day":1,"lng":126.4812396,"lat":33.4818997},{"tour_day":1,"lng":126.4812778,"lat":33.481762},{"tour_day":1,"lng":126.4813175,"lat":33.4814025},{"tour_day":1,"lng":126.4813799,"lat":33.4812235},{"tour_day":1,"lng":126.4819828,"lat":33.4796474},{"tour_day":1,"lng":126.4821262,"lat":33.4792499},{"tour_day":1,"lng":126.4821796,"lat":33.4791025},{"tour_day":1,"lng":126.4822218,"lat":33.4789919},{"tour_day":1,"lng":126.4822363,"lat":33.4789523},{"tour_day":1,"lng":126.4823108,"lat":33.4787428},{"tour_day":1,"lng":126.4823731,"lat":33.4785728},{"tour_day":1,"lng":126.4830759,"lat":33.4766404},{"tour_day":1,"lng":126.4831047,"lat":33.4765649},{"tour_day":1,"lng":126.4831447,"lat":33.4764597},{"tour_day":1,"lng":126.4831847,"lat":33.4763554},{"tour_day":1,"lng":126.4831991,"lat":33.4763158},{"tour_day":1,"lng":126.4832537,"lat":33.4761539},{"tour_day":1,"lng":126.4833051,"lat":33.4759938},{"tour_day":1,"lng":126.4835801,"lat":33.4750247},{"tour_day":1,"lng":126.4837969,"lat":33.474249},{"tour_day":1,"lng":126.4839917,"lat":33.4736003},{"tour_day":1,"lng":126.4840613,"lat":33.4733547},{"tour_day":1,"lng":126.4841762,"lat":33.4730093},{"tour_day":1,"lng":126.4842119,"lat":33.4729031},{"tour_day":1,"lng":126.4842815,"lat":33.4726548},{"tour_day":1,"lng":126.4843328,"lat":33.4725037},{"tour_day":1,"lng":126.4844476,"lat":33.4720699},{"tour_day":1,"lng":126.484809,"lat":33.4698722},{"tour_day":1,"lng":126.4848249,"lat":33.4697046},{"tour_day":1,"lng":126.4848322,"lat":33.4696352},{"tour_day":1,"lng":126.484836,"lat":33.4695892},{"tour_day":1,"lng":126.484859,"lat":33.4692701},{"tour_day":1,"lng":126.4848906,"lat":33.4688681},{"tour_day":1,"lng":126.4848641,"lat":33.4679128},{"tour_day":1,"lng":126.4848505,"lat":33.467514},{"tour_day":1,"lng":126.4848146,"lat":33.4662484},{"tour_day":1,"lng":126.4847861,"lat":33.465652},{"tour_day":1,"lng":126.4847741,"lat":33.4652027},{"tour_day":1,"lng":126.4847991,"lat":33.4648169},{"tour_day":1,"lng":126.4848504,"lat":33.4645621},{"tour_day":1,"lng":126.4848503,"lat":33.4644809},{"tour_day":1,"lng":126.4848499,"lat":33.464425},{"tour_day":1,"lng":126.4848986,"lat":33.4640303},{"tour_day":1,"lng":126.4849033,"lat":33.4639997},{"tour_day":1,"lng":126.4849236,"lat":33.4639169},{"tour_day":1,"lng":126.4849327,"lat":33.4638791},{"tour_day":1,"lng":126.4850041,"lat":33.4635658},{"tour_day":1,"lng":126.4850142,"lat":33.4635289},{"tour_day":1,"lng":126.485149,"lat":33.4630412},{"tour_day":1,"lng":126.4851716,"lat":33.4629476},{"tour_day":1,"lng":126.4851999,"lat":33.4628333},{"tour_day":1,"lng":126.4852491,"lat":33.4624909},{"tour_day":1,"lng":126.48527,"lat":33.4620762},{"tour_day":1,"lng":126.4852743,"lat":33.4619915},{"tour_day":1,"lng":126.4852747,"lat":33.4612158},{"tour_day":1,"lng":126.4852759,"lat":33.4611112},{"tour_day":1,"lng":126.4852802,"lat":33.4606495},{"tour_day":1,"lng":126.4852868,"lat":33.4599911},{"tour_day":1,"lng":126.4853147,"lat":33.4595368},{"tour_day":1,"lng":126.4853438,"lat":33.4593503},{"tour_day":1,"lng":126.4853895,"lat":33.4592091},{"tour_day":1,"lng":126.485462,"lat":33.4590825},{"tour_day":1,"lng":126.4859033,"lat":33.4585197},{"tour_day":1,"lng":126.4855884,"lat":33.4583927},{"tour_day":1,"lng":126.4846602,"lat":33.4580839},{"tour_day":1,"lng":126.4844211,"lat":33.458007},{"tour_day":2,"lng":126.4844211,"lat":33.458007},{"tour_day":2,"lng":126.4846602,"lat":33.4580839},{"tour_day":2,"lng":126.4855884,"lat":33.4583927},{"tour_day":2,"lng":126.4859033,"lat":33.4585197},{"tour_day":2,"lng":126.485462,"lat":33.4590825},{"tour_day":2,"lng":126.4853895,"lat":33.4592091},{"tour_day":2,"lng":126.4853438,"lat":33.4593503},{"tour_day":2,"lng":126.4853147,"lat":33.4595368},{"tour_day":2,"lng":126.4852868,"lat":33.4599911},{"tour_day":2,"lng":126.4852802,"lat":33.4606495},{"tour_day":2,"lng":126.4852759,"lat":33.4611112},{"tour_day":2,"lng":126.4852747,"lat":33.4612158},{"tour_day":2,"lng":126.4852743,"lat":33.4619915},{"tour_day":2,"lng":126.48527,"lat":33.4620762},{"tour_day":2,"lng":126.4852491,"lat":33.4624909},{"tour_day":2,"lng":126.4851999,"lat":33.4628333},{"tour_day":2,"lng":126.4851716,"lat":33.4629476},{"tour_day":2,"lng":126.485149,"lat":33.4630412},{"tour_day":2,"lng":126.4850142,"lat":33.4635289},{"tour_day":2,"lng":126.4850041,"lat":33.4635658},{"tour_day":2,"lng":126.4850636,"lat":33.4637277},{"tour_day":2,"lng":126.4851038,"lat":33.4637831},{"tour_day":2,"lng":126.4851144,"lat":33.4637949},{"tour_day":2,"lng":126.4852075,"lat":33.4638398},{"tour_day":2,"lng":126.4854964,"lat":33.4638909},{"tour_day":2,"lng":126.4887688,"lat":33.4637048},{"tour_day":2,"lng":126.4891995,"lat":33.4636777},{"tour_day":2,"lng":126.4897615,"lat":33.4636579},{"tour_day":2,"lng":126.4906413,"lat":33.4636876},{"tour_day":2,"lng":126.4913372,"lat":33.4637158},{"tour_day":2,"lng":126.4918746,"lat":33.4637743},{"tour_day":2,"lng":126.4935124,"lat":33.4639581},{"tour_day":2,"lng":126.4955123,"lat":33.4641907},{"tour_day":2,"lng":126.4960497,"lat":33.4642492},{"tour_day":2,"lng":126.4986247,"lat":33.4645415},{"tour_day":2,"lng":126.4992601,"lat":33.4645845},{"tour_day":2,"lng":126.4999989,"lat":33.4646248},{"tour_day":2,"lng":126.5006618,"lat":33.4646247},{"tour_day":2,"lng":126.5008329,"lat":33.4646243},{"tour_day":2,"lng":126.5008996,"lat":33.4646248},{"tour_day":2,"lng":126.500975,"lat":33.4646245},{"tour_day":2,"lng":126.5013056,"lat":33.4646046},{"tour_day":2,"lng":126.5013992,"lat":33.4645991},{"tour_day":2,"lng":126.5018117,"lat":33.4645744},{"tour_day":2,"lng":126.5025366,"lat":33.4645081},{"tour_day":2,"lng":126.5030744,"lat":33.4644412},{"tour_day":2,"lng":126.5035865,"lat":33.4643578},{"tour_day":2,"lng":126.5041724,"lat":33.4642155},{"tour_day":2,"lng":126.5044087,"lat":33.4641624},{"tour_day":2,"lng":126.5046493,"lat":33.4641075},{"tour_day":2,"lng":126.5054484,"lat":33.4638596},{"tour_day":2,"lng":126.5062156,"lat":33.4635789},{"tour_day":2,"lng":126.5062632,"lat":33.4635631},{"tour_day":2,"lng":126.5064415,"lat":33.4634951},{"tour_day":2,"lng":126.5076993,"lat":33.4629414},{"tour_day":2,"lng":126.5098994,"lat":33.4620328},{"tour_day":2,"lng":126.5103093,"lat":33.4618557},{"tour_day":2,"lng":126.5106243,"lat":33.4617824},{"tour_day":2,"lng":126.5119867,"lat":33.4613035},{"tour_day":2,"lng":126.5127132,"lat":33.4610965},{"tour_day":2,"lng":126.5128013,"lat":33.4614841},{"tour_day":2,"lng":126.5130872,"lat":33.4631324},{"tour_day":2,"lng":126.5138455,"lat":33.4659145},{"tour_day":2,"lng":126.5139001,"lat":33.4661296},{"tour_day":2,"lng":126.5139448,"lat":33.4663617},{"tour_day":2,"lng":126.5139571,"lat":33.4665179},{"tour_day":2,"lng":126.5139548,"lat":33.4666261},{"tour_day":2,"lng":126.5139523,"lat":33.4669372},{"tour_day":2,"lng":126.5139604,"lat":33.4670744},{"tour_day":2,"lng":126.5139669,"lat":33.4671682},{"tour_day":2,"lng":126.5139893,"lat":33.4672848},{"tour_day":2,"lng":126.5140452,"lat":33.467664},{"tour_day":2,"lng":126.5140711,"lat":33.4679456},{"tour_day":2,"lng":126.5140631,"lat":33.468079},{"tour_day":2,"lng":126.5140477,"lat":33.4682034},{"tour_day":2,"lng":126.5140344,"lat":33.4683313},{"tour_day":2,"lng":126.513299,"lat":33.4727413},{"tour_day":2,"lng":126.5133374,"lat":33.472958},{"tour_day":2,"lng":126.5136376,"lat":33.4737244},{"tour_day":2,"lng":126.5137127,"lat":33.4739369},{"tour_day":2,"lng":126.513865,"lat":33.4742673},{"tour_day":2,"lng":126.5139528,"lat":33.4744908},{"tour_day":2,"lng":126.5143953,"lat":33.4757173},{"tour_day":2,"lng":126.5144713,"lat":33.4759425},{"tour_day":2,"lng":126.5145026,"lat":33.4760266},{"tour_day":2,"lng":126.514536,"lat":33.4761207},{"tour_day":2,"lng":126.5147115,"lat":33.4766804},{"tour_day":2,"lng":126.5148331,"lat":33.4770628},{"tour_day":2,"lng":126.5148841,"lat":33.4772229},{"tour_day":2,"lng":126.5151732,"lat":33.4788703},{"tour_day":2,"lng":126.5153246,"lat":33.4798582},{"tour_day":2,"lng":126.5154753,"lat":33.4806125},{"tour_day":2,"lng":126.5155113,"lat":33.4809492},{"tour_day":2,"lng":126.5155109,"lat":33.4809879},{"tour_day":2,"lng":126.5155353,"lat":33.4811117},{"tour_day":2,"lng":126.5155456,"lat":33.481156},{"tour_day":2,"lng":126.5155946,"lat":33.4813927},{"tour_day":2,"lng":126.515662,"lat":33.481708},{"tour_day":2,"lng":126.5156777,"lat":33.4819426},{"tour_day":2,"lng":126.5156615,"lat":33.4822329},{"tour_day":2,"lng":126.5155873,"lat":33.4826995},{"tour_day":2,"lng":126.5155623,"lat":33.4829157},{"tour_day":2,"lng":126.515591,"lat":33.4833236},{"tour_day":2,"lng":126.5156493,"lat":33.4835992},{"tour_day":2,"lng":126.5157619,"lat":33.4839158},{"tour_day":2,"lng":126.5158998,"lat":33.484191},{"tour_day":2,"lng":126.5170491,"lat":33.4864991},{"tour_day":2,"lng":126.5171597,"lat":33.4867156},{"tour_day":2,"lng":126.517406,"lat":33.4872037},{"tour_day":2,"lng":126.5175104,"lat":33.4874002},{"tour_day":2,"lng":126.5176146,"lat":33.4876049},{"tour_day":2,"lng":126.5177115,"lat":33.4877995},{"tour_day":2,"lng":126.5181539,"lat":33.4885543},{"tour_day":2,"lng":126.5182003,"lat":33.4886422},{"tour_day":2,"lng":126.5184354,"lat":33.4890842},{"tour_day":2,"lng":126.5186332,"lat":33.489488},{"tour_day":2,"lng":126.5187489,"lat":33.4897252},{"tour_day":2,"lng":126.5187993,"lat":33.4898357},{"tour_day":2,"lng":126.5188877,"lat":33.4900122},{"tour_day":2,"lng":126.5193882,"lat":33.4909758},{"tour_day":2,"lng":126.5194272,"lat":33.4910465},{"tour_day":2,"lng":126.5195019,"lat":33.4911968},{"tour_day":2,"lng":126.5195999,"lat":33.4913879},{"tour_day":2,"lng":126.5196358,"lat":33.4915406},{"tour_day":2,"lng":126.5196478,"lat":33.4916237},{"tour_day":2,"lng":126.5196739,"lat":33.4920766},{"tour_day":2,"lng":126.5196848,"lat":33.4922598},{"tour_day":2,"lng":126.5196996,"lat":33.4924746},{"tour_day":2,"lng":126.5197109,"lat":33.4942424},{"tour_day":2,"lng":126.5197117,"lat":33.4943579},{"tour_day":2,"lng":126.5197128,"lat":33.4944535},{"tour_day":2,"lng":126.5197231,"lat":33.4953528},{"tour_day":2,"lng":126.5197242,"lat":33.4954493},{"tour_day":2,"lng":126.5197244,"lat":33.4957171},{"tour_day":2,"lng":126.519725,"lat":33.4963332},{"tour_day":2,"lng":126.5197374,"lat":33.4968582},{"tour_day":2,"lng":126.5197403,"lat":33.4969818},{"tour_day":2,"lng":126.519748,"lat":33.4972542},{"tour_day":2,"lng":126.5197699,"lat":33.4979831},{"tour_day":2,"lng":126.5197865,"lat":33.4983242},{"tour_day":2,"lng":126.5197937,"lat":33.498455},{"tour_day":2,"lng":126.5198125,"lat":33.4987916},{"tour_day":2,"lng":126.519825,"lat":33.4994997},{"tour_day":2,"lng":126.5199018,"lat":33.4996527},{"tour_day":2,"lng":126.5199177,"lat":33.499679},{"tour_day":2,"lng":126.5199379,"lat":33.499699},{"tour_day":2,"lng":126.5199741,"lat":33.4997326},{"tour_day":2,"lng":126.5202119,"lat":33.4998409},{"tour_day":2,"lng":126.5204866,"lat":33.4998242},{"tour_day":2,"lng":126.5219242,"lat":33.4997832},{"tour_day":2,"lng":126.5220965,"lat":33.4997774},{"tour_day":2,"lng":126.5229624,"lat":33.4997499},{"tour_day":2,"lng":126.5231926,"lat":33.4997653},{"tour_day":2,"lng":126.5234583,"lat":33.4997827},{"tour_day":2,"lng":126.5237497,"lat":33.4998075},{"tour_day":2,"lng":126.5239743,"lat":33.4998463},{"tour_day":2,"lng":126.5241484,"lat":33.4998756},{"tour_day":2,"lng":126.5247286,"lat":33.4999749},{"tour_day":2,"lng":126.5248242,"lat":33.499991},{"tour_day":2,"lng":126.5248747,"lat":33.4999995},{"tour_day":2,"lng":126.525225,"lat":33.5000618},{"tour_day":2,"lng":126.5253872,"lat":33.500091},{"tour_day":2,"lng":126.5256,"lat":33.5001242},{"tour_day":2,"lng":126.5265241,"lat":33.5002785},{"tour_day":2,"lng":126.5267143,"lat":33.5003116},{"tour_day":2,"lng":126.5269078,"lat":33.5003366},{"tour_day":2,"lng":126.5274194,"lat":33.5004064},{"tour_day":2,"lng":126.5279117,"lat":33.5004743},{"tour_day":2,"lng":126.5285017,"lat":33.5005637},{"tour_day":2,"lng":126.528577,"lat":33.5005751},{"tour_day":2,"lng":126.5290491,"lat":33.5007159},{"tour_day":2,"lng":126.5294656,"lat":33.5009131},{"tour_day":2,"lng":126.5297119,"lat":33.5010332},{"tour_day":2,"lng":126.5301242,"lat":33.5012249},{"tour_day":2,"lng":126.5309748,"lat":33.5015995},{"tour_day":2,"lng":126.5312834,"lat":33.5017354},{"tour_day":2,"lng":126.5314494,"lat":33.501808},{"tour_day":2,"lng":126.5316508,"lat":33.501897},{"tour_day":2,"lng":126.532075,"lat":33.5020916},{"tour_day":2,"lng":126.5326247,"lat":33.502324},{"tour_day":2,"lng":126.5335492,"lat":33.5027326},{"tour_day":2,"lng":126.5337271,"lat":33.5028098},{"tour_day":2,"lng":126.5343742,"lat":33.5030908},{"tour_day":2,"lng":126.5346615,"lat":33.5031995},{"tour_day":2,"lng":126.5347997,"lat":33.5032583},{"tour_day":2,"lng":126.5349498,"lat":33.5033162},{"tour_day":2,"lng":126.5355409,"lat":33.5036031},{"tour_day":2,"lng":126.5358512,"lat":33.5037715},{"tour_day":2,"lng":126.536003,"lat":33.5038737},{"tour_day":2,"lng":126.5362745,"lat":33.5040445},{"tour_day":2,"lng":126.5363867,"lat":33.5041247},{"tour_day":2,"lng":126.5365051,"lat":33.504224},{"tour_day":2,"lng":126.5366513,"lat":33.5043414},{"tour_day":2,"lng":126.5366748,"lat":33.5043579},{"tour_day":2,"lng":126.5369127,"lat":33.5045572},{"tour_day":2,"lng":126.5371623,"lat":33.5047657},{"tour_day":2,"lng":126.5377992,"lat":33.5052911},{"tour_day":2,"lng":126.5381747,"lat":33.5055997},{"tour_day":2,"lng":126.5390068,"lat":33.5062934},{"tour_day":2,"lng":126.5391124,"lat":33.5063826},{"tour_day":2,"lng":126.5393631,"lat":33.5065929},{"tour_day":2,"lng":126.5396991,"lat":33.5068742},{"tour_day":2,"lng":126.5400152,"lat":33.5071103},{"tour_day":2,"lng":126.5402127,"lat":33.5072651},{"tour_day":2,"lng":126.5403619,"lat":33.5073998},{"tour_day":2,"lng":126.5402694,"lat":33.5075848},{"tour_day":2,"lng":126.540199,"lat":33.5077241},{"tour_day":2,"lng":126.5400245,"lat":33.5081241},{"tour_day":2,"lng":126.5404385,"lat":33.5084547},{"tour_day":2,"lng":126.541175,"lat":33.5090412},{"tour_day":2,"lng":126.54132,"lat":33.5091668},{"tour_day":2,"lng":126.5413413,"lat":33.509185},{"tour_day":2,"lng":126.5413413,"lat":33.509185},{"tour_day":2,"lng":126.5414245,"lat":33.5092578},{"tour_day":2,"lng":126.5415237,"lat":33.5093416},{"tour_day":2,"lng":126.5416997,"lat":33.5094908},{"tour_day":2,"lng":126.5418629,"lat":33.5096292},{"tour_day":2,"lng":126.5422246,"lat":33.5099332},{"tour_day":2,"lng":126.5425374,"lat":33.5101747},{"tour_day":2,"lng":126.5426745,"lat":33.5107241},{"tour_day":2,"lng":126.5430348,"lat":33.5106646},{"tour_day":2,"lng":126.5434242,"lat":33.5105991},{"tour_day":2,"lng":126.5433112,"lat":33.5101969},{"tour_day":2,"lng":126.5432258,"lat":33.5099328},{"tour_day":2,"lng":126.5432438,"lat":33.5097652},{"tour_day":2,"lng":126.5433005,"lat":33.5098017},{"tour_day":2,"lng":126.5434182,"lat":33.5098685},{"tour_day":2,"lng":126.5434407,"lat":33.5098804},{"tour_day":2,"lng":126.5436818,"lat":33.5099869},{"tour_day":2,"lng":126.5448373,"lat":33.5104495},{"tour_day":2,"lng":126.5449467,"lat":33.5104909},{"tour_day":2,"lng":126.5453904,"lat":33.5106756},{"tour_day":2,"lng":126.5469981,"lat":33.5113401},{"tour_day":2,"lng":126.5476616,"lat":33.5116076},{"tour_day":2,"lng":126.5482264,"lat":33.511851},{"tour_day":2,"lng":126.5488121,"lat":33.5120494},{"tour_day":2,"lng":126.5490867,"lat":33.5121408},{"tour_day":2,"lng":126.5495995,"lat":33.5123161},{"tour_day":2,"lng":126.5503894,"lat":33.5125449},{"tour_day":2,"lng":126.5502782,"lat":33.5126757},{"tour_day":2,"lng":126.5502142,"lat":33.5127158},{"tour_day":2,"lng":126.5501397,"lat":33.5127351},{"tour_day":2,"lng":126.5500557,"lat":33.5127344},{"tour_day":2,"lng":126.5497703,"lat":33.5127395},{"tour_day":2,"lng":126.5496657,"lat":33.5127549},{"tour_day":2,"lng":126.5495522,"lat":33.5127991},{"tour_day":2,"lng":126.5495381,"lat":33.5128053},{"tour_day":2,"lng":126.5494927,"lat":33.5128248},{"tour_day":2,"lng":126.5495127,"lat":33.5128629},{"tour_day":2,"lng":126.5495285,"lat":33.5129018},{"tour_day":2,"lng":126.5495388,"lat":33.5129397},{"tour_day":2,"lng":126.5495449,"lat":33.5129722},{"tour_day":2,"lng":126.5495476,"lat":33.5130255},{"tour_day":2,"lng":126.5495439,"lat":33.5130642},{"tour_day":2,"lng":126.5495382,"lat":33.5130967},{"tour_day":2,"lng":126.5495259,"lat":33.5131371},{"tour_day":2,"lng":126.5495158,"lat":33.5131695},{"tour_day":2,"lng":126.5494888,"lat":33.5131829},{"tour_day":2,"lng":126.5494587,"lat":33.5131718},{"tour_day":2,"lng":126.5494386,"lat":33.5131446},{"tour_day":2,"lng":126.5494386,"lat":33.5131446},{"tour_day":2,"lng":126.549407,"lat":33.5130767},{"tour_day":2,"lng":126.5493827,"lat":33.5130332},{"tour_day":2,"lng":126.5493254,"lat":33.5129561},{"tour_day":2,"lng":126.5492701,"lat":33.5128989},{"tour_day":2,"lng":126.5492231,"lat":33.5128588},{"tour_day":2,"lng":126.5491783,"lat":33.512826},{"tour_day":2,"lng":126.5491205,"lat":33.5127904},{"tour_day":2,"lng":126.5490713,"lat":33.5127657},{"tour_day":2,"lng":126.5489298,"lat":33.5127087},{"tour_day":2,"lng":126.5489234,"lat":33.512696},{"tour_day":2,"lng":126.5489738,"lat":33.5125196},{"tour_day":2,"lng":126.5490867,"lat":33.5121408},{"tour_day":2,"lng":126.5488121,"lat":33.5120494},{"tour_day":2,"lng":126.5482264,"lat":33.511851},{"tour_day":2,"lng":126.5477049,"lat":33.5117883},{"tour_day":2,"lng":126.5476457,"lat":33.5117879},{"tour_day":2,"lng":126.5475034,"lat":33.5117994},{"tour_day":2,"lng":126.5471441,"lat":33.511867},{"tour_day":2,"lng":126.5460493,"lat":33.5123492},{"tour_day":2,"lng":126.5459739,"lat":33.5124415},{"tour_day":2,"lng":126.5459744,"lat":33.5124992},{"tour_day":2,"lng":126.5460243,"lat":33.5125664},{"tour_day":2,"lng":126.5460994,"lat":33.5125832},{"tour_day":2,"lng":126.5462493,"lat":33.5125663},{"tour_day":2,"lng":126.5467293,"lat":33.5124888},{"tour_day":2,"lng":126.5475447,"lat":33.5123544},{"tour_day":2,"lng":126.5476742,"lat":33.5123328},{"tour_day":2,"lng":126.5476737,"lat":33.5124717},{"tour_day":2,"lng":126.5476724,"lat":33.5134747},{"tour_day":2,"lng":126.5476734,"lat":33.513582},{"tour_day":2,"lng":126.5476743,"lat":33.5138914},{"tour_day":2,"lng":126.5476749,"lat":33.5144244},{"tour_day":2,"lng":126.5476737,"lat":33.5147355},{"tour_day":2,"lng":126.5476726,"lat":33.5148311},{"tour_day":2,"lng":126.5476726,"lat":33.514934},{"tour_day":2,"lng":126.5476728,"lat":33.5150115},{"tour_day":2,"lng":126.547675,"lat":33.5158909},{"tour_day":2,"lng":126.5476741,"lat":33.516166},{"tour_day":2,"lng":126.5475741,"lat":33.5163582},{"tour_day":2,"lng":126.5473742,"lat":33.5168076},{"tour_day":2,"lng":126.5469117,"lat":33.5178413},{"tour_day":2,"lng":126.5469296,"lat":33.5179848}]];
            }).catch(err => {
                console.error(err);
            })
        },
        doViewAllReviewText(e, daysIdx, pathIdx){
            if(e.target.className.indexOf('has-overflow') >= 0){
                const textEl = e.target.getElementsByTagName("p")[0];
                textEl.innerHTML = this.days[daysIdx].path[pathIdx].review;
                textEl.style.height = "auto";
                textEl.style.display = "block";
                e.target.classList.remove("overflow2lines")
            }
        },
        openMap(){
            this.mapWidth = document.body.offsetWidth;
            this.isSticky = true;
        },
        drawMapMarker(){
            console.log("drawMapMarker called");
            this.polylineList = [];
            let startPath = "";
            let endPath = "";
            this.days.forEach(function(day, dayIdx){
                let pathList = [];
                let wayPoints = [];
                let polyline = [];
                if(typeof day.path == "undefined" || day.path == null || day.path.length < 1){
                    console.log("no path in "+day.date);
                }
                else{
                    day.path.forEach(function(path, pathIdx){
                        pathList.push({
                            day: dayIdx + 1,
                            title: pathIdx,
                            lat: Number(path.lat),
                            lng: Number(path.long)
                        });
                        polyline.push({
                            lat: Number(path.lat),
                            lng: Number(path.long)
                        })

                        if(pathIdx == 0){
                            startPath = path.long+","+path.lat;
                        }
                        else if(pathIdx > 0 && pathIdx < day.path.length-1){
                            wayPoints.push(path.long+","+path.lat);
                        }
                        else if(pathIdx == day.path.length-1){
                            endPath = path.long+","+path.lat;
                        }
                    }.bind(this));
                }
                console.log(startPath, wayPoints, endPath);

                const polylineData = {
                    "start": startPath,
                    "waypoints": wayPoints.join('|'),
                    "goal": endPath,
                    "option": "trafast"
                };

                console.log(polylineData);
                this.polylineList.push(polyline);

                this.mapMarkList.push(pathList);
                this.polylineOpt.push({
                    strokeColor : '#ff0000',
                    strokeWeight: 3
                });
            }.bind(this));
        },
        onLoadMap(vue){
            this.map = vue;
        },
        onMarkerLoaded(marker){
            const markerIcon = document.createElement('div');
            markerIcon.classList.add('markerContent');
            markerIcon.title = marker.otherOptions.day+"일차";
            const routeMarker = document.createElement('div');
            routeMarker.classList.add('routeMarker');
            routeMarker.classList.add('day'+marker.otherOptions.day);
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
        onPolylineLoaded(polyline){
            // polyline.polyline.strokeColor = '#ff0000';
            // polyline.polyline.strokeWeight = 3;
            console.log(polyline);
        },
        changeMapSize(){
            let idx = this.mapHeights.indexOf(this.mapHeight) + 1;
            if(idx == this.mapHeights.length) idx = 0;
            this.mapHeight = this.mapHeights[idx];
            document.getElementsByClassName("route-map")[0].style.height = this.mapHeight+"px";
        },
        getLike(){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'get');
            postData.append('type', 'route');
            postData.append('idx', this.id);
            etc.like(postData).then(res => {
                //console.log(res.data)
                res.data.isLike === 'N' ? this.isLike = false : this.isLike = true
            }).catch(err => {
                console.error(err);
            })
        },
        setLike(){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'route');
            postData.append('idx', this.id);
            etc.like(postData).then(res => {
                console.log(res.data)
                res.data.isLike === 'N' ? this.tourInfo.user_like_count-- : this.tourInfo.user_like_count++
            }).catch(err => {
                console.error(err);
            })
        },
        getFavorites(){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'get');
            postData.append('type', 'route');
            postData.append('idx', this.id);
            etc.Favorites(postData).then(res => {
                //console.log(res.data)
                res.data.isZzim === 'N' ? this.isFavorites = false : this.isFavorites = true
            }).catch(err => {
                console.error(err);
            })
        },
        setFavorites(){
            if(this.isShowMenu) this.isShowMenu=false;

            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('action', 'set');
            postData.append('type', 'route');
            postData.append('idx', this.id);
            etc.Favorites(postData).then(res => {
                //console.log(res.data)
                if(res.data.isZzim === 'N'){
                    this.tourInfo.zzim_count--
                    this.isFavorites = false
                }
                else {
                    this.tourInfo.zzim_count++
                    this.isFavorites = true
                }
            }).catch(err => {
                console.error(err);
            })
        },
        getReplyList() {
            const postData = new FormData;
            postData.append('tour_idx', this.id);
            Route.replyList(postData).then(res => {
                //console.log(res.data)
                if(res.data.replyList == null) return;

                if(res.data.replyList.length > 3){
                    this.replyList = [];
                    for(let i=0; i<3; i++){
                        this.replyList.push(res.data.replyList[i]);
                    }
                }
                else{
                    this.replyList = res.data.replyList;
                }

                this.replyList.forEach(function(item){
                    item.getReg = this.$moment(new Date(item.regdt)).fromNow();
                }.bind(this));

            }).catch(err => {
                console.error(err);
            })
        },
        doReply(){
            this.isReply = true;
        },
        doViewReply(e, idx){
            if(e.target.className.indexOf("overflow3lines") >= 0){
                //this.doReply();
                const textEl = e.target.getElementsByTagName("p")[0];
                textEl.innerHTML = this.replyList[idx].comment;
                textEl.style.height = "auto";
                textEl.style.display = "block";
                e.target.classList.remove("overflow3lines")
            }
        },
        modifyRout(){
            this.isShowMenu=false;

            this.$router.push({
                name: 'RouteMake',
                params: {
                    'idx': Number(this.id),
                    'isChk_flag': true
                }
            });
        },
        removeRout(){
            this.isShowMenu=false;

            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('tour_idx', this.id);
            Route.deleteRoute(postData).then(res => {
                console.log(res.data)
                history.back();
            }).catch(err => {
                console.error(err);
            })
        }
        /*
        ,shareLink(){
            const snsCode = "vIconTw";
            let cUrl;
            switch(snsCode){
                case"vIconTw":
                    //트위터
                    cUrl = 'https://twitter.com/intent/tweet?text=페이지제목:&url='+cUrl;
                    break;
                case"vIconTg":
                    //텔레그램
                    cUrl = 'https://telegram.me/share/url?url='+cUrl;
                    break;
                case"vIconFb":
                    //페이스북
                    cUrl = 'http://www.facebook.com/sharer/sharer.php?u='+cUrl;
                    break;
                case"vIconKs":
                    //카카오스토리
                    cUrl = 'https://story.kakao.com/share?url='+cUrl;
                    break;
            }
            window.open(cUrl,'','width=600,height=300,top=100,left=100,scrollbars=yes');
        }
        */
    },
    created() {
        window.scrollTo(0,0);
        this.getRouteList();
        this.getLike();
        this.getFavorites();
        this.getReplyList();
        EventBus.$on("RouteView", props => {
            this.isReply = props;
            this.getRouteList();
            this.getReplyList();
        });
    },
    updated() {
        const reviewTextBox = document.getElementsByClassName("review-text");
        let reviewTextEl = null;
        if(reviewTextBox.length >= 0){
            reviewTextBox.forEach(function(boxEl){
                reviewTextEl = boxEl.getElementsByTagName("p")[0];
                if (reviewTextEl.scrollWidth > reviewTextEl.offsetWidth * this.reviewLines - 60){
                    while (reviewTextEl.scrollWidth > reviewTextEl.offsetWidth * this.reviewLines - 60) {
                        reviewTextEl.innerHTML = reviewTextEl.innerHTML.slice(0, -1);
                    }
                    boxEl.classList.add("overflow2lines");
                }
                if (reviewTextEl.scrollWidth > reviewTextEl.offsetWidth) reviewTextEl.parentElement.classList.add("has-overflow");
            }.bind(this))
        }

        const commentTextEl = document.getElementsByClassName("comment-text");
        if(commentTextEl.length < 1) return;
        commentTextEl.forEach(function(el){
            if (el.scrollWidth > el.offsetWidth * this.commentLines - 60){
                while (el.scrollWidth > el.offsetWidth * this.commentLines - 60) {
                    el.innerHTML = el.innerHTML.slice(0, -1);
                }
                el.parentElement.classList.add("overflow3lines");
            }
            if (el.scrollWidth > el.offsetWidth) el.parentElement.classList.add("has-overflow");
        }.bind(this));

    }
}
</script>
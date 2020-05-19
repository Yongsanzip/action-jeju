<template>
    <div>
        <div :class="{hide : isChk}">
            <section class="wrap">
                <header class="header sub-header">
                    <router-link to="/main" class="close">이전</router-link>
                    <h1>{{(this.touridx == null)? '여행경로 만들기' : '여행경로 일정 수정'}}</h1>
                    <button type="button" class="next" @click="doNext">다음</button>
                </header>
                <div class="container con-route con-route-make">
                    <div class="route-cover">
                        <label class="upload-cover">
                            <input type="file" ref="myfile" @change="previewFile">
                        </label>
                        <img v-if="url === null" :src="`http://img.actionjeju.com/data/user_route_image/visit_jeju${randomIdx}.jpg`" alt="">
                        <img v-if="url" :src="url" alt="">
                    </div>
                    <div class="route-wrap">
                        <div class="surface">
                            <h3 class="title">여행제목</h3>
                            <input type="text" class="text-field" placeholder="여행제목" v-model="title" ref="title">
                        </div>
                        <div class="surface">
                            <h3 class="title">여행인원</h3>
                            <div class="amount-box">
                                <div class="amount-item" v-for="(item, idx) in personnel" :key="idx">
                                    <p class="amount-name">{{item.text}}</p>
                                    <div class="amount">
                                        <button class="amount-btn subt" @click="downCount(item)">-</button>
                                        <input type="number" class="amount-data" :value="item.number" min="1" ref="number">
                                        <button class="amount-btn add" @click="upCount(item)">+</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="surface">
                            <h3 class="title">여행 일정</h3>
                            <!-- datepicker -->
                                <v-date-picker
                                        class='v-date-picker'
                                        v-model="ranges"
                                        mode="range"
                                        :masks="masks"
                                        color="red"
                                        is-inline
                                        is-expanded
                                        :theme-styles='themeStyles'
                                        show-caps
                                        style="background-color:rgb(238,238,238);border:0;"
                                ></v-date-picker>
                            <!-- //datepicker -->
                        </div>
                    </div>
                </div>
            </section>
            <div class="btns">
                <!-- 입력완료시 active 클래스 추가 -->
                <!--                <button class="btn-step active" :class="{active : isChk}" @click="doNext">-->
                <button class="btn-step active" @click="doNext">
                    다음
                </button>
            </div>
        </div>
        <route-make2 v-if="isChk"
                     :title="title"
                     :sdate="this.$moment(this.ranges.start).format('YYYY-MM-DD')"
                     :edate="this.$moment(this.ranges.end).format('YYYY-MM-DD')"
                     :touridx="touridx"
        />
    </div>
</template>
<script>
import vDatePicker from 'v-calendar/lib/components/date-picker.umd'
import {mapGetters} from 'vuex';
import { profile, Route } from "@/api";
import RouteMake2 from "./RouteMake2";

export default {
    name: 'Make',
    components:{vDatePicker,RouteMake2},
    props: {
        idx: {
            type: Number,
            default: null
        },
        isChk_flag:null,
    },
    data(){
        return{
            profile: null,
            ranges:{
                start: new Date(),
                end: new Date(),
            },
            sDate:null,
            eDate:null,
            url: null,
            touridx:null,
            personnel:[
                {text: '성인' , number: 0},
                {text: '어린이' , number: 0},
            ],
            num:0,
            title: "",
            isChk:false,
            themeStyles:{
                border:'0'
            },
            masks: {
                title: 'YYYY년 MMMM',
                weekdays: 'W',
                navMonths: 'MMM',
                input: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
                dayPopover: 'WWW, MMM D, YYYY',
                data: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
            },
            randomIdx: this.getRandomNumb()
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
        /*
        * previewFile
        * 업로드한 이미지 미리보기 생성
         */
        previewFile(e){
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file)
        },
        /*
        * downCount
        * 여행 인원 수 감소
         */
        downCount(item){
            if (item.number <= 0){
                return false
            }
            item.text === '성인' ? item.number -- : item.number --;
            this.num = item.number;
        },
        /*
        * upCount
        * 여행 인원 수 증가
         */
        upCount(item){
            item.text === '성인' ? item.number ++ : item.number ++;
            this.num = item.number;
        },
        /*
        * doNext
        * 정보 저장 후 다음 화면 이동
         */
        doNext(){
            if (this.title === ''){
                this.$alert('여행 제목을 입력해주세요');
                this.$refs.title.focus();
                this.isChk = false;
                return false
            }
            if (this.num === 0){
                this.$alert('인원을 선택해주세요');
                this.isChk = false;
                return false
            }
            const dayChk = this.$el.getElementsByClassName('vc-highlights').length;
            const postData = new FormData();
            postData.append('mb_id', this.GET_MB_ID);
            if(this.touridx != null) postData.append('idx', this.touridx);
            postData.append('tourname', this.title);
            postData.append('tourimg', this.url);
            postData.append('adult_cnt', this.personnel[0].number);
            postData.append('kids_cnt', this.personnel[1].number);
            if (dayChk > 11){
                this.$alert('최대 10일까지 선택가능합니다.');
                return false
            }else{
                postData.append('sdate', this.$moment(this.ranges.start).format('YYYY-MM-DD'));
                postData.append('edate', this.$moment(this.ranges.end).format('YYYY-MM-DD'));
            }
            Route.saveRoute(postData).then(res => {
                console.log(res.data);

                //임시
                // this.touridx = (res.data.touridx > 0)? res.data.touridx : 1;
                this.touridx = Number(res.data.touridx);
                this.isChk = true;
                // if (this.isChk) this.$router.push(`/make/${getResult.touridx}`);
            }).catch(err => {
                console.error(err);
            })

        },
        /*
        * getRandomNumb
        * 랜덤 표지 이미지 위한 랜덤 숫자
         */
        getRandomNumb(){
            var numb = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
            if(Number(numb) >= 10) numb = numb - 1;
            if(Number(numb) < 10) numb = "0" + numb;

            return numb;
        }
    },
    created() {
        const postData = new FormData();
        postData.append('mb_id', this.GET_MB_ID);

        profile.profile(postData).then(res => {
            this.profile = res.data;
            if(this.title == "") this.title = this.profile.nick + "님의 액션제주";
            // console.log(getResult.result_code)
        }).catch(err => {
            console.error(err);
        })

        /*
        * 여행경로 수정
         */
        if(this.idx != null){
            this.touridx = this.idx;

            const postData = new FormData;
            postData.append('tour_idx', this.touridx);
            Route.routeListDetail(postData).then(res => {
                this.title = res.data.tourInfo.name;
                this.ranges.start = new Date(res.data.days[0].date);
                this.ranges.end = new Date(res.data.days[res.data.days.length - 1].date);

                this.personnel[0].number = Number(res.data.tourInfo.adult_cnt);
                this.personnel[1].number = Number(res.data.tourInfo.kids_cnt);
                this.num = this.personnel[0].number + this.personnel[1].number;

                this.locationList = [];
                res.data.days.forEach(function(item){
                    this.locationList[item.date] = item.path;
                }.bind(this));

                //데이터 얻은 후 상세 수정 이동
                this.isChk = this.isChk_flag;
            }).catch(err => {
                console.error(err);
            })
        }
    }
}
</script>

<style>
    .vc-bg-red-200 {
        background-color: #DFDFDF;
    }
    .vc-bg-red-600 {
        background-color: #F3645A;
    }
    .vc-text-gray-500 {
        color: #aaa;
    }
    .vc-border-red-700 {
        border-color: #F3645A;
    }
    .vc-text-red-900 {
        color: #F3645A;
    }
</style>
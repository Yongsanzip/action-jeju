<template>
    <div class="route-card" :tour-idx="data.idx">
        <!-- card -->
        <transition name="fade">
        <div class="card">
            <div class="card-image" @click="doView(data.idx)">
                <img v-if="data.image == null || data.image == 'null'" src="../../../../assets/images/img-dummy.png" alt="">
                <img v-else :src="`${$store.state.user_img_route}${data.image}`" alt="">
            </div>
            <div class="card-contents" @click="doView(data.idx)">
                <div class="card-title">
                    <p>{{data.name}}</p>
                    <div class="like" v-if="data.user_like_point  != null && data.user_like_point > 999">999+</div>
                    <div class="like" v-else>{{(data.user_like_point != null)? data.user_like_point : 0}}</div>
                </div>
                <div class="card-info">
                    <p class="card-tern">{{data.days-1}}박 {{data.days}}일 여행</p>
                    <p class="card-writer">{{data.nick}}</p>
                </div>
                <div class="list-hashtag" v-if="data.hashes != null && data.hashes.length > 0">
                    <div class="hashtag" v-for="(hash, hashIdx) in data.hashes" :key="hashIdx">{{hash}}</div>
                </div>
                <div class="more" @click.self="showMenu(true, data.idx)"></div>
            </div>
        </div>
        </transition>
        <!-- //card -->
        <!-- menu-->
        <transition name="fade">
            <div class="overlay" :style="(isShowMenu)? '' : 'display:none;'" @click.self="showMenu(false)">
<!--                -->
                <ul class="overlay-menu">
                    <li><a @click="modifyRout">이 여행경로 편집</a></li>
                    <li><a @click="removeRout">이 여행일정 삭제</a></li>
                    <li><a @click="showSNSMenu">SNS 공유하기</a></li>
                </ul>
            </div>
        </transition>
        <transition name="fade">
            <div class="overlay" v-show="isShowSNSMenu" @click.self="isShowSNSMenu=false">
                <ul class="overlay-menu sns">
                    <li><a @click="shareLink('facebook')" class="facebook">페이스북</a></li>
                    <!--                <li><a @click="shareLink('instagram')" class="instagram">인스타그램</a></li>-->
                    <li><a @click="shareLink('naver')" class="naver">네이버블로그</a></li>
                    <li><a @click="shareLink('kakao')" class="kakao">카카오톡</a></li>
                    <li><a @click="copyLink" class="copy">링크복사</a></li>
                </ul>
            </div>
        </transition>
    </div>
</template>
<script>
import { Route } from "@/api";
import {mapGetters} from 'vuex';
import { EventBus } from "@/assets/event-bus";

export default {
    name: 'MyTravel',
    props:['data'],
    data(){
        return{
            selectedTourIdx: null,
            isShowMenu: false,
            isShowSNSMenu: false
        }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods: {
        /*
        * doView
        * 선택한 여행경로 상세보기
         */
        doView(idx){
            if(this.isShowMenu) return;
            this.$router.push(`/route/${idx}`)
        },
        /*
        * showMenu
        * 선택한 여행경로 메뉴보기
         */
        showMenu(flag, tourIdx){
            this.isShowMenu = flag;
            this.selectedTourIdx = tourIdx;
            if(flag){
                document.getElementsByClassName("container")[0].style['z-index'] = 999;
            }
            else{
                document.getElementsByClassName("container")[0].style['z-index'] = 1;
            }
        },
        /*
        * modifyRout
        * 여행경로 메뉴 > 여행경로 편집 선택
         */
        modifyRout(){
            // console.log(this.selectedTourIdx);
            this.$router.push({
                name: 'RouteMake',
                params: {
                    'idx': Number(this.selectedTourIdx),
                    'isChk_flag': true
                }
            });
            this.showMenu(false);
        },
        /*
        * removeRout
        * 여행경로 메뉴 > 여행경로 삭제 선택
         */
        removeRout(){
            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('tour_idx', this.selectedTourIdx);
            Route.deleteRoute(postData).then(res => {
                console.log(res.data);
                this.$alert(res.data.resultMsg);
                EventBus.$emit('MyProfile', "myTravel");
                this.$forceUpdate();
            }).catch(err => {
                console.error(err);
            })
            this.showMenu(false);
        },
        /*
        * showSNSMenu
        * 여행 경로 SNS 공유하기
         */
        showSNSMenu(){
            this.isShowMenu = false;
            this.isShowSNSMenu = true;
        },
        shareLink(snsCode){
            let cUrl;
            let url = document.location.origin + "/route/"+this.data.idx;
            let title = this.data.name;
            let imgUrl = this.$store.state.user_img_route + this.data.image;
            let likeCount = this.data.user_like_point;
            let commentCount = this.data.comment_cnt;

            switch(snsCode){
                case "naver":
                    //2020.12.08
                    //경로상세페이지 링크 접근 시 404 오류 발생으로 인한 링크카드 생성 불가 이슈 발생
                    //링크 복사 기능으로 대체
                    this.copyLink();
                    // cUrl = "http://blog.naver.com/openapi/share?url=" + encodeURI(encodeURIComponent(url)) + "&title=" + encodeURI(title);
                    break;
                case"facebook":
                    //페이스북
                    cUrl = 'http://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)+'&t='+encodeURIComponent(title);
                    break;
                case"kakao":
                    //카카오톡
                    window.Kakao.Link.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: title,
                            imageUrl: imgUrl,
                            link: {
                                mobileWebUrl: url,
                                webUrl: url,
                            },
                        },
                        social: {
                            likeCount: Number(likeCount),
                            commentCount: Number(commentCount),
                        }
                    });
                    break;
                case"instagram":
                    //인스타그램
                    // cUrl = 'https://story.kakao.com/share?url='+cUrl;
                    break;
            }

            this.isShowSNSMenu = false;
            if(cUrl != null) window.open(cUrl);
        },
        copyLink() {
            var tempElem = document.createElement('textarea');
            tempElem.value = document.location.origin + "/route/"+this.data.idx;
            document.body.appendChild(tempElem);

            tempElem.select();
            document.execCommand("copy");
            document.body.removeChild(tempElem);

            this.$alert("링크가 복사되었습니다.");
            this.isShowSNSMenu = false;
        }
    }
}
</script>
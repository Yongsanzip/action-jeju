<template>
    <div>
        <div class="wrap modal">
            <div class="post-header sticky">
                <div class="text-box">
                    <p class="post-title">{{tourInfo.name}}</p>
                    <p class="post-route-date">{{tourInfo.days-1}}박 {{tourInfo.days}}일 여행</p>
                </div>
                <button type="button" class="prev" @click="close">이전</button>
            </div>
            <div class="post-comment-wrap">
                <div class="comment-list">
                    <!-- card -->
                    <div v-for="(item, index) in replyList" :key="index" :class="item.idx == idx && highlight? 'comment-card elementToFadeInAndOut' : 'comment-card'">
                        <div class="comment-profile">
                            <img src="../../assets/images/img-dummy.png" alt="">
                        </div>
                        <div class="comment-box">
                            <div>
                                <p class="comment-name">{{item.mb_nick}}</p>
                                <p class="comment-time">{{item.getReg}}</p>
                                <button class="btn-more" v-if="item.mb_id == GET_MB_ID" @click="showReplyMenu(index)">메뉴</button>
                            </div>
                            <div>
                                <p class="comment-text no-word-break" @click="doViewAllText($event, index)">
                                    {{item.comment}}
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- //card -->
                </div>
                <div class="comment-input">
                    <form>
                        <textarea class="textarea" v-model="comment" @keyup="changeCommentText" ref="comment" placeholder="이 경로를 본 소감을 따뜻하게 적어주세요!"></textarea>
                        <a class="btn-write" @click="writeComment">{{(replyIdx == null)? '작성' : '수정'}}</a>
                    </form>
                </div>
            </div>
        </div>
        <div class="overlay" :style="(isMenu)? '' : 'display:none;'" @click.self="isMenu=false;selectedReply=null;replyIdx=null;">
            <ul class="overlay-menu">
                <li><a @click="editComment">댓글 수정하기</a></li>
                <li><a @click="removeComment">댓글 삭제하기</a></li>
            </ul>
        </div>
    </div>
</template>
<script>
import { EventBus } from "../../assets/event-bus";
import {Route} from '@/api';
import "moment/locale/ko";
import {mapGetters} from 'vuex';

export default {
    name: 'ReplyPopup',
    props:{
        tourInfo:{
            type: Object,
            default() {
                return []
            },
            require: true
        },
        tourIdx:{
            type: String
        },
        commentLines:{
            type: Number,
            default: 3
        },
        highlight: {
            type: Boolean,
            default: false
        },
        idx:{
            type: String
        },
        editReply: {
            type: Object
        }
    },
    data(){
      return{
          isReply:false,
          isMenu:false,
          replyList:[],
          getReg:null,
          comment:null,
          selectedReply:null,
          replyIdx:null,
          cnt: 0
      }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
        /*
        * getReplyList
        * 댓글 목록 조회
         */
        getReplyList() {
            const postData = new FormData;
            postData.append('tour_idx', this.tourIdx);
            Route.replyList(postData).then(res => {
                //console.log(res.data)
                if(res.data.replyList == null){
                    this.replyList = [];
                    return;
                }

                this.replyList = res.data.replyList;
                this.replyList.forEach(function(item){
                    item.getReg = this.$moment(item.regdt, ["YYYY-MM-DD h:mm:ss"]).fromNow();
                }.bind(this));

                this.$forceUpdate();

                //하이라이트
                this.$nextTick(function(){
                    if(document.getElementsByClassName("elementToFadeInAndOut").length > 0){
                        document.getElementsByClassName("modal")[0].scrollTo({top:document.getElementsByClassName("elementToFadeInAndOut")[0].offsetTop, left:0, behavior:'smooth'});
                    }
                })

                //댓글 수정
                if(this.editReply != null && this.cnt < 1){
                    this.selectedReply = this.editReply;
                    this.replyIdx = this.selectedReply.idx;
                    this.editComment();
                }

            }).catch(err => {
                console.error(err);
            })
        },
        changeCommentText() {
            if(this.replyIdx != null && this.comment == ""){
                this.selectedReply=null;
                this.replyIdx=null;
            }
        },
        /*
        * writeComment
        * 댓글 작성
         */
        writeComment(){
            if(this.comment === "" || this.comment == null) return;
            if(this.GET_MB_ID != null){
                const postData = new FormData;
                postData.append('mb_id', this.GET_MB_ID);
                postData.append('touridx', this.tourIdx);
                postData.append('commentidx', (this.replyIdx == null)? '' : this.replyIdx);
                postData.append('comment', this.comment);

                if(this.replyIdx == null){
                    // 신규작성
                    Route.writeReply(postData).then(res => {
                        console.log(res.data);

                        this.comment = null;
                        this.getReplyList();

                    }).catch(err => {
                        console.error(err);
                    })
                }
                else{
                    // 수정
                    Route.writeReply(postData).then(res => {
                        console.log(res.data);

                        this.comment = null;
                        this.replyIdx = null;
                        this.selectedReply = null;
                        this.$refs.comment.value = "";
                        this.getReplyList();
                        this.cnt++;
                    }).catch(err => {
                        console.error(err);
                    })
                }
            }
            else {
                this.$confirm("로그인이 필요한 기능입니다. 로그인을 하시겠습니까?").then(()=> {
                    this.$router.push("/")
                });
            }
        },
        /*
        * close
        * 닫기 버튼 선택
         */
        close(){
            EventBus.$emit("RouteView", this.isReply);
            this.$parent.$emit("close-modal");
        },
        /*
        * showReplyMenu
        * 메뉴 버튼 선택
         */
        showReplyMenu(idx){
            this.isMenu = true;
            this.selectedReply = this.replyList[idx];
            this.replyIdx = this.selectedReply.idx;
        },
        /*
        * editComment
        * 댓글 수정
         */
        editComment(){
            //기획 미완
            this.isMenu=false;
            const reply = this.selectedReply;
            this.comment = reply.comment;
            this.$refs.comment.focus();
        },
        /*
        * removeComment
        * 댓글 삭제
         */
        removeComment(){
            this.isMenu=false;
            this.$confirm("삭제하시겠습니까?").then(result=> {
                if(!result) return;

                if(this.GET_MB_ID != null){
                    const postData = new FormData;
                    postData.append('mb_id', this.GET_MB_ID);
                    postData.append('commentidx', this.replyIdx);
                    Route.deleteReply(postData).then(res => {
                        console.log(res.data);
                        this.comment = null;
                        this.replyIdx = null;
                        this.selectedReply = null;
                        this.getReplyList();
                    }).catch(err => {
                        console.error(err);
                    })
                }
                else {
                    this.$confirm("로그인이 필요한 기능입니다. 로그인을 하시겠습니까?").then(()=> {
                        this.$router.push("/")
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
        },
        /*
        * doViewAllText
        * 댓글 더보기 버튼 선택
         */
        doViewAllText(e, idx){
            if(e.target.parentElement.className.indexOf("has-overflow") >= 0){
               e.target.innerHTML = this.replyList[idx].comment;
                e.target.parentElement.classList.add("noEllipsis")
                e.target.parentElement.classList.remove("has-overflow")
            }
        }
    },
    created() {
        this.getReplyList();
    },
    updated() {
        /*
        * 내용이 긴 댓글의 경우 일부 내용을 제외한 내용 숨긴 후 '더보기' 버튼 표시
         */
        const commentTextEl = document.getElementsByClassName("comment-text");
        if(commentTextEl.length < 1) return;
        commentTextEl.forEach(function(el){
            if (el.scrollWidth > el.offsetWidth * this.commentLines - 60){
                while (el.scrollWidth > el.offsetWidth * this.commentLines - 60) {
                    el.innerHTML = el.innerHTML.slice(0, -1);
                }
                el.parentElement.classList.add("overflow3lines");
            }
            if (el.scrollWidth > el.offsetWidth){
                el.parentElement.classList.add("has-overflow");
                el.classList.remove('no-word-break');
            }
        }.bind(this));
    }
}
</script>
<style>
    .elementToFadeInAndOut {
        opacity: 1;
        animation: fade 2s linear;
    }
    @keyframes fade {
        0%,100% { opacity: 1 }
        50% { opacity: 0.5 }
    }

</style>
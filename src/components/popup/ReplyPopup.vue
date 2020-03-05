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
                    <div class="comment-card" v-for="(item, idx) in replyList" :key="idx">
                        <div class="comment-profile">
                            <img src="../../assets/images/img-dummy.png" alt="">
                        </div>
                        <div class="comment-box">
                            <div>
                                <p class="comment-name">{{item.mb_nick}}</p>
                                <p class="comment-time">{{item.getReg}}</p>
                                <button class="btn-more" @click="showReplyMenu(idx)">메뉴</button>
                            </div>
                            <div>
                                <p class="comment-text">
                                    {{item.comment}}
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- //card -->
                </div>
                <div class="comment-input">
                    <form>
                        <textarea class="textarea" v-model="comment" ref="comment" placeholder="이 경로를 본 소감을 따뜻하게 적어주세요!"></textarea>
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
          replyIdx:null
      }
    },
    computed: {
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
        getReplyList() {
            const postData = new FormData;
            postData.append('tour_idx', this.tourIdx);
            console.log(this.tourIdx)
            Route.replyList(postData).then(res => {
                //console.log(res.data)
                if(res.data.replyList == null) return;

                this.replyList = res.data.replyList;
                this.replyList.forEach(function(item){
                    item.getReg = this.$moment(new Date(item.regdt)).fromNow();
                }.bind(this));
            }).catch(err => {
                console.error(err);
            })
        },
        writeComment(){
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

                    this.getReplyList();
                }).catch(err => {
                    console.error(err);
                })
            }
        },
        close(){
            EventBus.$emit("RouteView", this.isReply);
        },
        showReplyMenu(idx){
            this.isMenu = true;
            this.selectedReply = this.replyList[idx];
            this.replyIdx = this.selectedReply.idx;
        },
        editComment(){
            //기획 미완
            this.isMenu=false;
            const reply = this.selectedReply;
            console.log(this.replyIdx, reply);
            this.comment = reply.comment;
            this.$refs.comment.focus()
            console.log("replyIdx:", this.$refs.comment);
        },
        removeComment(){
            this.isMenu=false;
            this.$confirm("삭제하시겠습니까?").then(result=> {
                console.log(result);

                this.comment = null;
                //삭제 API 명확치 않음
                this.comment = null;
                this.replyIdx = null;
                this.selectedReply = null;
                /*Route.removeReply(postData).then(res => {
                    console.log(res.data);

                    this.comment = null;
                    this.replyIdx = null;
                    this.selectedReply = null;

                    this.getReplyList();
                }).catch(err => {
                    console.error(err);
                })*/
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    created() {
        this.getReplyList();
    }
}
</script>
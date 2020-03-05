<template>
    <section class="wrap">
        <header class="sub-header">
            <a href="javascript:history.back()" class="back__btn"></a>
            <h1>공지사항</h1>
        </header>
        <div class="container">
            <div class="con-notice">
                <ul class="list-notice">
                    <li v-for="notice in noticeList"
                        :key="notice.idx"
                        @click="doView(notice.idx)"
                    >
                        <h3 class="notice-title">{{notice.subject}}</h3>
                        <p class="date">{{notice.reg_date.slice(0, 11)}}</p>
                    </li>
                </ul>
                <div class="more-wrap">
                    <p class="more"  @click="nextPage">공지사항 더보기</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {notice} from '@/api';
export default {
    name: 'Notice',
    data(){
        return{
            noticeList: [],
            currentPage:1,
        }
    },
    methods:{
        getNoticeList() {
            const postData = new FormData();
            postData.append('request_code', 'noticeList');
            notice.fetchList(postData).then(res => {
                this.noticeList = res.data.noticeList.slice(0, this.currentPage * 5);
            }).catch(err => {
                console.error(err);
            })
        },
        totalPages() {
            return Math.ceil( this.noticeList.length / 5);
        },
        doView(idx) {
            this.$router.push(`/notice/${idx}`)
        },
        nextPage(){
            if(this.currentPage <  this.totalPages) this.currentPage++;
        }
    },
    created() {
        this.getNoticeList()
    }
}
</script>


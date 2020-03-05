<template>
    <section class="wrap">
        <header class="sub-header">
            <a href="javascript:history.back()" class="back__btn"></a>
            <h1>공지사항</h1>
        </header>
        <div class="container">
            <div class="con-notice">
                <ul class="list-notice">
                    <li>
                        <h3 class="notice-title">{{notice.subject}}</h3>
                        <p class="date" v-if="notice.reg_date">{{notice.reg_date.slice(0, 11)}}</p>
                    </li>
                </ul>
                <div class="contents-notice" v-html="notice.content"></div>
            </div>
        </div>
    </section>
</template>

<script>
import {notice} from '@/api'

export default {
    name: 'NoticeView',
    props: {
        id: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            notice: {
                subject: null,
                content: null,
                reg_date: null,
            }
        }
    },
    created() {
        const postData = new FormData();
        postData.append('notice_id', this.id);
        notice.fetchDetail(postData)
            .then(res => res.data)
            .then(info => {
                this.notice = info.notice;
            })
            .catch(console.error)
    }
}
</script>


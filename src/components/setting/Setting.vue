<template>
    <section class="wrap">
        <header class="header sub-header">
            <a href="javascript:history.back()" class="back__btn"></a>
            <h1>설정</h1>
        </header>
        <div class="container">
            <main class="con-setting">
                <!-- 서비스 설정 -->
                <!--
                <h3 class="overline">서비스 설정</h3>
                <ul class="list-setting">
                    <li>
                        <p class="setting-name">위치 서비스</p>
                        <label class="switch">
                            <input type="checkbox" checked disabled readonly>
                            <div class="shape"></div>
                        </label>
                    </li>
                    <li>
                        <p class="setting-name">알림</p>
                        <label class="switch">
                            <input type="checkbox" checked disabled readonly>
                            <div class="shape"></div>
                        </label>
                    </li>
                </ul>
                -->
                <!-- 친구초대 -->
                <h3 class="overline" v-if="false">친구초대</h3>
                <ul class="list-setting" v-if="false">
                    <li>
                        <p class="setting-name">친구에게 추천하기</p>
                    </li>
                </ul>
                <!-- 고객지원 -->
                <h3 class="overline">고객지원</h3>
                <ul class="list-setting">
                    <li>
                        <router-link to="/notice">
                            <p class="setting-name">공지사항</p>
                            <p class="new">new</p>
                        </router-link>
                    </li>
                    <li>
                        <p class="setting-name">회사소개</p>
                        <a href="http://www.actionjeju.com/bbs/content.php?co_id=company" class="link"></a>
                    </li>
                    <li>
                        <p class="setting-name">버전 정보</p>
                        <p class="version">Ver.8.41.2</p>
                    </li>
                    <li v-if="false">
                        <p class="setting-name">오픈소스 라이선스</p>
                        <a href="" class="link"></a>
                    </li>
                    <li>
                        <p class="setting-name">서비스 이용약관</p>
                        <a href="http://www.actionjeju.com/bbs/content.php?co_id=provision" class="link"></a>
                    </li>
                    <li>
                        <p class="setting-name">개인정보 취급방침</p>
                        <a href="http://www.actionjeju.com/bbs/content.php?co_id=privacy" class="link"></a>
                    </li>
                </ul>
                <!-- 서비스이용 -->
                <ul class="list-setting">
                    <li>
                        <p class="setting-name">업체등록하기</p>
                        <a href="http://biz.actionjeju.com" class="link"></a>
                    </li>
                    <li @click="logOut">
                        <p class="setting-name">로그아웃</p>
                    </li>
                    <li>
                        <p class="setting-name" @click="leave">탈퇴</p>
                    </li>
                </ul>
            </main>
        </div>
        <modal-leave v-if="isLeave"/>
    </section>
</template>

<script>
import {mapGetters} from 'vuex';
import { EventBus } from "../../assets/event-bus";
import ModalLeave from "../popup/LeavePopup";

export default {
    name: "Setting",
    computed:{
        ...mapGetters(['GET_MB_ID'])
    },
    components: {ModalLeave},
    data() {
        return {
            isLeave: false
        }
    },
    methods:{
        /*
        * logOut
        * 로그아웃
         */
        logOut(){
            this.$store.dispatch('SAVE_MB_ID', null);
            this.$cookies.set("mb_id", null);
            this.$router.push('/')
        },
        /*
        * leave
        * 탈퇴하기
         */
        leave(){
            this.isLeave = true;
        }
    },
    created() {
        EventBus.$on("Setting", prop => {
            this.isLeave = prop;
        });
    },
    destroyed() {
        EventBus.$off("Setting");
    }
}
</script>

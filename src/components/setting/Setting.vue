<template>
    <section class="wrap">
        <header class="header sub-header">
            <a href="javascript:history.back()" class="back__btn"></a>
            <h1>설정</h1>
        </header>
        <div class="container">
            <main class="con-setting">
                <!-- 서비스 설정 -->
                <h3 class="overline">서비스 설정</h3>
                <ul class="list-setting">
                    <li>
                        <p class="setting-name">위치 서비스</p>
                        <label class="switch">
                            <input type="checkbox">
                            <div class="shape"></div>
                        </label>
                    </li>
                    <li>
                        <p class="setting-name">알림</p>
                        <label class="switch">
                            <input type="checkbox">
                            <div class="shape"></div>
                        </label>
                    </li>
                </ul>
                <!-- 친구초대 -->
                <h3 class="overline">친구초대</h3>
                <ul class="list-setting">
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
                        <a href="" class="link"></a>
                    </li>
                    <li>
                        <p class="setting-name">버전 정보</p>
                        <p class="version">Ver.8.41.2</p>
                    </li>
                    <li>
                        <p class="setting-name">오픈소스 라이선스</p>
                        <a href="" class="link"></a>
                    </li>
                    <li>
                        <p class="setting-name">서비스 이용약관</p>
                        <a href="" class="link"></a>
                    </li>
                    <li>
                        <p class="setting-name">개인정보 보호정책</p>
                        <a href="" class="link"></a>
                    </li>
                </ul>
                <!-- 서비스이용 -->
                <ul class="list-setting">
                    <li>
                        <p class="setting-name">업체등록하기</p>
                        <a href="" class="link"></a>
                    </li>
                    <li @click="logOut">
                        <p class="setting-name">로그아웃</p>
                    </li>
                    <li>
                        <p class="setting-name">탈퇴</p>
                        <a href="" class="link"></a>
                    </li>
                </ul>
            </main>
        </div>
    </section>
</template>

<script>
export default {
    name: "Setting",
    methods:{
        logOut(){
            this.$store.dispatch('SAVE_MB_ID', null);
            this.$router.push('/')
        }
    }
}
</script>

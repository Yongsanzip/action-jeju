<template>
    <section class="wrap login-bg">
        <div class="section-wrap section-wrap__login">
            <h1><img src="../../assets/images/logo.png" alt="액션제주"></h1>
            <ul>
                <li v-for="(item,idx) in loginList" :key="idx" :class="item.class">
                    <router-link  v-if="item.path != null && item.path != ''" :to="item.path"><span>{{item.text}}</span></router-link>
                    <a v-else target="_self" :href="'https://www.actionjeju.com/societive/api/social.php?social='+item.social"><span>{{item.text}}</span></a>
                </li>
            </ul>
        </div>
    </section>
</template>
<style>

</style>
<script>

export default {
    name: 'Login',
    data(){
        return{
            loginList:[
                {text: '이메일로 로그인' , path: '/email', class: 'em-btn'},
                {text: '카카오로 로그인', path: '', class: 'ka-btn', social: 'kakao'},
                {text: '페이스북으로 로그인' , path: '', class: 'fb-btn', social: 'facebook'},
                {text: '네이버로 로그인' , path: '', class: 'na-btn', social: 'naver'},
                {text: '이메일로 회원가입' , path: '/register', class: 'register'},
            ],
        }
    },
    created() {
        console.log(this.$route.params);
        if(this.$route.params.mb_id != null){
            // 로그인 완료
            // this.$store.dispatch('SAVE_MB_ID', null);
            // this.$store.dispatch('SAVE_MB_ID', this.$route.params.mb_id);
            // this.$router.push('/main');
        }
    }
}

</script>


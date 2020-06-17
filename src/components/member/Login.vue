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
import {user} from '@/api';

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
        //소셜 로그인 토큰 받은 경우
        //로그인 실행
        if(this.$route.query.accessToken != null){
            const postData = new FormData();
            postData.append('accessToken', this.$route.query.accessToken);
            user.socialLogin(postData)
                .then(res => {
                    const {resultCode, resultMsg, mb_id} = res.data;
                    if (resultCode === '1000') { // 성공
                        this.$store.dispatch('SAVE_MB_ID', null);
                        this.$store.dispatch('SAVE_MB_ID', mb_id);
                        this.$router.push('/main');
                    }else {
                        this.$alert(resultMsg)
                    }
                }).catch(err => {
                console.error(err);
            })
        }
    }
}

</script>


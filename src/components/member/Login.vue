<template>
    <section class="wrap login-bg">
        <div class="section-wrap section-wrap__login">
            <h1><img src="../../assets/images/logo.png" alt="액션제주"></h1>
            <ul>
                <li v-for="(item,idx) in loginList" :key="idx" :class="item.class">
                    <router-link :to="item.path"><span>{{item.text}}</span></router-link>
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
                {text: '카카오로 로그인', path: '', class: 'ka-btn'},
                {text: '페이스북으로 로그인' , path: '', class: 'fb-btn'},
                {text: '네이버로 로그인' , path: '', class: 'na-btn'},
                {text: '이메일로 회원가입' , path: '/register', class: 'register'},
            ],
        }
    },
}

</script>


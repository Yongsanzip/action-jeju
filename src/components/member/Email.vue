<template>
    <section class="wrap">
        <header class="sub-header">
            <router-link to="/" class="back__btn"></router-link>
            <h1>이메일로 로그인</h1>
        </header>
        <div class="container">
            <div class="member-content">
                <form @submit.prevent="getLogin">
                    <div class="input-box">
                        <input type="email" placeholder="이메일 주소 입력" v-model="user.email">
<!--                        <p v-if="!$v.user.email.required" class="validate">이메일을 입력해주세요</p>-->
<!--                        <p v-if="!$v.user.email.email" class="validate">이메일 형식이 아닙니다.</p>-->
                    </div>
                    <div class="input-box">
                        <input type="password" placeholder="비밀번호 (6자리 이상 숫자, 문자 조합)" v-model="user.password">
<!--                        <p v-if="!$v.user.password.required" class="validate">비밀번호를 입력해주세요</p>-->
<!--                        <p v-if="!$v.user.password.minLength" class="validate">6자리 이상 입력해주세요</p>-->
                    </div>
                    <button type="submit" class="btn btn__md skyblue mt10">로그인</button>
                </form>
                <router-link to="/password" class="forget-btn">비밀번호를 잊어버리셨나요?</router-link>
                <div class="w160">
                    <a href="http://biz.actionjeju.com" class="btn btn__sm basic mt35">업체등록하기</a>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {user} from '@/api';
import { required, email, minLength} from "vuelidate/lib/validators";

export default {
    name: 'Email',
    data(){
        return{
            user:{
                email : '',
                password : '',
            },
        }
    },
    validations: {
        user: {
            email: {
                required,
                email
            },
            password: {
                required,
                minLength: minLength(6)
            }
        }
    },
    methods:{
        /*
        * getLogin
        * 로그인 버튼 선택
         */
        getLogin(){
            if (this.$v.$invalid) {
                if(!this.$v.user.email.required) {
                    this.$alert('이메일 주소를 입력해주세요.');
                }
                else if(!this.$v.user.email.email) {
                    this.$alert('이메일 형식이 아닙니다.');
                }
                else if(!this.$v.user.password.required) {
                    this.$alert('비밀번호를 입력해주세요.');
                }
                else if(!this.$v.user.password.minLength){
                    this.$alert('비밀번호를 6자리 이상 입력해주세요.');
                }
                return;
            }

            const {
                email: mb_id,
                password: mb_password
            } = this.user;
            const postData = new FormData();
            postData.append('mb_id', mb_id);
            postData.append('mb_password', mb_password);
            user.login(postData)
                .then(res => {
                    const {resultCode, resultMsg} = res.data;
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



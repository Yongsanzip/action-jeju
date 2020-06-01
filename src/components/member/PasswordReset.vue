<template>
    <section class="wrap">
        <header class="sub-header">
            <a href="javascript:history.back()" class="back__btn"></a>
            <h1>비밀번호 변경</h1>
        </header>
        <div class="container">
            <div class="member-content">
                <p class="input-text">변경하려는 비밀번호의 이메일 계정과 새 비밀번호를<br>입력해주세요.</p>
                <form @submit.prevent="getChangePW">
                    <div class="input-box mt15">
                        <input type="email" placeholder="이메일 주소 입력" v-model="user.email">
<!--                        <p v-if="!$v.user.email.required" class="validate">이메일을 입력해주세요</p>-->
<!--                        <p v-if="!$v.user.email.email" class="validate">이메일 형식이 아닙니다.</p>-->
                    </div>
                    <div class="input-box">
                        <input type="password" placeholder="비밀번호 입력" v-model="user.password">
<!--                        <p v-if="!$v.user.password.required" class="validate">비밀번호를 입력해주세요</p>-->
<!--                        <p v-if="!$v.user.password.minLength" class="validate">8자리 이상 입력해주세요</p>-->
                    </div>
                    <div class="input-box">
                        <input type="password" placeholder="비밀번호 재입력" v-model="user.confirmPassword">
                        <!--                        <p v-if="!$v.user.confirmPassword.required" class="validate">비밀번호 확인을 입력해주세요</p>-->
<!--                        <p v-if="!$v.user.confirmPassword.sameAsPassword" class="validate">비밀번호가 동일하지 않습니다.</p>-->
                    </div>
                    <button type="submit" class="btn btn__md skyblue">비밀번호 변경하기</button>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
import { required, email, minLength, sameAs} from "vuelidate/lib/validators";
import {user} from '@/api'
export default {
    name: "PasswordReset",
    data(){
        return{
            user:{
                email : '',
                password : '',
                confirmPassword: "",
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
                minLength: minLength(8)
            },
            confirmPassword: {
                required,
                sameAsPassword: sameAs('password')
            },
        }
    },
    methods:{
        getChangePW(){
            if (this.$v.$invalid) {
                return;
            }
            const {
                email: mb_id,
                password: mb_password
            } = this.user;
            const postData = new FormData();
            postData.append('mb_id', mb_id);
            postData.append('mb_password', mb_password);
            user.changePw(postData)
                .then(res => {
                    const getResult = res.data;
                    console.log(getResult)
                    if (getResult.resultCode === '1000') {
                        this.$alert(getResult.resultMsg)
                        this.$router.push('/')
                    }else if (getResult.resultCode === '0001'){
                        this.$alert(getResult.resultMsg)
                    }else if (getResult.resultCode === '0002'){
                        this.$alert(getResult.resultMsg)
                    }
                }).catch(err => {
                console.error(err);
            })
        }
    }
}
</script>

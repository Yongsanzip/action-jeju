<template>
    <section class="wrap">
        <header class="sub-header">
            <a href="javascript:history.back()" class="back__btn"></a>
            <h1>이메일로 회원가입</h1>
        </header>
        <div class="container">
            <div class="member-content">
                <form @submit.prevent="sendPost">
                    <div class="input-box input-box__col">
                        <input type="text" placeholder="닉네임 (한글 또는 영문 15자 이내)" v-model="user.name" :readonly="nicksubmit">
                        <button type="button" class="btn btn__md gray" @click="doCheckNick">중복확인</button>
<!--                        <p v-if="!$v.user.name.required" class="validate">닉네임을 입력해주세요</p>-->
<!--                        <p v-if="!$v.user.name.minLength" class="validate">최소 4자</p>-->
<!--                        <p v-if="!$v.user.name.maxLength" class="validate">최대 15자</p>-->
<!--                        <p v-if="$v.user.name.sameAs" class="validate">공백</p>-->
                    </div>
                    <div class="input-box">
                        <input type="email" placeholder="이메일 주소 입력" v-model="user.email">
<!--                        <p v-if="!$v.user.email.required" class="validate">이메일을 입력해주세요</p>-->
<!--                        <p v-if="!$v.user.email.email" class="validate">이메일 형식이 아닙니다.</p>-->
                    </div>
                    <div class="input-box">
                        <input type="password" placeholder="비밀번호 (8자리 이상 숫자, 문자 조합)" v-model="user.password">
<!--                        <p v-if="!$v.user.password.required" class="validate">비밀번호를 입력해주세요</p>-->
<!--                        <p v-if="!$v.user.password.minLength" class="validate">8자리 이상 입력해주세요</p>-->
                    </div>
                    <div class="input-box">
                        <input type="password" placeholder="비밀번호 확인" v-model="user.confirmPassword">
<!--                        <p v-if="!$v.user.confirmPassword.required" class="validate">비밀번호 확인을 입력해주세요</p>-->
<!--                        <p v-if="!$v.user.confirmPassword.sameAsPassword" class="validate">비밀번호가 동일하지 않습니다.</p>-->
                    </div>
                    <div class="checkbox-custom">
                        <input type="checkbox" id="agree" v-model="user.terms" @change="$v.user.terms.$touch()">
                        <label for="agree">액션제주의<a href="#"> 이용약관 </a> 및 <a href="#"> 개인정보취급방침 </a>에 동의합니다.</label>
                    </div>
<!--                    <p v-if="!user.terms" class="validate">약관에 동의 해주세요</p>-->
                    <button type="submit" class="btn btn__md skyblue mt35">회원가입</button>
                </form>
                <div class="w160">
                    <a href="#" class="btn btn__sm basic mt35">업체등록하기</a>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {user} from '@/api';
import { required, maxLength, email, minLength, sameAs} from "vuelidate/lib/validators";

export default {
    name: 'Register',
    data(){
        return{
            user:{
                name : '',
                email : '',
                password : '',
                confirmPassword: "",
                terms : false
            },
            nicksubmit: false,
            submitted: false
        }
    },
    validations: {
        user: {
            name: {
                required,
                maxLength: maxLength(15),
                minLength: minLength(4)
            },
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
            terms:{
                sameAs: sameAs( () => true )
            }
        }
    },
    methods:{
        /*
        * doCheckNick
        * 닉네임 사용가능 여부 확인
         */
        doCheckNick() {
            const postData = new FormData();
            if( this.user.name.search(/\s/) !== -1){
                this.$alert(' 공백은 사용할 수 없습니다. ');
                this.nicksubmit = false;
                return false;
            }else{
                postData.append('nick', this.user.name);
            }
            //console.log(this.user.name)
            user.nickCheck(postData)
                .then(res => {
                    const getResult = res.data;

                    if (getResult.result) {
                        this.$alert('사용가능한 닉네임');
                        this.nicksubmit = true;
                    }else{
                        this.$alert('중복된 닉네임');
                        this.nicksubmit = false;
                    }
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * sendPost
        * 회원가입 버튼 선택
         */
        sendPost() {
            this.submitted = true;
            if (!this.nicksubmit){
                this.$alert('아이디 중복체크 해주세요');
                return
            }

            if (this.$v.$invalid) {
                return;
            }

            const {
                name: nick,
                email: mb_id,
                password: mb_password
            } = this.user;
            const postData = new FormData();
            postData.append('nick', nick);
            postData.append('mb_id', mb_id);
            postData.append('mb_password', mb_password);

            user.register(postData)
                .then(res => {
                    const getResult = res.data;
                    if (getResult.resultCode === '1000') {
                        this.$alert(getResult.resultMsg);
                        this.$router.push('/')
                    }else if (getResult.resultCode === '0001'){
                        this.$alert('가입된 아이디' + getResult.joinDate)
                    }
                }).catch(err => {
                    console.error(err);
            })

        }
    }
}

</script>


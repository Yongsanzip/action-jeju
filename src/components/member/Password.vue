<template>
    <section class="wrap">
        <header class="sub-header">
            <a href="javascript:history.back()" class="back__btn"></a>
            <h1>비밀번호 찾기</h1>
        </header>
        <div class="container">
            <div class="member-content">
                <p class="validate">찾으려는 비밀번호의 이메일 계정을 입력해주세요.</p>
                <div class="input-box mt15">
                    <input type="email" placeholder="이메일 주소 입력" v-model="user.email">
<!--                    <p v-if="!$v.user.email.required" class="validate">이메일을 입력해주세요</p>-->
<!--                    <p v-if="!$v.user.email.email" class="validate">이메일 형식이 아닙니다.</p>-->
                </div>
                <button type="submit" class="btn btn__md skyblue" @click="sendEmail">이메일 전송</button>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    name: 'Password',
    data(){
        return{
            user:{
                email : '',
            },
        }
    },
    methods:{
        sendEmail(){
            if (this.$v.$invalid) {
                return;
            }
            const {
                email: mb_id,
            } = this.user;
            const postData = new FormData();
            postData.append('mb_id', mb_id);
        }
    }
}
</script>
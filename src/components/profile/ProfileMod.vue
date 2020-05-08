<template>
    <form @submit.prevent="doModify()">
    <section class="wrap">
            <header class="header sub-header">
                <a href="javascript:history.back()" class="back__btn"></a>
                <h1>프로필 편집</h1>
                <button type="submit" class="next">완료</button>
            </header>
            <div class="container con-profile">
                <div class="profile-edit-wrap">
                    <div class="surface">
                        <div class="edit-image-box">
                            <div class="image-box">
                                <img v-if="url === null" :src="profile.profile_img" alt="">
                                <img v-if="url" :src="url" alt="">
                            </div>
                            <label class="upload-image">
                                <input type="file" ref="myfile" name="myfile" @change="previewFile">
                                <div class="shape">이미지 업로드</div>
                            </label>
                        </div>
                        <p class="user-email">
                            {{GET_MB_ID}}
                        </p>
                        <div>
                            <h3 class="title">필수정보</h3>
                        </div>
                        <div class="edit-user-info">
                            <p class="caption">닉네임(한글 또는 영문 15자 이내)</p>
                            <div class="input-box" style="text-align: left">
                                <div class="with-btn">
                                    <input class="input-text" type="text" placeholder="닉네임" v-model="user.name" :readonly="nicksubmit">
                                    <button class="btn-black" @click="doCheckNick" :disabled="nicksubmit">중복확인</button>
                                </div>
                                <p v-if="!$v.user.name.required" class="validate">닉네임을 입력해주세요</p>
                                <p v-if="!$v.user.name.minLength" class="validate">최소 4자</p>
                                <p v-if="!$v.user.name.maxLength" class="validate">최대 15자</p>
                                <p v-if="$v.user.name.sameAs" class="validate">공백</p>
                            </div>
                            <div class="input-box" style="text-align: left">
                                <input type="password" placeholder="비밀번호 (8자리 이상 숫자, 문자 조합)" v-model="user.password">
<!--                                <p v-if="!$v.user.password.required" class="validate">비밀번호를 입력해주세요</p>-->
                                <p v-if="!$v.user.password.minLength" class="validate">8자리 이상 입력해주세요</p>
                            </div>
                            <div class="input-box" style="text-align: left">
                                <input type="password" placeholder="비밀번호 확인" v-model="user.confirmPassword">
                                <p v-if="!$v.user.confirmPassword.sameAsPassword" class="validate">비밀번호가 동일하지 않습니다.</p>
                            </div>
                        </div>
                        <div>
                            <h4 class="subtitle">간편 로그인계정 관리</h4>
                        </div>
                        <div class="list-sns">
                            <div class="sns kakao">kakao</div>
                            <div class="sns facebook disable">facebook</div>
                            <div class="sns naver disable">naver</div>
                        </div>
                    </div>
                    <div class="surface">
                        <h3 class="title">선택정보</h3>
                        <p class="caption">휴대폰번호</p>
                        <input type="number" class="input-text" placeholder="-없이 입력" v-model="user.phone">
                        <p class="caption">거주지역</p>
                        <select class="select-box" v-model="user.state">
                            <option v-for="(item, idx) in select.state"
                                    :key="idx"
                                    :value="item.value"
                            >
                                {{item.name}}
                            </option>
                        </select>
                        <p class="caption">연령대</p>
                        <select class="select-box" v-model="user.age">
                            <option v-for="(item, idx) in select.age"
                                    :key="idx"
                                    :value="item.value"
                            >
                                {{item.name}}
                            </option>
                        </select>
                        <p class="caption">성별</p>
                        <select class="select-box" v-model="user.sex">
                            <option v-for="(item, idx) in select.sex"
                                    :key="idx"
                                    :value="item.value"
                            >
                                {{item.name}}
                            </option>
                        </select>
                        <div class="event-agree">
                            <p class="caption">여행/이벤트 정보 수신동의</p>
                            <label class="checkbox-item">
                                <div class="checkbox">
                                    <input type="checkbox" v-model="user.chkEmail">
                                    <div class="shape"></div>
                                </div>
                                <p class="checkbox-caption">이메일</p>
                            </label>
                            <label class="checkbox-item">
                                <div class="checkbox">
                                    <input type="checkbox" v-model="user.chkSMS">
                                    <div class="shape"></div>
                                </div>
                                <p class="checkbox-caption">SMS</p>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
    </section>
    </form>
</template>
<script>
import {profile, user} from '@/api';
import {mapGetters} from 'vuex';
import { required, maxLength, email, minLength, sameAs} from "vuelidate/lib/validators";

export default {
    name: 'MyProfile',
    data(){
        return{
            url: null,
            profile:[],
            user:{
                myFile : null,
                name : '',
                password : '',
                confirmPassword: '',
                phone:0,
                state:'',
                age:'',
                sex:'',
                chkEmail : false,
                chkSMS : false,
            },
            select:{
                state:[
                    {name:'지역을 선택하세요',value:''},
                    {name:'서울',value:'서울'},
                    {name:'경기',value:'경기'},
                    {name:'부산',value:'부산'},
                ],
                age:[
                    {name:'연령을 선택하세요',value:''},
                    {name:'10대',value:'10'},
                    {name:'20대',value:'20'},
                    {name:'30대',value:'30'},
                ],
                sex:[
                    {name:'성별을 선택하세요',value:''},
                    {name:'남자',value:'male'},
                    {name:'여자',value:'female'},
                ],
            },
            nicksubmit: false,
            submitted: false,
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
    computed:{
        ...mapGetters(['GET_MB_ID'])
    },
    methods:{
        /*
        * getProfile
        * 프로필 정보 조회
         */
        getProfile(){
            const postData = new FormData();
            postData.append('mb_id', this.GET_MB_ID);

            profile.profile(postData).then(res => {
                const getResult = res.data;
                this.profile = getResult;
                this.user.name = this.profile.nick;
                this.user.phone = this.profile.phone;
                this.user.state = this.profile.state;
                this.user.age = this.profile.age;
                this.user.sex = this.profile.sex;
                this.profile.agree_email === "Y" ? this.user.chkEmail = true : this.user.chkEmail = false;
                this.profile.agree_sms === "Y" ? this.user.chkSMS = true : this.user.chkSMS = false;
                // console.log(getResult.result_code)
            }).catch(err => {
                console.error(err);
            })
        },
        /*
        * previewFile
        * 프로필 이미지 변경 후 미리보기
         */
        previewFile(e){
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file)
        },
        /*
        * doModify
        * 프로필 변경
         */
        doModify(){
            this.submitted = true;
            if (!this.nicksubmit && this.user.name != this.profile.nick){
                this.$alert('닉네임 중복검사를 진행해 주세요.');
                return
            }
            else if(this.user.password != ""){
                if(this.user.password.length < 8){
                    this.$alert('비밀번호는 최소8자이상 사용해주세요.');
                    return
                }
                else if(this.user.password != this.user.confirmPassword){
                    this.$alert('비밀번호가 일치하지 않습니다.다시 입력해 주세요!');
                    return
                }
            }
            // if (this.$v.$invalid) {
            //     return;
            // }
            const {
                name: nick,
                password: mb_password,
                phone: phone,
                state: state,
                age: age,
                sex: sex,
                chkEmail :chkEmail,
                chkSMS : chkSMS
            } = this.user;

            const data = new FormData();
            data.append('mb_id', this.GET_MB_ID);
            data.append('myfile', this.$refs.myfile.files[0]);

            profile.profileImage(data)
                .then(res => {
                    const getResult = res.data;
                    console.log(getResult);
                }).catch(err => {
                console.error(err);
            })

            const postData = new FormData();
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('nick', nick);
            if(mb_password != "") postData.append('mb_password', mb_password);
            if(phone != "") postData.append('phone', phone);
            if(state != "") postData.append('state', state);
            if(age != "") postData.append('age', age);
            if(sex != "") postData.append('sex', sex);
            postData.append('agree_email', chkEmail ? "Y" : "N");
            postData.append('agree_sms', chkSMS ? "Y" : "N");

            profile.modProfile(postData)
                .then(res => {
                    const getResult = res.data;
                    if (getResult.resultCode === '1000') {
                        this.$alert("회원 정보가 변경되었습니다.");
                        this.$router.push('/profile')
                    }else if (getResult.resultCode === '0001'){
                        this.$alert(getResult.joinDate)
                    }
                }).catch(err => {
                console.error(err);
            })
        },
        /*
        * doCheckNick
        * 닉네임 사용가능 여부 확인
         */
        doCheckNick(){
            const postData = new FormData();
            if(this.user.name.search(/\s/) !== -1){
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
        }
    },
    created() {
        this.getProfile();
    }
}
</script>
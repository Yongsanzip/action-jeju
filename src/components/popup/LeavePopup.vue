<template>
    <section class="wrap modal leave">
        <main class="container con-leave">
            <div class="leave-prompt">
                <div class="title">탈퇴하기</div>

                <div><textarea v-model="message" placeholder="탈퇴 사유를 입력해주세요."></textarea></div>
                <div class="personal">
                    <input type="checkbox" :checked="isChecked" @click="isChecked=!isChecked">
                    <span>개인정보 및 제작한 경로가 모두 삭제되는 데에 동의합니다.</span>
                </div>

                <div class="leave-btns">
                    <button @click="leave">탈퇴하기</button>
                    <button @click="cancel">취소</button>
                </div>
            </div>
        </main>
    </section>
</template>

<script>
import {user} from '@/api';
import { EventBus } from "../../assets/event-bus";

export default {
    name: 'LeavePopup',
    data(){
        return{
            message: null,
            isChecked:true,
        }
    },
    methods:{
        leave() {
            if(this.message == null || this.message == ""){
                this.$alert('탈퇴사유를 입력해주세요.');
            }
            else if(!this.isChecked){
                this.$alert('개인정보 및 제작경로 삭제에 동의해주세요.');
            }

            const postData = new FormData;
            postData.append('mb_id', this.GET_MB_ID);
            postData.append('reason', this.message);
            user.leave(postData).then(res => {
                console.log(res.data);
                this.$router.push("/");
            }).catch(err => {
                console.error(err);
            })
        },
        cancel() {
            EventBus.$emit("Setting", false);
            // console.log("cancel");
        }
    },
    created() {
    }
}
</script>


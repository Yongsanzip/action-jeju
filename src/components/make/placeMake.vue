<template>
    <section class="wrap modal">
        <main class="con-route">
            <div class="overlay">
                <div class="place-review regist-place">
                    <div class="input-place-review-block">
                        <div class="review-header">
                            <button type="button" class="btn-close" @click="close">모달닫기</button>
                            <h3 class="place-name"></h3>
                        </div>
                        <div class="create-place-form">
                            <div class="surface modal-title">
                                <div>새로운 <b>장소 등록</b></div>
                                <div class="description">
                                    새로운 장소의 사진과 후기를 올려주세요 :)
                                </div>
                            </div>
                            <div class="relative">
                                <input type="text" class="text-field" placeholder="장소명" v-model="name" @change="changeName" maxlength="25">
                                <button class="place_name_btn" @click="checkOverlap">중복확인</button>
                            </div>
                            <div class="flex">
                                <input type="text" class="text-field" placeholder="장소 주소" v-model="address" readonly @click="findAddress">
                                <button class="place_address_btn" @click="findAddress">주소찾기</button>
                            </div>
                            <div>
                                <input type="text" class="text-field" placeholder="상세 주소" v-model="addressDetail">
                            </div>
                            <div>
                                <input type="text" class="text-field" placeholder="전화번호" v-model="phone">
                            </div>
                            <div>
                                <select class="text-field" v-model="category">
                                    <option value="">선택</option>
                                    <option value="01">맛집</option>
                                    <option value="02">카페</option>
                                    <option value="03">숙박</option>
                                    <option value="04">체험</option>
                                    <option value="05">쇼핑</option>
                                    <option value="06">레저</option>
                                    <option value="07">트래킹</option>
                                    <option value="08">액티비티</option>
                                    <option value="09">전시</option>
                                    <option value="10">휴양</option>
                                </select>
                            </div>
                            <label>
                            </label>
                        </div>
                        <div class="review-image-list" ref="imageList">
                            <swiper :options="swiperOption">
                                <swiper-slide class="image-item"
                                              v-for="(photoItem, idx) in photoList"
                                              :key="idx"
                                >
                                    <div v-if="idx === 0" class="add-image image-item" :class="'add-image-'+photoList.length" @click.self="addImage(photoList.length)">
                                        이미지 추가
                                        <div class="imageFiles" style="display: none;">
                                            <input type="file" class="imageFile" style="display: none;" accept="image/*" multiple/>
                                        </div>
                                    </div>
                                    <div v-else :style="{'background-image': `url(${photoItem.src}`}" class="image-box">
                                        <button class="btn-remove" @click="removeImage(photoItem.idx)">사진삭제</button>
                                    </div>
                                </swiper-slide>
                            </swiper>
                        </div>
                    </div>
                    <!-- 입력완료시 active 클래스 추가 -->
                    <div class="review-complate active" @click="save">
                        완료
                    </div>
                </div>
            </div>
        </main>
        <div class="wrap modal" v-if="isShowAddressSearch">
            <vue-daum-postcode  @complete="setAddress($event)" />
        </div>
    </section>
</template>

<script>
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import {Route} from "../../api";
import {mapGetters} from 'vuex';

    export default {
        name: "placeMake",
        components:{
            swiper, swiperSlide
        },
        computed: {
            ...mapGetters(['GET_MB_ID'])
        },
        data() {
            return {
                name: '',
                isOverlapChecked: false,
                isShowAddressSearch: false,
                zipcode: '',
                address: '',
                addressDetail: '',
                phone: '',
                category: '',
                swiperOption: {
                    slidesPerView: 'auto',
                    slidesPerGroup: 1,
                    freeMode: true,
                    loop: false,
                    speed: 400,
                },
                photoList: [{
                    idx: -1,
                    src: "",
                    filename: "이미지추가"
                }],
                isShowAlert: false
            }
        },
        methods: {
            close() {
                this.$parent.$emit("close-place-make");
            },
            save() {
                if(!this.isOverlapChecked) {
                    this.$alert('장소명을 입력해주세요!');
                    return;
                }
                else if(this.address === "") {
                    this.$alert('주소를 입력해주세요!');
                    return;
                }

                const postData = new FormData;
                postData.append('place_name', this.name);
                postData.append('place_addr1', this.address);
                postData.append('place_addr2', this.addressDetail);
                postData.append('place_zipcode', this.zipcode);
                postData.append('place_tel', this.phone);
                postData.append('cate1', this.category);
                postData.append('mb_id', this.GET_MB_ID);

                // this.photoList.forEach(function(img){
                //     console.log(img);
                // });
                // postData.append('image_idx_arr', "");

                let cnt = 0;
                this.$refs.imageList.querySelectorAll('input[type=file]').forEach(function(input) {
                    if(input.files.length > 0){
                        input.files.forEach(function(file){
                            postData.append('images'+cnt, file);
                            cnt++;
                        });
                    }
                });

                Route.registPlace(postData).then(res => {
                    console.log(res);
                    this.close();
                    this.$parent.$emit("research");
                }).catch(err => {
                    console.error(err);
                })
            },
            changeName() {
                this.isOverlapChecked = false;
            },
            checkOverlap() {
                this.isOverlapChecked = false;
                if(this.name === "") return;

                const postData = new FormData();
                postData.append('place_name', this.name);

                Route.placeNameOverlap(postData).then(res => {
                    console.log(res);
                    if(res.data.result !== false){
                        this.isOverlapChecked = true;
                        this.$alert('등록 가능한 장소입니다.', null, "success");
                    }
                    else{
                        this.$alert('이미 등록된 장소입니다.', null, "error");
                    }
                }).catch(err => {
                    console.error(err);
                });
            },
            findAddress() {
                this.isShowAddressSearch = true;
            },
            setAddress(data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                let fullRoadAddr = data.roadAddress; // 도로명 주소 변수
                let extraRoadAddr = ''; // 도로명 조합형 주소 변수

                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraRoadAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraRoadAddr !== ''){
                    extraRoadAddr = ' (' + extraRoadAddr + ')';
                }
                // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
                if(fullRoadAddr !== ''){
                    fullRoadAddr += extraRoadAddr;
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                console.log(data.zonecode);
                console.log(fullRoadAddr);


                // $("[name=place_zipcode]").val(data.zonecode);
                // $("[name=place_addr1]").val(fullRoadAddr);
                this.zipcode = data.zonecode;
                this.address = fullRoadAddr;

                //document.getElementById('signUpUserPostNo').value = data.zonecode; //5자리 새우편번호 사용
                //document.getElementById('signUpUserCompanyAddress').value = fullRoadAddr;
                //document.getElementById('signUpUserCompanyAddressDetail').value = data.jibunAddress;

                this.isShowAddressSearch = false;
            },
            /*
            * addImage
            * 이미지 추가
             */
            addImage(idx){
                // console.log(idx);
                if(this.photoList.length-1 >= 10){
                    //최대 10장 등록 가능
                    this.$alert("후기 사진은 최대 10장 등록 가능합니다.");
                    return false;
                }

                const addImgEl = this.$refs.imageList.querySelectorAll('.imageFiles')[0];
                var imgInput = null;
                const cntImgInput = this.$refs.imageList.querySelectorAll('.imageFile').length;
                for(var i = 0; i < cntImgInput; i++){
                    if(addImgEl.getElementsByClassName("imageFile")[i].files.length < 1) imgInput = addImgEl.getElementsByClassName("imageFile")[i];
                }

                const imgChangeEvnt = function(e){
                    const files = e.target.files;
                    const filesArr = Array.prototype.slice.call(files);
                    let isOver = false;
                    filesArr.forEach(function(f) {
                        if(this.photoList.length-1 >= 10){
                            //최대 10장 등록 가능
                            isOver = true;
                            return false;
                        }
                        if(!f.type.match("image.*")){
                            this.$alert("이미지만 업로드 가능합니다.");
                            return;
                        }

                        this.photoList.push({
                            idx: idx,
                            src: URL.createObjectURL(f),
                            filename: f.name
                        });
                    }.bind(this));
                    imgInput.removeEventListener('change', imgChangeEvnt);

                    if(isOver){
                        this.$alert("후기 사진은 최대 10장 등록 가능합니다.");
                    }

                    const newFileEl = document.createElement("input");
                    newFileEl.setAttribute("type", "file");
                    newFileEl.setAttribute("style", "display: none");
                    newFileEl.setAttribute("accept", "image/*");
                    newFileEl.setAttribute("multiple", "multiple");
                    newFileEl.classList.add('imageFile');

                    const parentEl = this.$refs.imageList.querySelectorAll('.imageFiles')[0];
                    parentEl.appendChild(newFileEl);
                }.bind(this);

                imgInput.addEventListener('change', imgChangeEvnt);
                // imgInput.click();
                imgInput.dispatchEvent(new MouseEvent("click"));
            },
            /*
            * removeImage
            * 이미지 제거
             */
            removeImage(idx){
                const removeimgItem = this.photoList.find(function(item) {
                    return item.idx === idx;
                });

                const imgItemIdx = this.photoList.indexOf(removeimgItem);
                if (imgItemIdx > -1) this.photoList.splice(imgItemIdx, 1);
            },
        }
    }
</script>

<style scoped>

</style>
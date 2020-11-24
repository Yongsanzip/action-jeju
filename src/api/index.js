import api from './common'

export const user = {
    nickCheck(data) {
        return api.request({
            method: 'post',
            url: '/ajax/ajax_nick_check.php',
            data
        })
    },
    register(data) {
        return api.request({
            method: 'post',
            url: '/join.php',
            data
        })
    },
    login(data) {
        return api.request({
            method: 'post',
            url: '/login.php',
            data
        })
    },
    socialLogin(data) {
        return api.request({
            method: 'post',
            url: '/social_login_check.php',
            data
        })
    },
    changePw(data){
        return api.request({
            method: 'post',
            url: '/changePW.php',
            data
        })
    },
    leave(data) { //회원탈퇴
        return api.request({
            method: 'post',
            url: '/leave.php',
            data
        })
    },
    sendEmail(data) {
        return api.request({
            method: 'post',
            url: '/bbs/register_email_update.php',
            data
        })
    }
};

export const profile ={
    profile(data){
        return api.request({
            method: 'post',
            url: '/profile.php',
            data
        })
    },
    modProfile(data){
        return api.request({
            method: 'post',
            url: '/modProfile.php',
            data
        })
    },
    profileImage(data) {
        return api.request({
            method: 'post',
            url: '/ajax/ajax_myprofile_upload.php',
            data
        })
    },
    zzimPlace(data) { //찜한 장소 목록
        return api.request({
            method: 'post',
            url: '/zzimPlace.php',
            data
        })
    },
    likePhoto(data) { //좋아요 사진 목록
        return api.request({
            method: 'post',
            url: '/likePhoto.php',
            data
        })
    },
    myReview(data) { //나의 후기 목록
        return api.request({
            method: 'post',
            url: '/myReview.php',
            data
        })
    },
    myReply(data) { //경로 댓글
        return api.request({
            method: 'post',
            url: '/myReply.php',
            data
        })
    },
}

export const Route = {
    routeList(data) {
        return api.request({
            method: 'post',
            url: '/routeList.php',
            data
        })
    },
    routeListDetail(data) {
        return api.request({
            method: 'post',
            url: '/route.php',
            data
        })
    },
    themerouteList(data){
        return api.request({
            method: 'post',
            url: '/themerouteList.php',
            data
        })
    },
    routeDrivePath(data){
        return api.request({
            method: 'post',
            url: '/lines.php',
            data
        })
    },
    place(data) {
        return api.request({
            method: 'post',
            url: '/place.php',
            data
        })
    },
    placeNameOverlap(data) {
        return api.request({
            method: 'post',
            url: '/ajax/ajax_place_check.php',
            data
        })
    },
    registPlace(data) {
        return api.request({
            method: 'post',
            url: '/company_user_reg.php',
            data
        })
    },
    saveRoute(data) {//경로 등록1
        return api.request({
            method: 'post',
            url: '/saveRoute.php',
            data
        })
    },
    saveRouteDetail(data) {//경로 상세 등록/편집
        return api.request({
            method: 'post',
            url: '/saveRouteDetail.php',
            data
        })
    },
    deleteRoute(data){//경로 삭제
        return api.request({
            method: 'post',
            url: '/deleteRoute.php',
            data
        })

    },
    replyList(data) {//경로 댓글 목록
        return api.request({
            method: 'post',
            url: '/replyList.php',
            data
        })
    },
    writeReply(data) {//경로 댓글 등록/수정
        return api.request({
            method: 'post',
            url: '/writeReply.php',
            data
        })
    },
    deleteReply(data) {//경로 댓글 삭제
        return api.request({
            method: 'post',
            url: '/deleteReply.php',
            data
        })
    },
    writeReview(data) {//장소 후기 등록/수정
        return api.request({
            method: 'post',
            url: '/writeReview.php',
            data,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
        }
        )
    },
    bannerAds(data){
        return api.request({
            method: 'get',
            url: '/banner_list2.php',
            data
        })
    },
    movieList(data){
        return api.request({
            method: 'get',
            url: '/main_movie.php',
            data
        })
    },
    recommendedList(data){
        return api.request({
            method: 'get',
            url: '/recom_route.php',
            data
        })
    }
};

export const search = {
    searchMainTitle(data) {
        return api.request({
            method: 'post',
            url: '/main_title_searchList.php',
            data
        })
    },
    recentSearchList(data) {
        return api.request({
            method: 'post',
            url: '/searchList.php',
            data
        })
    },
    mySearchList(data) {
        return api.request({
            method: 'post',
            url: '/mysearchList.php',
            data
        })
    },
    search(data) {
        return api.request({
            method: 'post',
            url: '/search.php',
            data
        })
    },
    searchPlace(data) {
        return api.request({
            method: 'post',
            url: '/searchPlace.php',
            data
        })
    },
};

export const etc = {
    intro(data) {
        return api.request({
            method: 'post',
            url: '/intro.php',
            data
        })
    },
    fetchList(data) {
        return api.request({
            method: 'post',
            url: '/hashList.php',
            data
        })
    },
    like(data){
        return api.request({
            method: 'post',
            url: '/like.php',
            data
        })
    },
    Favorites(data){
        return api.request({
            method: 'post',
            url: '/zzim.php',
            data
        })
    },
    bannerAds_profile(data){
        return api.request({
            method: 'get',
            url: '/banner_list1.php',
            data
        })
    }
};

export const notice = {
    fetchList(data) {
        return api.request({
            method: 'post',
            url: '/noticeList.php',
            data
        })
    },
    fetchDetail(data) {
        return api.request({
            method: 'post',
            url: '/notice.php',
            data
        })
    },
};
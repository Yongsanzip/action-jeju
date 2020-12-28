import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    key: 'action-jeju',
    storage: window.localStorage,
});

export default new Vuex.Store({
    state:{
        mb_id: null,
        is_show_loading: false,
        mainTourIdx: null,
        scrollPosition: null,
        user_img_route: 'http://img.actionjeju.com/data/user_route_image',
        place_img_route: 'http://img.actionjeju.com/data/company_image',
        user_after_route: 'http://img.actionjeju.com/data/user_route_after',
        banner_img_route: 'http://img.actionjeju.com/data/banner',
    },
    getters:{
        GET_MB_ID(state) {
            return state.mb_id;
        },
        GET_IS_SHOW_LOADING(state) {
            return state.is_show_loading;
        },
        GET_MAIN_TOUR_IDX(state) {
            return state.mainTourIdx;
        },
        GET_SCROLL_POSITION(state) {
            return state.scrollPosition;
        }
    },
    mutations:{
        SET_MB_ID(state, payload){
            state.mb_id = payload
        },
        SET_IS_SHOW_LOADING(state, payload){
            state.is_show_loading = payload
        },
        SET_MAIN_TOUR_IDX(state, payload){
            state.mainTourIdx = payload
        },
        SET_SCROLL_POSITION(state, payload) {
            state.scrollPosition = payload
        }
    },
    actions:{
        SAVE_MB_ID({commit}, payload) {
            commit('SET_MB_ID', payload);
        },
        SAVE_IS_SHOW_LOADING({commit}, payload) {
            commit('SET_IS_SHOW_LOADING', payload);
        },
        SAVE_MAIN_TOUR_IDX({commit}, payload) {
            commit('SET_MAIN_TOUR_IDX', payload);
        },
        SAVE_SCROLL_POSITION({commit}, payload) {
            commit('SET_SCROLL_POSITION', payload);
        }
    },

    plugins: [vuexLocal.plugin]
})
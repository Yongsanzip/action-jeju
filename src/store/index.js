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
        }
    },

    plugins: [vuexLocal.plugin]
})
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
        searchValue: '',
        searchTab: '',
        selectedSearchItem: 0
    },
    getters:{
        GET_MB_ID(state) {
            return state.mb_id;
        },
        GET_SEARCH_VALUE(state) {
            return state.searchValue;
        },
        GET_SELECTED_SEARCH_TAB(state) {
            return state.searchTab;
        },
        GET_SELECTED_SEARCH_ITEM(state) {
            return state.selectedSearchItem;
        }
    },
    mutations:{
        SET_MB_ID(state, payload){
            state.mb_id = payload
        },
        SET_SEARCH_VALUE(state, payload){
            state.searchValue = payload
        },
        SET_SELECTED_SEARCH_TAB(state, payload) {
            state.searchTab = payload
        },
        SET_SELECTED_SEARCH_ITEM(state, payload) {
            state.selectedSearchItem = payload
        }
    },
    actions:{
        SAVE_MB_ID({commit}, payload) {
            commit('SET_MB_ID', payload);
        },
        SAVE_SEARCH_VALUE({commit}, payload) {
            commit('SET_SEARCH_VALUE', payload);
        },
        SAVE_SELECTED_SEARCH_TAB({commit}, payload) {
            commit('SET_SELECTED_SEARCH_TAB', payload);
        },
        SAVE_SELECTED_SEARCH_ITEM({commit}, payload) {
            commit('SET_SELECTED_SEARCH_ITEM', payload);
        }
    },

    plugins: [vuexLocal.plugin]
})
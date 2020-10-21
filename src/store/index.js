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
    },
    getters:{
        GET_MB_ID(state) {
            return state.mb_id;
        },
        GET_IS_SHOW_LOADING(state) {
            return state.is_show_loading;
        }
    },
    mutations:{
        SET_MB_ID(state, payload){
            state.mb_id = payload
        },
        SET_IS_SHOW_LOADING(state, payload){
            state.is_show_loading = payload
        }
    },
    actions:{
        SAVE_MB_ID({commit}, payload) {
            commit('SET_MB_ID', payload);
        },
        SAVE_IS_SHOW_LOADING({commit}, payload) {
            console.log("SAVE_IS_SHOW_LOADING, ", payload)
            commit('SET_IS_SHOW_LOADING', payload);
        }
    },

    plugins: [vuexLocal.plugin]
})
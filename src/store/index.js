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
        mb_id: null
    },
    getters:{
        GET_MB_ID(state) {
            return state.mb_id;
        }
    },
    mutations:{
        SET_MB_ID(state, payload){
            state.mb_id = payload
        }
    },
    actions:{
        SAVE_MB_ID({commit}, payload) {
            commit('SET_MB_ID', payload);
        }
    },

    plugins: [vuexLocal.plugin]
})
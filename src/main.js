import Vue from 'vue'
import App from './App.vue'
import { router } from './routes/index'
import store from "./store/index";
import axios from 'axios'

//Validation 체크를 위한 import
import Vuelidate from "vuelidate/src";
Vue.use(Vuelidate);

//alert,
import VueSimpleAlert from "vue-simple-alert";
Vue.use(VueSimpleAlert);

//naver map
import naver from 'vue-naver-maps';
Vue.use(naver,{
  clientID: 'lv550rkczj',
  useGovAPI: false,
})

//daum postcode
import VueDaumPostcode from "vue-daum-postcode"
Vue.use(VueDaumPostcode);

//meta tag
// import Meta from 'vue-meta';
// Vue.use(Meta);

import {VueHammer} from "vue2-hammer"
Vue.use(VueHammer);

import moment from 'moment';
Vue.use(require('vue-moment'), {
  moment
});

import 'moment/locale/ko';
import '@/assets/css/general.css'
window.Kakao.init("be52e5e7eb201e67d026938d9fbf8b83");

Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app')

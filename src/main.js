/** 主入口js */
import Vue from 'vue';
// import Cookies from 'js-cookie'
import i18n from './lang' // internationalization
import App from './App.vue';
import router from './router';
import store from './store';
import setting from './config/setting';
import permission from '@/utils/permission';
import components from '@/utils/components';
import '@/plugins/vue-echarts'
import VueClipboard from 'vue-clipboard2';
import './config/axios-config';
import EleAdmin from 'ele-admin';
import './styles/index.scss';
import './assets/icon/icon.css'
import './assets/icon/daofengicon.css'
import './assets/icon/daofengicon2.css'
import debounce from '@/utils/debounce.js'
import * as filters from '@/filters'
Vue.config.productionTip = false;
Vue.prototype.$setting = setting;
Vue.prototype.components = components; // 公用方法
Vue.prototype.$debounce = debounce;
import VueCompositionAPI from '@vue/composition-api'
Vue.use(EleAdmin, {
  size: 'medium',
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(permission);
Vue.use(VueClipboard);
Vue.use(VueCompositionAPI)

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))


new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');

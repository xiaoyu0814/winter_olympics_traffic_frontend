import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './vuex/store'
import router from './router'
import api from './api/index'
import path from './api/path'
import App from './App.vue'
import map from '@/utils/map'
import utils from '@/utils/utils'

import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '7b4f153e6a0c1bb9b618b1cd4a04d152',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.15'
});
Vue.use(ElementUI);
Vue.prototype.$http = api;
Vue.prototype.$path = path;
Vue.prototype.$map = map;
Vue.prototype.$utils = utils;
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
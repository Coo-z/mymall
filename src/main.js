import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'cropperjs/dist/cropper.css';

// 引入全局样式
import '@/assets/css/jd.css'

//引入 swiper.min.css的样式
import 'swiper/css/swiper.min.css'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)


import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

// 引入 axios 封装的 api 接口
import Api from './api'
Vue.prototype.Api = Api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

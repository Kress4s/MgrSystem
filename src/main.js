import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'

import './plugins/element.js'

// 引入全局样式
import './assets/index.css'

// 引入图标样式

// axios的配置
import axios from 'axios'
axios.defaults.baseURL = 'http://106.12.11.162:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')

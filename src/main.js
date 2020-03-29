import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'

import './plugins/element.js'

// 引入全局样式
import './assets/index.css'

// 引入图标样式

// 使用treeTable
import ZkTable from 'vue-table-with-tree-grid'

// axios的配置
import axios from 'axios'
axios.defaults.baseURL = 'http://106.12.11.162:8888/api/private/v1/'
// 所有接口验证token，请求拦截器，除了登录接口
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须返回config对象
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 注册vue全局时间格式化过滤器(全局使用)
Vue.filter('timeFormat', function (timeStr) {
  var ts = new Date(timeStr)
  var Y = ts.getFullYear()
  var M = ts.getMonth()
  var d = ts.getDay()
  var h = ts.getHours()
  var m = ts.getMinutes()
  var s = ts.getSeconds()
  return `${Y}-${M}-${d} ${h}:${m}:${s}`
})

// 全局注册treeTable
Vue.component(ZkTable.name, ZkTable)

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')

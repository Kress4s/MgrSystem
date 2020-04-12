// 开发阶段的打包入口
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'

import './plugins/element.js'

// 引入全局样式
import './assets/global.css'

// 引入图标样式

// 使用treeTable
import ZkTable from 'vue-table-with-tree-grid'

// 响应进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// axios的配置
import axios from 'axios'
axios.defaults.baseURL = 'http://106.12.11.162:8888/api/private/v1/'
// 在request 拦截器中，展示进度条 NProgress.start()
// 所有接口验证token，请求拦截器，除了登录接口
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须返回config对象
  return config
})
// 在response拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 注册vue全局时间格式化过滤器(全局使用)
Vue.filter('timeFormat', function (timeStr) {
  var ts = new Date(timeStr)
  var Y = ts.getFullYear()
  var M = (ts.getMonth() + 1 + '').padStart(2, '0')
  var d = (ts.getDate() + '').padStart(2, '0')
  var h = (ts.getHours() + '').padStart(2, '0')
  var m = (ts.getMinutes() + '').padStart(2, '0')
  var s = (ts.getSeconds() + '').padStart(2, '0')
  return `${Y}-${M}-${d} ${h}:${m}:${s}`
})

// 全局注册treeTable
Vue.component(ZkTable.name, ZkTable)

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')

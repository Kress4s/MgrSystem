import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/user/Users.vue'
import Roles from '../views/rights/Roles.vue'
import RightsList from '../views/rights/RightsList.vue'
import GoodsList from '../views/goods/GoodsList.vue'
import Categories from '../views/goods/Categories.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      // 首页
      { path: 'welcome', component: Welcome },
      // 用户管理
      { path: 'users', component: Users },
      // 权限管理
      { path: 'roles', component: Roles },
      { path: 'rights', component: RightsList },
      // 商品管理
      { path: 'goods', component: GoodsList },
      { path: 'categories', component: Categories }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是哪个函数， 表示放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue')
  }, {
    path: '/home',
    name: 'Home',
    component:()=>import('@/views/home.vue'),
    children: [
      {
        path: '',
        name: 'welcome',
        component: () => import('@/views/welcome.vue')
      }, {
        path: '/users',
        name: 'user',
        component: () => import('@/components/user/user.vue')
      }, {
        path: '/roles',
        name: 'role',
        component: () => import('@/components/power/role.vue')
      }, {
        path: '/rights',
        name: 'power',
        component: () => import('@/components/power/power.vue')
      }, {
        path: '/goods',
        name: 'goodlist',
        component: () => import('@/components/goods/goodlist.vue')
      }, {
        path: '/params',
        name: 'params',
        component: () => import('@/components/goods/params.vue')
      }, {
        path: '/categories',
        name: 'cate',
        component: () => import('@/components/goods/cate.vue')
      }, {
        path: '/orders',
        name: 'orderlist',
        component: () => import('@/components/order/orderlist.vue')
      }, {
        path: '/reports',
        name: 'report',
        component: () => import('@/components/report/report.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 添加路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router

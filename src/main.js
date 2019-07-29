import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from '@/router/router.js'
// 引入组件与样式
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式
import '@/styles/index.less'
// 添加导航守卫
router.beforeEach((to, from, next) => {
  // 判断用户是否登陆过或者是否跳转到login页,如果是则继续(登录成功时候会写入对应token令牌)
  var token = localStorage.getItem('itcast_manage_34_token')
  if (token || to.path === '/login') {
    next()
  } else {
    // 否则,重定向到登陆页
    next({ name: 'login' })
  }
})

// 注册
Vue.use(ElementUi)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

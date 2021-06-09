import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import './directive' // 事件
import ElementUI from 'element-ui'
import '@/styles/theme/index.css'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/styles/index.scss' // global css
import '@/styles/my-scss.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
// import '@/permission' // permission control
import request from '@/utils/request'
// 引入自定义js
import utilsPro from './utilsPro'

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('./store/$vuex.mixin.js')
Vue.mixin(vuexStore)

// Vue.use(ElementUI, { locale })
Vue.use(ElementUI)

Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$http = request
Vue.prototype.$utilsPro = utilsPro.utilsPro
Vue.prototype.validator = utilsPro.validator

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

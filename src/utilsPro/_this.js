import utilsPro from '@/utilsPro'
let $store = require('@/store')
import $http from '@/utils/request'
import $router from '@/router'
// import { resetRouter } from '@/router'

const install = {
  ...$store.default.state, // 所有挂载在 vuex里面的值
  $vuex (name, value) {
    $store.default.commit('$vuexStore', {
      name, value
    })
  },
  $http,
  $router,
  utilsPro,
  // resetRouter
}


export default {
  ...install
}

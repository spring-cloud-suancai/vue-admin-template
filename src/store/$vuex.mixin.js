let { mapState } = require('vuex')
let store = require('@/store')

// 尝试将用户在根目录中的store/index.js的vuex的state变量，全部加载到全局变量中
let $uStoreKey = [];
try {
  $uStoreKey = store.default.state ? Object.keys(store.default.state) : [];
} catch (e) {

}

module.exports = {
  beforeCreate () {
    // 将vuex方法挂在到$vuex中
    // 使用方法为：如果要修改vuex的state中的user.name变量为"史诗" => this.$vuex('user.name', '史诗')
    // 如果要修改vuex的state的version变量为1.0.1 => this.$vuex('version', '1.0.1')
    this.$vuex = (name, value) => {
      this.$store.commit('$vuexStore', {
        name, value
      })
    }
  },
  computed: {
    // 将vuex的state中的所有变量，解构到全局混入的mixin中
    ...mapState($uStoreKey)
  }
}

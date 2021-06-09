import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// import { constantRoutes } from './constantRoutes'

let lifeData = {};

try {
  // 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
  lifeData = JSON.parse(localStorage.getItem('lifeData'))
  lifeData = lifeData || {}
} catch (e) {

}

// 需要永久存储，且下次 项目启动需要取出的，在state中的变量名
// vuex：页面刷新，值就会重置，所以需要放到 localStorage里
let saveStateKeys = ['vuex_user', 'vuex_sidebar', 'vuex_sidebarLogo', 'vuex_fixedHeader'];

// 保存变量到本地存储中
const saveLifeData = function (key, value) {
  // 判断变量名是否在需要存储的数组中
  if (saveStateKeys.indexOf(key) != -1) {
    // 获取本地存储的lifeData对象，将变量添加到对象中
    let tmp = JSON.parse(localStorage.getItem('lifeData'))
    // 第一次打开APP，不存在lifeData变量，故放一个{}空对象
    tmp = tmp ? tmp : {};
    tmp[key] = value;
    // 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
    localStorage.setItem('lifeData', JSON.stringify(tmp))
  }
}

const store = new Vuex.Store({
  state: {
    // 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
    // 加上vuex_前缀，是防止变量名冲突，也让人一目了然
    vuex_user: lifeData.vuex_user || { id: '', avatarUrl: '', nickname: '' },
    // vuex_menu: lifeData.vuex_menu ? lifeData.vuex_menu : [],
    vuex_sidebar: lifeData.vuex_sidebar || { opened: true, withoutAnimation: false }, // 手机模式下：withoutAnimation = true
    vuex_sidebarLogo: lifeData.vuex_sidebarLogo === undefined ? true : lifeData.vuex_sidebarLogo,
    vuex_fixedHeader: lifeData.vuex_fixedHeader === undefined ? true : lifeData.vuex_fixedHeader,
    // 如果vuex_version无需保存到本地永久存储，无需lifeData.vuex_version方式
    // vuex_version: '1.0.0',
    vuex_device: 'desktop',
    vuex_yes_no_dict: [{ name: '是', value: '1' }, { name: '否', value: '0' }],
    vuex_default_avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
    // vuex_socket_msg_list: [], // socket 消息队列
    vuex_socket_msg_temp: { code: '', codeDescription: '' }, // 用于全局接收 socket的唯一标识以及标识的中文含义
  },
  mutations: {
    $vuexStore (state, payload) {
      // 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
      let nameArr = payload.name.split('.');
      let saveKey = '';
      let len = nameArr.length;
      if (len >= 2) {
        let obj = state[nameArr[0]];
        for (let i = 1; i < len - 1; i++) {
          obj = obj[nameArr[i]];
        }
        obj[nameArr[len - 1]] = payload.value;
        saveKey = nameArr[0];
      } else {
        // 单层级变量，在state就是一个普通变量的情况
        state[payload.name] = payload.value;
        saveKey = payload.name;
      }
      // 保存变量到本地，见顶部函数定义
      saveLifeData(saveKey, state[saveKey])
    }
  }
})

export default store

<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data () {
    return {
      socket: '',
    }
  },
  computed: {
    key () {
      return this.$route.path
    }
  },
  created () {
    // 每次打开页面时，或者刷新页面时
    this.init()
  },
  methods: {
    init () {
      this.getUserInfo()

      this.connectionToSocket()
    },
    getUserInfo () {
      this.$http({
        url: '/user-service/user/info',
        method: 'post',
      }).then((res) => {
        this.$vuex('vuex_user', res.data)
      })
    },
    connectionToSocket () {
      // if (!this.vuex_user.id) {
      //   console.log("连接 socket失败：暂未登录！")
      //   return
      // }

      if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
      }
      if (window.WebSocket) {
        // this.socket = new WebSocket(`ws://${process.env.VUE_APP_SOCKET_URL}/ws?uid=${this.vuex_user.id}`);
        if (!this.socket) {
          this.socket = new WebSocket(`ws://${process.env.VUE_APP_SOCKET_URL}/ws`);
        }

        this.socket.onmessage = ({ data }) => {
          // var ta = document.getElementById('responseText');
          // ta.value += event.data + "\r\n";

          // console.log('socket-data', data)

          // let msgList = JSON.parse(JSON.stringify(this.vuex_socket_msg_list))

          // if (msgList.length >= 50) {
          //   msgList.shift() // 移除最前面的元素
          // }
          // msgList.push(JSON.parse(data))

          data = JSON.parse(data) || { code: '', codeDescription: '' }

          this.$vuex('vuex_socket_msg_temp', { code: data.code, codeDescription: data.codeDescription })
        }
        this.socket.onopen = (event) => {
          // var ta = document.getElementById('responseText');
          // ta.value = "Netty-WebSocket服务器。。。。。。连接  \r\n";
          console.log("Netty-WebSocket服务器。。。。。。连接 \r\n")
        }
        this.socket.onclose = (event) => {
          // var ta = document.getElementById('responseText');
          // ta.value = "Netty-WebSocket服务器。。。。。。关闭 \r\n";
          console.log("Netty-WebSocket服务器。。。。。。关闭 \r\n")
        }
      } else {
        // alert("您的浏览器不支持WebSocket协议！");
        console.log("您的浏览器不支持WebSocket协议！")
      }
    },
    // send (message) {
    //   // if (!window.WebSocket || !this.vuex_user.id) { return }
    //   if (!window.WebSocket) { return }
    //   if (this.socket.readyState == WebSocket.OPEN) {
    //     this.socket.send(message);
    //   } else {
    //     // alert("WebSocket 连接没有建立成功！");
    //     console.log("WebSocket 连接没有建立成功！")
    //   }
    // }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>

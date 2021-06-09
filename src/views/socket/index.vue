<template>
  <div class="app-container">

    <LeftWResize>
      <div slot="left">
        <!-- 消息队列：
        <div v-for="(item,index) in vuex_socket_msg_list" :key="index">
          {{item.contentPre + item.content}}
        </div> -->
      </div>
      <!-- <div slot="right"> -->
      <!-- <el-input type="textarea" placeholder="请输入内容" v-model="inputForm.content" maxlength="20000" show-word-limit :autosize="{ minRows: 6, maxRows: 10}"></el-input> -->

      <!-- <div class="m-t-10"> -->
      <!-- <el-button @click="sendByUid()">发送</el-button> -->
      <!-- <el-button @click="send2All()">发给所有</el-button> -->
      <!-- </div> -->
      <!-- </div> -->
    </LeftWResize>

  </div>
</template>

<script>
import LeftWResize from '@/views/components/LeftWResize'
export default {
  components: {
    LeftWResize
  },
  data () {
    return {
      inputForm: {}
    }
  },
  methods: {
    sendByUid () {

    },
    send2All () {
      // this.$http({
      //   url: '/websocket-service/websocket/send2All',
      //   method: 'post',
      //   data: this.inputForm
      // }).then(res => {
      //   this.$message.success(res.msg)
      // }).catch(() => {
      // })
    }
  }
}
</script>

<style>
</style>

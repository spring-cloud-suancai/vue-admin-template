<template>
  <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">

    <div class="title-container">
      <h3 class="title">登 录</h3>
    </div>

    <el-form-item prop="accountNumber" class="my-el-form-item">
      <span class="svg-container">
        <svg-icon icon-class="user" />
      </span>
      <el-input v-model="loginForm.accountNumber" placeholder="登录名" name="accountNumber" type="text" tabindex="1" auto-complete="on" />
    </el-form-item>

    <el-form-item prop="password" class="my-el-form-item">
      <span class="svg-container">
        <svg-icon icon-class="password" />
      </span>
      <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
      <span class="show-pwd" @click="showPwd">
        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
      </span>

    </el-form-item>

    <el-form-item prop="rememberMe">
      <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
    </el-form-item>

    <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>

    <div class="tips">
      <!-- <span >注册</span> -->
      <!-- <el-button type="text">注册</el-button> -->
      <el-link style="margin-right:20px;" :underline="false" type="info" @click="$router.push({ path: '/reg' })">去注册</el-link>
      <el-link :underline="false" type="info">忘记密码</el-link>
      <!-- <el-button type="text">忘记密码</el-button> -->
      <!-- <span>忘记密码</span> -->
    </div>

  </el-form>
</template>

<script>
export default {
  // name: 'loginPre',
  data () {
    return {
      loginForm: {
        // accountNumber: 'admin',
        // password: 'suancai',
        rememberMe: false
      },
      loading: false,
      passwordType: 'password',
      // redirect: '',
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          let temp = JSON.parse(JSON.stringify(this.loginForm))
          let sha256 = require("js-sha256").sha256 // 这里用的是require方法，所以没用import
          temp.password = sha256(temp.password) // 要加密的密码

          this.$http({
            url: '/user-service/login',
            method: 'post',
            data: { ...temp }
          }).then((res) => {

            this.$message.success(res.msg)

            localStorage.setItem("jwt", res.data.jwt)

            this.$vuex('vuex_user.id', res.data.userId)

            // this.$router.push({ path: this.redirect || '/' })
            // this.$router.push({ path: '/' })
            this.loading = false

            setTimeout(() => {
              location.href = '/' // 不使用 this.$router.push({ path: '/' }) 主要是为了刷新路由
            }, 20) // 这里使用 setTimeout，才可以正确调用 $message.success，不然不会调用的，而且 20刚刚好

          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

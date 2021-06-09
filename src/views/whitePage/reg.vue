<template>

  <el-form ref="regForm" :model="regForm" class="login-form" label-position="left">

    <div class="title-container">
      <h3 class="title">邮 箱 注 册</h3>
    </div>

    <el-form-item class="my-el-form-item" prop="email" :rules="[{ validator: validator.validateEmail, trigger: 'change' }]">
      <span class="svg-container">
        <svg-icon icon-class="user" />
      </span>
      <el-input v-model="regForm.email" placeholder="邮箱" type="text" tabindex="1" />
    </el-form-item>

    <el-form-item class="my-el-form-item" prop="password" :rules="[{ validator: validator.validatePassword, trigger: 'change' }]">
      <span class="svg-container">
        <svg-icon icon-class="password" />
      </span>
      <el-input ref="password" :key="passwordType" v-model="regForm.password" :type="passwordType" placeholder="密码" tabindex="2" @keyup.enter.native="handleReg" />
      <span class="show-pwd" @click="showPwd">
        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
      </span>
    </el-form-item>

    <el-form-item class="my-el-form-item regForm-code-form-item" prop="code" :rules="[{ validator: validator.validateCode, trigger: 'change' }]">
      <span class="svg-container">
        <svg-icon icon-class="form" />
      </span>
      <el-input v-model="regForm.code" placeholder="邮箱验证码" type="text" tabindex="3" maxlength="6" />

      <el-button style="margin-right: 10px" @click="sendCode()" :loading="sendCodeBtnLoading">{{ sendCodeBtnText }}</el-button>
    </el-form-item>

    <el-button :loading="loading" type="success" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleReg">注 册</el-button>

    <div class="tips">
      <!-- <span >注册</span> -->
      <!-- <el-button type="text">注册</el-button> -->
      <el-link style="margin-right:20px;" :underline="false" type="info" @click="$router.push({ path: '/login' })">去登录</el-link>
      <el-link :underline="false" type="info">忘记密码</el-link>
      <el-link :underline="false" type="info"></el-link>
      <!-- <el-button type="text">忘记密码</el-button> -->
      <!-- <span>忘记密码</span> -->
    </div>

  </el-form>

</template>

<script>
export default {
  data () {
    return {
      regForm: {
        // accountNumber: 'admin',
        // password: 'suancai'
      },
      loading: false,
      passwordType: 'password',
      // redirect: '',
      sendCodeBtnText: '发送验证码',
      sendCodeBtnLoading: false,
      sendCodeCountdown: 60,
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
    sendCode () {
      this.$refs.regForm.validateField('email', msg => {
        if (msg) {
          return
        }

        // this.sendCodeBtnText = '重新发送'
        this.sendCodeBtnLoading = true
        this.sendCodeCountdown = 60
        this.sendCodeBtnText = '重新发送 ' + this.sendCodeCountdown + ' 秒'

        // 重新发送 60 秒
        let interval = setInterval(() => {
          this.sendCodeCountdown--
          this.sendCodeBtnText = '重新发送 ' + this.sendCodeCountdown + ' 秒'
          if (this.sendCodeCountdown <= 0) {
            this.sendCodeBtnLoading = false
            this.sendCodeBtnText = '重新发送'
            clearInterval(interval)
          }
        }, 1000)

        this.$http({
          url: '/user-service/reg/email/sendCode',
          method: 'post',
          data: { email: this.regForm.email }
        }).then((res) => {
          this.$message.success(res.msg)
        }).catch(() => {
          this.sendCodeBtnText = '重新发送'
          this.sendCodeBtnLoading = false
          clearInterval(interval)
        })
      })
    },
    handleReg () {
      this.$refs.regForm.validate(valid => {
        if (valid) {
          this.loading = true

          let temp = JSON.parse(JSON.stringify(this.regForm))
          let sha256 = require("js-sha256").sha256 // 这里用的是require方法，所以没用import
          temp.password = sha256(temp.password) // 要加密的密码
          temp.oldPassword = this.regForm.password // 未加密的密码，用于后台校验密码是否符合要求

          this.$http({
            url: '/user-service/reg/email',
            method: 'post',
            data: { ...temp }
          }).then((res) => {

            this.$message.success(res.msg)

            // localStorage.setItem("jwt", res.data.jwt)

            // this.$router.push({ path: this.redirect || '/' })
            this.$router.push({ path: '/login' })

            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
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

  .regForm-code-form-item {
    ::v-deep .el-form-item__content {
      display: flex;
      align-items: baseline;
    }
  }
}
</style>

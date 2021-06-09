const install = {

  validateEmail (rule, value, callback) {
    if (!value) {
      return callback(new Error('不能为空'))
    }
    if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
      return callback(new Error('邮箱格式错误'))
    }
    return callback()
  },

  validatePassword (rule, value, callback) {
    if (!value) {
      return callback(new Error('不能为空'))
    }
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(value)) {
      return callback(new Error('密码限制：必须包含大小写字母和数字，可以使用特殊字符，长度8-20'))
    }
    return callback()
  },

  validateCode (rule, value, callback) {
    if (!value) {
      return callback(new Error('不能为空'))
    }
    if (!/^[A-Za-z0-9]{6}$/.test(value)) {
      return callback(new Error('请输入：6位数的验证码'))
    }
    return callback()
  },

}

export default {
  ...install
}

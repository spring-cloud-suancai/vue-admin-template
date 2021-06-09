import axios from 'axios'
import { Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
// import Vue from 'vue'
// import Router from '@/router'
import _this from '@/utilsPro/_this'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 180000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    config.headers['Authorization'] = localStorage.getItem("jwt")

    if (config.method === 'get') {
      config.paramsSerializer = (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }

    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {

    const newJwt = response.headers['new-jwt']

    if (newJwt) {
      // 重新赋值 jwt
      localStorage.setItem("jwt", newJwt)
    }

    const res = response.data

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200 || !res.success) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      if (res.code === 100111) { // 这是 后台未登录的错误代码
        localStorage.clear()
        _this.$vuex('vuex_user', {})

        setTimeout(() => {
          location.href = '/login'
        }, 50)
      }

      return Promise.reject(new Error(res.msg || 'Error')) // 这里会 触发 catch，意思是：只要 code 不等于 200 或者 res.success === false，都不会走 then，而去走 catch
    } else {
      return res
    }
  },
  error => {
    // 所有的请求错误，例如 500 404 错误

    Message({
      message: '请求错误 (灬ꈍ ꈍ灬) ' + error.message,
      type: 'error',
      duration: 5 * 1000
    })

    return Promise.reject(error) // 这里也会触发 catch
  }
)

export default service

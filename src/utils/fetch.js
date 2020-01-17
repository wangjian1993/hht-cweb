import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '../store'

// 创建axios实例
const type = localStorage.getItem('type')
console.log(localStorage.getItem('type'))
var service

switch (type) {
  case '1':
    console.log('111')
    service = axios.create({
      baseURL: process.env.BASE_API1, // api的base_url
      timeout: 5000 // 请求超时时间
    })
    break
  case '2':
    console.log('222')
    service = axios.create({
      baseURL: process.env.BASE_API2, // api的base_url
      timeout: 5000 // 请求超时时间
    })
    break
  case '3':
    console.log('3333')
    service = axios.create({
      baseURL: process.env.BASE_API3, // api的base_url
      timeout: 5000 // 请求超时时间
    })
    break
  case '4':
    console.log('4444')
    service = axios.create({
      baseURL: process.env.BASE_API4, // api的base_url
      timeout: 5000 // 请求超时时间
    })
    break
  case '5':
    console.log('55555')
    service = axios.create({
      baseURL: process.env.BASE_API5, // api的base_url
      timeout: 5000 // 请求超时时间
    })
    break
  default:
    console.log('6666')
    service = axios.create({
      baseURL: process.env.BASE_API5, // api的base_url
      timeout: 5000 // 请求超时时间
    })
    break
}

// request 拦截器
service.interceptors.request.use(config => {
  // 请求之前要做的事情
  if (store.getters.token) {
    //  config.headers['X-Token'] = store.getters.token
    // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// response拦截器
service.interceptors.response.use(response => response, error => {
  console.log('err' + error)
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

export default service

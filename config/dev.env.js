var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://devicef6s.alilo.com.cn/"',   // f6s
  // BASE_API: '"http://device.alilo.com.cn/hiyun/"',   // j6
  // BASE_API: '"http://device.alilo.com.cn/g63/"',   // g63
  BASE_API: '"http://device.alilo.com.cn/g9s/"',   // g9s
})

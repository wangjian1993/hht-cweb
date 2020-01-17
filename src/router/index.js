import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// layout
import Layout from 'components/layout/layout'
// login
const Login = _import('login/index')
// component
// const componentIndex = _import('component/index')
// const Markdown = _import('component/markdown')
// const JsonEditor = _import('component/jsoneditor')
// errPage
const Err404 = _import('error/404')
const Err401 = _import('error/401')
// excel
// const ExcelDownload = _import('excel/index')
// device
const deviceList = _import('device/device-list/device-list')
const deviceClass = _import('device/device-class/device-class')
const deviceType = _import('device/device-type/device-type')
const deviceConfig = _import('device/device-config/device-config')
const deviceUpgrade = _import('device/device-upgrade/device-upgrade')
// const checkState = _import('device/device-upgrade/checkState')
// custom
const customList = _import('custom/custom-list/custom-list')
// wxdevice
// const wxdevice = _import('wxdevice/index')
const wxDeviceList = _import('wxdevice/wxdevice-list/index')
const vendorList = _import('wxdevice/vendor-list/vendor-list')
const wxuserList = _import('wxdevice/wxuser-list/index')
// const count = _import('wxdevice/count/index')
Vue.use(Router)
export const constantRouterMap = [
  {path: '/login', component: Login, hidden: true},
  {path: '/', component: Layout, redirect: '/devices/list', hidden: true, name: '首页'},
  {path: '/404', component: Err404, hidden: true},
  {path: '/401', component: Err401, hidden: true}
]

export default new Router({
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/devices',
    component: Layout,
    redirect: '/devices/list',
    name: '设备管理',
    icon: 'quanxian',
    children: [
      {path: 'list', component: deviceList, name: '设备列表'},
      {path: 'class', component: deviceClass, name: '设备类型'},
      {path: 'type', component: deviceType, name: '设备型号列表'},
      {path: 'config', component: deviceConfig, name: '设备配置列表'},
      {path: 'upgrade', component: deviceUpgrade, name: '升级管理'}
      // {path: 'checkMac', component: checkState}
    ]
  },
  {
    path: '/custom',
    component: Layout,
    redirect: '/custom/list',
    name: '客户管理',
    icon: 'quanxian',
    children: [
      {path: 'list', component: customList, name: '客户列表'}
    ]
  },
  {
    path: '/wxdevice',
    component: Layout,
    redirect: '/wxdevice/list',
    name: '微信设备管理',
    icon: 'quanxian',
    meta: {role: ['admin']},
  //  noDropdown: true,
    children: [
      {path: 'list', component: wxDeviceList, name: '微信设备列表', meta: {role: ['admin']}},
      {path: 'wxuser', component: wxuserList, name: '微信用户列表', meta: {role: ['admin']}},
      {path: 'vendor', component: vendorList, name: '厂商列表', meta: {role: ['admin']}}]
      // {path: 'count', component: count, name: '数据统计', meta: {role: ['admin']}}
  },
  { path: '*', redirect: '/404', hidden: true }
]

import axios from 'axios'
import { Message } from 'element-ui'
// 获取微信设备type
export const api = 'http://wifi.alilo.com.cn/xiaohai'

export function getAllWXType () {
  const url = `${api}/manager/type/list`
  return axios.get(url)
}
// 获取微信设备列表
export function getWXDeviceList (page = 1, pageSize = 15, avaliable, type, deviceId, mac) {
  deviceId = deviceId || ''
  mac = mac || ''
  const url = `${api}/manager/device/list?page=${page}&page_size=${pageSize}&type=${type}&avaliable=${avaliable}&deviceId=${deviceId}&mac=${mac}`
  return axios.get(url)
}
export function applyWxDev (type, num, productId) {
  const url = `${api}/device/authorize?type=${type}&num=${num}&productId=${productId}`
  return axios.get(url)
}
// 更新设备mac地址
export function updateDevInfo (mac, deviceId) {
  if (mac === '') {
    Message({
      message: 'mac 不能为空！',
      type: 'error',
      duration: 5 * 1000
    })
    return false
  }
  const url = `${api}/device/updateDevInfo?mac=${mac}&deviceId=${deviceId}`
  return axios.get(url)
}
//  清理设备二维码
export function clearMac (deviceId) {
  const url = `${api}/manager/device/clearMac?deviceId=${deviceId}`
  return axios.get(url)
}
// 厂商列表
export function getManagerList (page, pageSize) {
  const url = `${api}/manager/type/list?page  =${page}&page_size=${pageSize}`
  return axios.get(url)
}
// 增加厂商
export function addManagerType (type) {
  const url = `${api}/manager/type/add`
  return axios.post(url, {type})
}
// 修改厂商
export function updateManagerType (id, type) {
  const url = `${api}/manager/type/update`
  return axios.post(url, {id, type})
}
// 删除厂商
export function deleteManagerType (id) {
  const url = `${api}/manager/type/delete?id=${id}`
  return axios.get(url)
}

import fetch from 'utils/fetch'
// 公共接口
export function getDevClasses () {
  return fetch({
    url: '/deviceClass/findAll',
    method: 'get'
  })
}
export function getDevTypes () {
  return fetch({
    url: '/deviceType/findAll',
    method: 'get'
  })
}
export function getWxDevTypes () {
  return fetch({
    url: '/deviceType/findAll?isWx=true',
    method: 'get'
  })
}
export function getCustomers () {
  return fetch({
    url: '/customer/getAll',
    method: 'get'
  })
}
// 筛选设备型号
export function queryList (offset = 0, max = 12, devtypeId) {
  return fetch({
    url: `/deviceType/list?offset=${offset}&max=${max}`,
    method: 'get',
    params: {devtypeId}
  })
}
// 设备型号接口
export function getTypeList (offset = 0, max = 12) {
  return fetch({
    url: `/deviceType/list?offset=${offset}&max=${max}`,
    method: 'get'
  })
}
export function deleteDevType (id) {
  return fetch({
    url: '/deviceType/delete',
    method: 'post',
    params: {id}
  })
}
export function addDevType (data) {
  return fetch({
    url: '/deviceType/save',
    method: 'post',
    data: data
  })
}
export function updateDevType (data) {
  return fetch({
    url: '/deviceType/update',
    method: 'post',
    data: data
  })
}
// 设备接口
export function getList (offset = 0, max = 15, devtypeId, did, devid) {
  did = did || ''
  devid = devid || ''
  return fetch({
    url: `/device/list?offset=${offset}&max=${max}`,
    method: 'get',
    params: {devtypeId, did, devid}
  })
}
export function deleteDev (id) {
  return fetch({
    url: '/device/delete',
    method: 'post',
    params: {id}
  })
}
export function addDev (data) {
  return fetch({
    url: '/device/save',
    method: 'post',
    data: data
  })
}
export function updateDev (data) {
  return fetch({
    url: '/device/update',
    method: 'post',
    data: data
  })
}
// http://ai.itinga.cn/device/exportWeChatDevice
export function exportDev (devtypeId) {
  return fetch({
    url: `/device/exportWeChatDevice`,
    method: 'get',
    params: {devtypeId}
  })
}
// 设备类型接口
export function getClassList (offset = 0, max = 15) {
  return fetch({
    url: `/deviceClass/list?offset=${offset}&max=${max}`,
    method: 'get'
  })
}
export function updateDevClass (data) {
  return fetch({
    url: '/deviceClass/update',
    method: 'post',
    data
  })
}
export function addDevClass (data) {
  return fetch({
    url: '/deviceClass/save',
    method: 'post',
    data
  })
}
export function deleteDevClass (id) {
  return fetch({
    url: '/deviceClass/delete',
    method: 'post',
    params: {id}
  })
}
// 升级规则
export function getUpgradeList () {
  return fetch({
    url: '/upgrade/list',
    method: 'get'
  })
}
export function addUpgrade (data) {
  return fetch({
    url: '/upgrade/save',
    method: 'post',
    data
  })
}
export function updateUpgrade (data) {
  return fetch({
    url: '/upgrade/update',
    method: 'post',
    data
  })
}
export function deleteUpgrade (id) {
  return fetch({
    url: '/upgrade/delete',
    method: 'post',
    params: {id}
  })
}

// 上传文件
export function OutMacList (file, hw, sw) {
  return fetch({
    url: `/upgrade/importUpgradeDevice?file=${file}&hw=${hw}&sw=${sw}`,
    method: 'post'
  })
}
export function OutMacList1 (o) {
  return fetch({
    url: `/upgrade/importUpgradeDevice`,
    method: 'post',
    params: {o}
  })
}
// 设备配置接口 deviceType/configItem
export function getOneConfig (id) {
  return fetch({
    url: `/deviceType/configItem`,
    method: 'get',
    params: {id}
  })
}
export function getConfigAll () {
  return fetch({
    url: `/deviceTypeConfigItem/findAll`,
    method: 'get'
  })
}
export function getConfigList (offset = 0, max = 15) {
  return fetch({
    url: `/deviceTypeConfigItem/list?offset=${offset}&max=${max}`,
    method: 'get'
  })
}
export function updateDevConfig (data) {
  return fetch({
    url: '/deviceTypeConfigItem/update',
    method: 'post',
    data
  })
}
export function addDevConfig (data) {
  return fetch({
    url: '/deviceTypeConfigItem/save',
    method: 'post',
    data
  })
}
export function deleteDevConfig (id) {
  return fetch({
    url: '/deviceTypeConfigItem/delete',
    method: 'post',
    params: {id}
  })
}
// 频道接口
export function updateDevTypeChannel (data) {
  return fetch({
    url: '/deviceType/updateChannel',
    method: 'post',
    data
  })
}
export function addDevTypeChannel (data) {
  return fetch({
    url: '/deviceType/addChannel',
    method: 'post',
    data
  })
}
export function deleteDevTypeChannel (id) {
  return fetch({
    url: '/deviceType/rmChannel',
    method: 'post',
    params: {id}
  })
}
// 微信设备接口
export function getWxDevList (offset = 0, max = 15, devtypeId) {
  return fetch({
    url: `/device/wechat/list?offset=${offset}&max=${max}`,
    method: 'get',
    params: {devtypeId}
  })
}
// 微信用户接口
export function getWxUserList (page = 1, pageSize = 20, uid) {
  uid = uid || ''
  return fetch({
    url: `/user/list?page=${page}&pageSize=${pageSize}`,
    method: 'get',
    params: {uid}
  })
}
// 微信在线统计接口
export function count () {
  return fetch({
    url: `/statistics/count`,
    method: 'get'
  })
}
export function onlineUserList (offset = 0, count = 20) {
  return fetch({
    url: `/statistics/onlineUserList?offset=${offset}&count=${count}`,
    method: 'get'
  })
}
export function onlineDeviceList (offset = 0, count = 20) {
  return fetch({
    url: `/statistics/onlineDeviceList?offset=${offset}&count=${count}`,
    method: 'get'
  })
}
// 升级模块
// 查询mac
export function selectMacConfig (mac, hw, sw) {
  return fetch({
    url: `/upgrade/selectMacConfig?mac=${mac}&hw=${hw}&sw=${sw}`,
    method: 'get'
  })
}
// 查询outMac
export function selectOutUpgradeMac(hw, mac) {
  return fetch({
    url: `/upgrade/selectOutUpgradeMac?hw=${hw}&mac=${mac}`,
    method: 'get'
  })
}
// 查询inMac
export function selectInUpgradeMac (hw, sw, upId, mac) {
  return fetch({
    url: `/upgrade/selectInUpgradeMac`,
    method: 'get'
  })
}
// 删除redis缓存
// 删除inMac
export function delInUpgradeMac(hw, sw, upId, mac) {
  return fetch({
    url: `/upgrade/delInUpgradeMac`,
    method: 'get'
  })
}
// 删除outMac
export function delOutUpgradeMac(hw, mac) {
  return fetch({
    url: `/upgrade/delOutUpgradeMac?hw=${hw}&mac=${mac}`,
    method: 'get'
  })
}
// 导入
// 导入inMac
export function importInUpgradeDevice(file, hw, sw, upId) {
  return fetch({
    url: `/upgrade/importInUpgradeDevice`,
    method: 'post'
  })
}
// 导入outMac
export function importOutUpgradeDevice(outmac) {
  return fetch({
    url: `/upgrade/importOutUpgradeDevice`,
    method: 'post',
    params: {outmac}
  })
}

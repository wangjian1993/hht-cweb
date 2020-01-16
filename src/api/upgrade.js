import fetch from 'utils/fetch'
// 升级模块
// 查询升级数量
export function upgradeMsg (hw, sw, page, size) {
  page = page || 0
  size = size || 20
  return fetch({
    url: `/upgrade/devicelist?hw=${hw}&sw=${sw}&page=${page}&page_size=${size}`,
    method: 'get'
  })
}
// 查询mac
export function selectMacConfig (mac, hw, sw) {
  return fetch({
    url: `/upgrade/selectMacConfig?mac=${mac}&hw=${hw}&sw=${sw}`,
    method: 'get'
  })
}
// 批量查询mac
export function selectAllMacConfig(mac, hw, sw) {
  return Promise.all(mac.map((item) => {
    return selectMacConfig(item, hw, sw)
  }))
}
// 查询outMac
export function selectOutUpgradeMac(hw, mac) {
  mac = mac || ''
  return fetch({
    url: `/upgrade/selectOutUpgradeMac?hw=${hw}&mac=${mac}`,
    method: 'get'
  })
}
// 查询inMac
export function selectInUpgradeMac (hw, sw, upId, mac) {
  mac = mac || ''
  return fetch({
    url: `/upgrade/selectInUpgradeMac?hw=${hw}&sw=${sw}&upId=${upId}&mac=${mac}`,
    method: 'get'
  })
}
// 删除redis缓存
// 删除inMac
export function delInUpgradeMac(hw, sw, upId, mac) {
  return fetch({
    url: `/upgrade/delInUpgradeMac?hw=${hw}&sw=${sw}&upId=${upId}&mac=${mac}`,
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

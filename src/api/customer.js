import fetch from 'utils/fetch'
// 获取客户列表
export function getCustomerList (offset = 0, max = 15) {
  return fetch({
    url: `/customer/list?offset=${offset}&max=${max}`,
    method: 'get'
  })
}
export function addCustomer (data) {
  return fetch({
    url: `/customer/save`,
    method: 'post',
    data
  })
}
export function updateCustomer (data) {
  return fetch({
    url: `/customer/update`,
    method: 'post',
    data
  })
}
export function deleteCustomer (id) {
  return fetch({
    url: `/customer/delete`,
    method: 'post',
    params: {id}
  })
}


const userMap = {
  admin: {
    role: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  }
}

export default {
  loginByEmail: config => {
    return userMap['admin']
  },
  getInfo: config => {
    return userMap['admin']
  },
  logout: () => 'success'
}

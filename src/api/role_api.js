import axios from '@/utils/myaxios.js'

// 获取角色列表
export const getRolesList = () => {
  return axios({
    url: 'roles'
  })
}
// 添加角色
export const addRole = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}

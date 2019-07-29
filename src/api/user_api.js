import axios from '@/utils/myaxios.js'
// 登录页面
export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
// 获取所有用户列表
export const getAllUserList = (params) => {
  return axios({
    url: 'users',
    params
  })
}
// 添加用户
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
// 删除用户
export const delUser = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
// 编辑用户
export const editUser = (params) => {
  return axios({
    url: `users/${params.id}`,
    method: 'put',
    data: { email: params.email, mobile: params.mobile }
  })
}
// 设置用户状态
export const setUserState = (id, type) => {
  return axios({
    url: `users/${id}/state/${type}`,
    method: 'put'
  })
}
// 获取角色列表
export const getRolesList = () => {
  return axios({
    url: 'roles'
  })
}
// 获取角色信息
export const getRoleById = (id) => {
  return axios({
    url: `roles/${id}`
  })
}
// 获取用户信息
export const getUserById = (id) => {
  return axios({
    url: `users/${id}`
  })
}
// 分配角色
export const grantRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}

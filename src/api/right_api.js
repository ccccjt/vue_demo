import axios from '@/utils/myaxios.js'

// 获取所有权限数据
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
// 删除用户指定权限
export const delRightByRoleId = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
// 分配用户权限
export const grantRight = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}

// 获取左侧菜单权限
export const getLeftMenu = () => {
  return axios({
    url: 'menus'
  })
}

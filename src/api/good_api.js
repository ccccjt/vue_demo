import axios from '@/utils/myaxios.js'

// 获取所有商品列表
export const getGoodList = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
// 获取分类列表
export const getCategories = (type) => {
  return axios({
    url: 'categories',
    type
  })
}

export const getAttrList = (id, sel) => {
  return axios({
    url: `categories/${id}/attributes`,
    params: { sel }
  })
}

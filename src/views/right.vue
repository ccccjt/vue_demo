<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="authName" label="名称" width="180"></el-table-column>
        <el-table-column prop="path" label="路径" width="180"></el-table-column>
        <el-table-column label="层级">
          <template slot-scope="scope">{{scope.row.level | levelFormat}}</template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
import { getAllRightList } from '@/api/right_api.js'
export default {
  data () {
    return {
      tableData: [{
        authName: '',
        path: '',
        level: ''
      }],
      type: 'list'
    }
  },
  mounted () {
    getAllRightList(this.type).then(res => {
      console.log(res)
      this.tableData = res.data.data
    })
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  }
}
</script>
<style lang='less' scoped>
</style>

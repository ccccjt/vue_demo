<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
 <el-button type="primary" @click="adddialogFormVisible=true">添加角色</el-button>
    <el-dialog title="添加角色" :visible.sync="adddialogFormVisible">
  <el-form :model="addform">
    <el-form-item label="角色名称" :label-width="'120px'">
      <el-input v-model="addform.roleName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" :label-width="'120px'">
      <el-input v-model="addform.roleDesc" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="adddialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </div>
</el-dialog>
    <template>
      <el-table :data="roleList" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="one in scope.row.children"
              :key="one.id"
              style="margin-bottom:10px;border-bottom:1px dashed #ccc"
            >
              <el-col :span="4">
                <el-tag type="success" plain closable @click="delRightByRoleId(scope.row,one.id)">{{one.authName}}</el-tag>
              </el-col>
              <el-col :span="20">
                <el-row v-for="two in one.children" :key="two.id" style="margin:0 10px 10px 0">
                  <el-col :span="4">
                    <el-tag type="info" plain closable @click="delRightByRoleId(scope.row,two.id)">{{two.authName}}</el-tag>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      @click="delRightByRoleId(scope.row,three.id)"
                      type="warning"
                      plain
                      closable
                      v-for="three in two.children"
                      :key="three.id"
                      style="margin:0px 10px 5px 10px"
                    >{{three.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" v-show="scope.row.children.length == 0">没有任何的权限，请先分配！！</el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" style="text-align: center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="描述" width="260px"></el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-share"
              @click="handleShare(scope.row)"
            >分配</el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog title="授权角色" :visible.sync="grantdialogFormVisible">
     <el-tree
  :data="data"
  show-checkbox
  ref="tree"
  node-key="id"
  :default-expanded-keys="defaultExpandedKeys"
  :default-checked-keys="defaultCheckedKeys"
  :props="defaultProps">
</el-tree>
  <div slot="footer" class="dialog-footer">
    <el-button @click="grantdialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="grantRight">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>
<script>
import { delRightByRoleId, getAllRightList, grantRight } from '@/api/right_api.js'
import { getRolesList, addRole } from '@/api/role_api.js'

export default {
  data () {
    return {
      addform: {
        roleName: '',
        roleDesc: ''
      },
      roleList: [],
      grantdialogFormVisible: false,
      adddialogFormVisible: false,
      data: [],
      id: 0,
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    async delRightByRoleId (row, rightId) {
      let res = await delRightByRoleId(row.id, rightId)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: 'success'
        })
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: 'error'
        })
      }
      row.children = res.data.data
    },
    handleShare (row) {
      console.log(row)
      this.id = row.id
      this.defaultCheckedKeys.length = 0
      this.grantdialogFormVisible = true

      getAllRightList('tree').then(res => {
        // console.log(res)
        this.data = res.data.data
        this.data.forEach(item => {
          if (item.children) {
            item.children.forEach(item2 => {
              this.defaultExpandedKeys.push(item2.id)
            })
          }
        })
      })
      row.children.forEach(item => {
        if (item.children) {
          item.children.forEach(item2 => {
            if (item2.children) {
              item2.children.forEach(item3 => {
                this.defaultCheckedKeys.push(item3.id)
              })
            }
          })
        }
      })
    },
    grantRight () {
      console.log(this.$refs.tree.getCheckedNodes())
      var ridstr = ''
      var rids = []
      this.$refs.tree.getCheckedNodes().forEach(item => {
        ridstr += item.id + ',' + item.pid + ','
      })
      // console.log(ridstr)
      // console.log(ridstr.slice(0, -1).split(','))
      rids = [...new Set(ridstr.slice(0, -1).split(','))]
      // console.log(rids.join(','))
      // console.log(rids)
      grantRight(this.id, rids.join(',')).then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error'
          })
        }
        this.grantdialogFormVisible = false
      })
      getRolesList()
        .then(res => {
        // console.log(res)
          this.roleList = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    addRole () {
      addRole(this.addform).then(res => {
        console.log(res)
        if (res.data.meta.status === 201) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success'
          })
          this.adddialogFormVisible = false
          this.addform.roleName = ''
          this.addform.roleDesc = ''
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error'
          })
        }
      })
    }
  },
  mounted () {
    getRolesList()
      .then(res => {
        // console.log(res)
        this.roleList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang='less' scoped>
</style>

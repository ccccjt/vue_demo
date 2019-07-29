<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="listobj.query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 添加用户按钮 -->
    <el-button type="primary" @click="adddialogFormVisible = true">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" style="text-align: center"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="100"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 用户状态列 -->
      <el-table-column label="用户状态" width="80" prop="mg_state">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="userState(scope.row)"
            active-color="skyblue"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
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
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="listobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="adddialogFormVisible">
      <el-form :model="addform" :rules="rules" ref="addform">
        <el-form-item label="用户名" :label-width="'100px'" prop="username">
          <el-input v-model="addform.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="'100px'" prop="password">
          <el-input v-model="addform.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'100px'" prop="email">
          <el-input v-model="addform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="'100px'" prop="mobile">
          <el-input v-model="addform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除用户确认框 -->
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <span>此操作将永久删除该用户, 是否继续?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delUser(delUserId)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editdialogFormVisible" :rules="rules">
      <el-form :model="editform" ref="editform">
        <el-form-item label="用户名" :label-width="'120px'" prop="username">
          <el-input v-model="editform.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'120px'" prop="email">
          <el-input v-model="editform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="'120px'" prop="mobile">
          <el-input v-model="editform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配用户 -->
    <el-dialog title="分配角色" :visible.sync="grantdialogFormVisible">
  <el-form :model="grantform">
    <el-form-item label="用户名" :label-width="'120px'">
      <el-input v-model="grantform.username" auto-complete="off" disabled></el-input>
    </el-form-item>
    <span style="margin:0 20px 0 60px">请选择</span>
    <el-select v-model="grantform.rid" clearable placeholder="请分配角色">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </el-form>
  <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
</el-dialog>
  </div>
</template>
<script>
import { getAllUserList, addUser, delUser, editUser, setUserState, getRolesList, getUserById,
  grantRole } from '@/api/user_api.js'
export default {
  data () {
    return {
      delUserId: 0,
      value2: true,
      total: 0,
      listobj: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      tableData: [],
      rolesList: [],
      grantdialogFormVisible: false,
      centerDialogVisible: false,
      adddialogFormVisible: false,
      editdialogFormVisible: false,
      grantform: {
        rid: '',
        id: ''
      },
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /\w+@\w+[.]\w+/, message: '邮箱不合法', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入合法手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 删除用户
    // 组件方法
    delUser (id) {
      // console.log(id)
      // 引入方法
      delUser(id).then(res => {
        console.log(res)
        this.centerDialogVisible = false
        if (res.data.meta.status === 200) {
          this.$message({
            message: '用户删除成功',
            type: 'success'
          })
          // 解决了删除尾页最后一条数据时候页面跳转上一页但不刷新的bug
          if (this.total % this.listobj.pagesize === 1) {
            --this.listobj.pagenum
            console.log(this.listobj.pagenum)
            this.init()
          } else this.init()
        }
      })
    },
    // 获取要编辑的用户数据
    handleEdit (row) {
      console.log(row)
      this.editdialogFormVisible = true
      this.editform.id = row.id
      this.editform.username = row.username
      this.editform.mobile = row.mobile
      this.editform.email = row.email
    },
    handleShare (row) {
      this.grantdialogFormVisible = true
      console.log(row)
      this.grantform.username = row.username
      this.grantform.id = row.id
      getRolesList().then(res => {
        console.log(res)
        this.rolesList = res.data.data
      }).catch(err => { console.log(err) })
      getUserById(row.id).then(res => {
        if (res.data.data.rid !== -1) {
          this.grantform.rid = res.data.data.rid
        } else { this.grantform.rid = '' }
        console.log(res)
      })
    },
    // 获取删除id
    handleDelete (id) {
      console.log(id)
      this.centerDialogVisible = true
      this.delUserId = id
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.listobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.listobj.pagenum = val
      this.init()
    },
    // 页面刷新
    init () {
      getAllUserList(this.listobj)
        .then(res => {
          console.log(res)
          this.tableData = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加用户
    // 页面方法
    addUser () {
      console.log(this.addform)
      this.$refs.addform.validate(valid => {
        if (valid) {
          // 引入方法
          addUser(this.addform)
            .then(res => {
              this.adddialogFormVisible = false
              console.log(res)
              if (res.data.meta.status === 201) {
                this.$message({
                  message: '用户添加成功',
                  type: 'success'
                })
                // 清空表单
                this.$refs.addform.resetFields()
                this.init()
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message({
            message: '数据输入不合法',
            type: 'error'
          })
          return false
        }
      })
    },
    editUser () {
      this.$refs.editform.validate(valid => {
        if (valid) {
          editUser(this.editform).then(res => {
            if (res.data.meta.status === 200) {
              this.$message({
                message: '用户编辑成功',
                type: 'success'
              })
              this.editdialogFormVisible = false
              this.init()
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message({
            message: '数据输入不合法',
            type: 'error'
          })
          return false
        }
      })
    },
    async userState (row) {
      // console.log(row)
      let res = await setUserState(row.id, row.mg_state)
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          message: '状态设置成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '状态设置失败，请稍后重试',
          type: 'error'
        })
      }
    },
    async grantRole () {
      let res = await grantRole(this.grantform)
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          message: '角色分配成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '角色分配失败，请稍后重试',
          type: 'error'
        })
      }
      this.grantdialogFormVisible = false
    }
  },

  mounted () {
    this.init()
  },
  // 搜索筛选
  watch: {
    'listobj.query' (a, b) {
      this.init()
    }
  }
}
</script>
<style lang='less' scoped>
.el-input {
  width: 300px;
  margin-right: 20px;
}
.el-pagination {
  position: fixed;
  bottom: 20px;
}
</style>

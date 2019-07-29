<template>
  <div class="login">
    <div class="container">
      <img src="@/assets/avatar.jpg" alt class="avatar" />
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
        <!-- prop：为了配合验证规则，这个prop的属性值就对应着验证规则的名称 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="myicon myicon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="myicon myicon-key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { login } from '@/api/user_api.js'
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // required：必须的
      // message：不满足规则时的提示信息
      // trigger：什么时候触发：blur指失去焦点时触发
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      // 表单loginForm的validate方法用于检测rules的对应元素输入的数据是否符合规则，若符合则返回valid
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          login(this.loginForm)
            .then(res => {
              if (res.data.meta.status === 200) {
                console.log(res)
                // 路由跳转之前先保存token数据到本地存储
                localStorage.setItem('itcast_manage_34_token', res.data.data.token)
                this.$router.push({ name: 'welcome' })
              } else {
                console.log(res)
                this.$message({
                  message: res.data.meta.msg,
                  type: 'error'
                })
              }
            }).catch(err => {
              console.log(err)
              this.$message({
                message: '登陆失败',
                type: 'error'
              })
            })
        } else {
          this.$message({
            message: '数据输入不合法',
            type: 'error'
          })
          return false
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>

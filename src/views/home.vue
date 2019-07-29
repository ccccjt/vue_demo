<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <div class="login"></div>
        <el-menu
          default-active="2"
          :router="true"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="one.id+''" v-for="one in leftMenu" :key="one.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{one.authName}}</span>
            </template>
            <el-menu-item-group v-for="two in one.children" :key="two.id">
              <!-- 细节：下面的index跳转的路由home前面必须加'/'，否则继续点击会再次在url后面拼接参数 -->
              <el-menu-item :index="'/home/'+two.path">
                <i class="el-icon-location"></i>{{two.authName}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>电商后台管理系统</el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getLeftMenu } from '@/api/right_api.js'
export default {
  data () {
    return {
      leftMenu: []
    }
  },
  mounted () {
    getLeftMenu().then(res => {
      // console.log(res)
      this.leftMenu = res.data.data
    })
  }
}
</script>
<style lang='less' scoped>
.home {
  display: flex;
  height: 100%;
  width: 100%;
}
.login {
  background: url("../assets/logo.png") no-repeat;
  height: 60px;
  background-size: cover;
  background-color: #fff;
}
.el-header,
.el-footer {
  background-color: #545c64;
  color: #fff;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  color: #e9eef3;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>

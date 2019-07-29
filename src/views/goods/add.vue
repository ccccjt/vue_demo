<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="active-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs :tab-position="'left'" v-model="active" style="height:500px;">
      <el-tab-pane label="基本信息">
        <el-form :model="addform" ref="addform">
          <el-form-item label="商品名称" :label-width="'120px'">
            <el-input v-model="addform.goods_name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" :label-width="'120px'">
            <el-input v-model="addform.goods_price" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" :label-width="'120px'">
            <el-input v-model="addform.goods_weight" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" :label-width="'120px'">
            <el-input v-model="addform.goods_number" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" :label-width="'120px'">
            <el-cascader
              expand-trigger="hover"
              :options="categories"
              :props="cateprops"
              v-model="addform.goods_cat"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="adddialogFormVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品参数">
        <el-form :model="addform">
        <el-form-item :label="one.attr_name" :label-width="'120px'" v-for="one in attrByMany" :key="one.attr_id" >
          <el-checkbox-group v-model="checkList">
            <el-checkbox :label="two" v-for="(two,index) in one.attr_vals" :key="index"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品属性">
        <el-form :model="attrByOnly" >
          <el-form-item :label="one.attr_name" :label-width="'120px'" v-for="one in attrByOnly" :key="one.attr_id">
            <el-input v-model="one.attr_vals" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片">
        <!-- action:上传的地址(服务器)
          on-preview:点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
          on-remove:文件列表移除文件时的钩子
          on-success: 文件上传成功时的钩子
          file-list:上传的文件列表
        -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :headers="headers"
          :file-list="fileList"
          list-type="picture"
        >
          <el-button size="small" type="primary" @click="uploadFile">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">
        <quillEditor v-model="addform.goods_introduce"></quillEditor>
      </el-tab-pane>
    </el-tabs>
    <el-button type="primary" @click='ceshi'></el-button>
  </div>
</template>
<script>
import { getCategories, getAttrList } from '@/api/good_api.js'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      // 步骤条与标签页选项
      active: 0,
      // 级联选择器数据源
      categories: [],
      // 文件上传请求头
      headers: {},
      // 文件上传列表
      fileList: [],
      // 复选框默认选中数组
      checkList: [],
      // 分类级联选择器
      cateprops: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name'
      },
      // 商品分类数据源
      attrByMany: [],
      attrByOnly: {},
      // attrform: {
      //   attr_name: '',
      //   attr_vals: ''
      // },
      // 添加商品总表
      addform: {
        goods_cat: '',
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      }
    }
  },
  methods: {
    ceshi () {
      console.log(this.addform.goods_introduce)
    },
    // 级联选择器选中第三级选项触发函数
    handleChange (value) {
      console.log(value)
      getAttrList(value[value.length - 1], 'many').then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          // res.data.data[i].attr_vals
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].attr_vals = res.data.data[i].attr_vals.split(',')
          }
          this.attrByMany = res.data.data
          console.log(this.attrByMany)
        }
      }).catch(err => { console.log(err) })

      getAttrList(value[value.length - 1], 'only').then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.attrByOnly = res.data.data
        }
      }).catch(err => { console.log(err) })
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    // 若取消上传会触发移除上传on-remove的钩子
    beforeUpload (file) {
      console.log(file)
      if (file.type.indexOf('image/') !== 0) {
        this.$message({
          message: '上传文件必须是图片',
          type: 'error'
        })
        return false
      }
    },
    // on-preview:点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
    handlePreview (file) {
      console.log(file)
    },
    // on-remove:文件列表移除文件时的钩子
    handleRemove (file, fileList) {
      // 因为取消上传before-upload的钩子会触发移除上传的钩子
      // 取消上传的原理是直接移除上传的文件所以要对比取消上传时触发移除的钩子的数据与直接移除的钩子的数据以此为判断
      if (!file.response) {
        return
      }
      console.log(file)
      console.log(fileList)
      // 这里使用forEach会造成些许浪费，因为forEach不能中断循环，若要优化可以使用for循环遍历删除后用break中止循环
      this.addform.pics.forEach((item, index) => {
        if (item.pic === file.response.data.tmp_path) {
          this.addform.pics.splice(index, 1)
        }
      })
      console.log(this.addform.pics)
    },
    //   on-success: 文件上传成功时的钩子
    handleSuccess (response, file, fileList) {
      // console.log(response)
      // console.log(file)
      // console.log(fileList)
      this.addform.pics.push({ pic: response.data.tmp_path })
      console.log(this.addform.pics)
    },
    // 设置请求头
    uploadFile () {
      var token = localStorage.getItem('itcast_manage_34_token')
      this.headers.Authorization = token
    }
  },
  // 级联选择器分类加载
  mounted () {
    getCategories(3).then(res => {
      //   console.log(res)
      this.categories = res.data.data
    })
  }
}
</script>
<style lang='less' scoped>
</style>

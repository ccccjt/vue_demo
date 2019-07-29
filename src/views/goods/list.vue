<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="pageobj.query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
      <!-- 添加用户按钮 -->
    <el-button type="primary" @click="$router.push({name:'add'})">添加商品</el-button>
    <template>
      <el-table :data="goodList" style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="80"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="80"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column prop="goods_state" label="商品状态" width="80"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200"></el-table-column>
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
      :current-page="goodList.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="goodList.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    </template>
  </div>
</template>
<script>
import { getGoodList } from '@/api/good_api.js'
export default {
  data () {
    return {
      total: 0,
      pageobj: {
        query: '',
        pagenum: 2,
        pagesize: 5
      },
      goodList: [{
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_state: '',
        add_time: ''
      }]
    }
  },
  methods: {
    handleEdit (row) {
      console.log(row)
    },
    handleShare (row) {
      console.log(row)
    },
    handleDelete (row) {
      console.log(row)
    },
    handleSizeChange (val) {
    //   console.log(`每页 ${val} 条`)
    //   console.log(val)
      this.pageobj.pagesize = val
      this.goodInit()
    },
    handleCurrentChange (val) {
    //   console.log(`当前页: ${val}`)
      this.pageobj.pagenum = val
      this.goodInit()
    },
    goodInit () {
      getGoodList(this.pageobj)
        .then(res => {
          console.log(res)
          this.goodList = res.data.data.goods
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    }

  },
  mounted () {
    this.goodInit()
  },
  // 搜索筛选
  watch: {
    'pageobj.query' (a, b) {
      this.goodInit()
    }
  }
}
</script>
<style lang='less' scoped>
.el-input {
  width: 300px;
  margin-right: 20px;
}
</style>

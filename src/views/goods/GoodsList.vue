<template>
  <div>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="30">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-button type="primary">添加商品</el-button>
      </el-row>
      <el-table :data="goodsList" stripe style="width: 100%" border>
        <el-table-column type="index" width="55%" label="#"></el-table-column>
        <el-table-column label="商品名称" width="540px" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" width="95px" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" width="80px" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" width="140px" prop="add_time"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {

  created () {
    this.getGoodsList()
  },

  data () {
    return {
      queryInfo: {
        query: '',
        pagesize: 5,
        pagenum: 1
      },
      goodsList: []
    }
  },

  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      console.log(this.goodsList)
    }
  }

}
</script>

<style lang="scss" scoped>
.el-table {
  font-size: 12px;
  margin-top: 17px;
}
</style>

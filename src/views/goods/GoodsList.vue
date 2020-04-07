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
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delgoods(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑的dialog -->
    <!-- 编辑修改分类的dailog -->
    <!-- <el-dialog title="修改商品" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="category" :rules="editCateFormRules" ref="ruleForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="category.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>-->
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
    },

    async delgoods (goodsid) {
      var comfirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (comfirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('goods/' + goodsid)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('删除商品成功')
        this.getGoodsList()
      }
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

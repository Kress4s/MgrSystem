<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button class="addButton" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <zk-table
        :data="categories"
        :columns="columns"
        show-index
        :selection-type="false"
        :expand-type="false"
        index-text="#"
        border
      >
        <!-- 是否有效列模板 -->
        <template slot="isvalid" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <!-- 排序列模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作列模板 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCate(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </zk-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 编辑修改分类的dailog -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="category" :rules="editCateFormRules" ref="ruleForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="category.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getCates()
  },
  data () {
    return {
      queryInfo: {
        type: 3,
        pagesize: 5,
        pagenum: 1
      },

      total: 0,

      category: {},
      editDialogVisible: false,

      categories: [],
      // 为table指定列定义
      columns: [
        {
          label: '商品分类',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示讲当前列定义为模板列
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'isvalid'
        },
        {
          label: '排序',
          // 表示讲当前列定义为模板列
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示讲当前列定义为模板列
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'opt'
        }
      ],
      // 标记的dailog的规则
      editCateFormRules: {
        cat_name: [
          { required: true, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCates () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.categories = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCates()
    },
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getCates()
    },

    async getOneCate (cateid) {
      const { data: res } = await this.$http.get('categories/' + cateid)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.category = res.data
    },

    showEditCate (cateid) {
      this.editDialogVisible = !this.editDialogVisible
      this.getOneCate(cateid)
    },
    // 修改分类
    async editCate () {
      const { data: res } = await this.$http.put('categories/' + this.category.cat_id, this.category)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('修改分类完成')
      this.getCates()
      this.editDialogVisible = !this.editDialogVisible
    },
    // 删除分类
    async deleteCate (cateid) {
      var confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('categories/' + cateid)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('删除分类成功')
        this.getCates()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addButton {
  margin-bottom: 17px;
}
</style>

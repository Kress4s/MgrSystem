<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rigthsList" style="width: 100%" border stripe>
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column label="商品管理" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="Number(scope.row.level) + 1 == 1">一级</el-tag>
            <el-tag type="success" v-else-if="Number(scope.row.level) + 1 == 2">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getRightsList()
  },

  data () {
    return {
      rigthsList: []
      // buttonClassMap: new Map([[1, 'primary'], [2, 'success'], [3, 'warning']])
    }
  },

  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rigthsList = res.data
    }
  }

}
</script>

<style lang="scss" scoped>
.el-table {
  font-size: 12px;
}
</style>

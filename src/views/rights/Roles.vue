<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      <el-table :data="rolesList" stripe style="width: 100%" border>
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDailog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">权限分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增角色的dailog -->
    <el-dialog title="新增角色" :visible.sync="addDialogVisible" width="30%">
      <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="ruleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的dailog -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="ruleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getRolesList()
  },
  data () {
    return {
      rolesList: [],

      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },

      addDialogVisible: false,

      editDialogVisible: false,

      editRoleForm: {},

      addRoleFormRules: {
        roleName: [
          { required: true, message: '角色名不能为空' }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空' }
        ]
      },

      editRoleFormRules: {
        roleName: [
          { required: true, message: '角色名不能为空' }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空' }
        ]
      }
    }
  },
  methods: {
    async addRole () {
      const { data: res } = await this.$http.post('roles', this.addRoleForm)
      this.addDialogVisible = !this.addDialogVisible
      if (res.meta.status !== 201) return this.$message.error(res.meta.status)
      this.$message.success('添加角色成功')
      this.getRolesList()
    },

    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    async getOneRoleInfo (roleid) {
      const { data: res } = await this.$http.get('roles/' + roleid)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRoleForm = res.data
    },
    showEditDailog (roleid) {
      this.getOneRoleInfo(roleid)
      this.editDialogVisible = !this.editDialogVisible
    },
    async editRole () {
      const { data: res } = await this.$http.put(`roles/${this.editRoleForm.roleId}`, this.editRoleForm)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editDialogVisible = !this.editDialogVisible
      this.$message.success('修改成功')
      this.getRolesList()
    },
    async deleteRole (roleid) {
      var confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
        const { data: res } = await this.$http.delete('roles/' + roleid)
        if (res.meta.status !== 200) return res.meta.msg
        this.$message.success('删除角色成功')
        this.getRolesList()
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>

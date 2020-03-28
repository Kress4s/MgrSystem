<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="quertInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col span="7">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户表格区域 -->
      <el-table :data="userList" stripe style="width: 100%" :border="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <!-- 作用域插槽的使用，获取当前行的数据 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDailog(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="quertInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="quertInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户dialog -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClose">
      <!-- 内容主体区域 -->
      <el-form :model="addUserForm" :rules="addFormRules" ref="addUserFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="addUserForm" :rules="addFormRules" ref="addUserFormRef" label-width="70px">
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="addUserForm" :rules="addFormRules" ref="addUserFormRef" label-width="70px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="addUserForm" :rules="addFormRules" ref="addUserFormRef" label-width="70px">
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的dialog -->
    <el-dialog
      title="修改用户"
      :visible.sync="modifyDialogVisible"
      width="50%"
      @close="modifyDialogVisible"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="modifyUserForm"
        :rules="modifyUserFormRules"
        ref="modifyUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="modifyUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modifyUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="modifyUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除用户的dialog，这里不是用dailog，选择使用messageBox，比较好看和醒目 -->
    <!-- <el-dialog title="删除用户" :visible.sync="deleteDialogVisible" width="50%">
      <el-form ref="deleteDialogVisibleRef" label-width="70px">
        <span>是否删除用户, 删除后用户无法恢复</span>
    </el-form>-->
    <!-- 底部区域 -->
    <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    //  自定义邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      const regemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regemail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的邮箱'))
      }
    }
    //  自定义手机号校验规则
    var checkMobile = (rule, value, callback) => {
      const regmobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (regmobile.test(value)) {
        return callback()
      } else {
        return callback(new Error('请输入正确的手机号'))
      }
    }
    return {
      userList: [],
      total: 0,
      quertInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 对话框的标志位
      dialogVisible: false,

      // 修改的dailog的标志位
      modifyDialogVisible: false,

      // 删除用户的dailog标志位（因为使用了messageBox）
      // deleteDialogVisible: false,

      // 重置表单用
      addUserFormRef: {},

      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 新增用户表单的校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          // 使用自定义校验规则 validator
          { required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户数据结构
      modifyUserForm: {},
      // 修改用户资料表单的校验的验证规则(虽然这里可以复用新增用户的校验规则，但是新的数据结构还是新定义规则比较好)
      modifyUserFormRules: {
        email: [
          // 使用自定义校验规则 validator
          { required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.quertInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 分页方法
    handleSizeChange (newSize) {
      this.quertInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPageNum) {
      this.quertInfo.pagenum = newPageNum
      this.getUserList()
    },
    async userStateChange (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        this.$message.error('修改用户状态失败')
      } else {
        this.$message.success('修改用户状态成功')
      }
    },
    // 表单重置,待解决
    addDialogClose () {
      this.$refs.addUserFormRef.resetFields()
    },

    // 添加用户
    async addUser () {
      const { data: res } = await this.$http.post('users', this.addUserForm)
      if (res.meta.status !== 201) {
        this.$message.error(res.meta.msg)
      } else {
        // 取消对话框
        this.dialogVisible = !this.dialogVisible
        this.$message.success('添加用户成功')
        this.getUserList()
      }
    },

    // 查询一个指定用户
    async getOneUserInfo (userid) {
      const { data: res } = await this.$http.get('users/' + userid)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.modifyUserForm = res.data
      }
    },
    // 显示出修改的dailog
    showEditDailog (userid) {
      this.modifyDialogVisible = !this.modifyDialogVisible
      this.getOneUserInfo(userid)
    },
    // 修改用户
    async modifyUser () {
      const { data: res } = await this.$http.put(`users/${this.modifyUserForm.id}`, this.modifyUserForm)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.$message.success('修改用户成功')
        this.getUserList()
      }
    },

    async deleteUser (deleteUserid) {
      // const { data: res } = await this.$http.delete('users/' + this.deleteUserid)
      // if (res.meta.status !== 200) {
      //   this.$message.error(res.meta.msg)
      // } else {
      //   this.deleteDialogVisible = !this.deleteDialogVisible
      //   this.$message.success('删除成功')
      //   this.getUserList()
      // }
      const confirmResult = await this.$confirm('此操作将永久删除用户，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // 这样写的原因是await不能脱离async函数外使用
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
      // confirmResult的值： 确认 confirm， 取消 cancle
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('users/' + deleteUserid)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        } else {
          this.$message.success('删除用户成功')
          this.getUserList()
        }
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
.el-pagination {
  margin-top: 15px;
}
</style>

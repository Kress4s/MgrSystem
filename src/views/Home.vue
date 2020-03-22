<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="logo" src="../assets/Company.png" alt />
        <span>惠立宝管理后台</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <!-- 一级菜单 -->
        <el-menu
          :default-active="curPath"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EEF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
          <!-- 二级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <!-- 图标区域 -->
              <i :class="menuLogo[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group v-for="subItem in item.children" :key="subItem.id">
              <el-menu-item
                :index="'/home/' + subItem.path"
                @click="activePath('/home/'+ subItem.path)"
              >
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      menuLogo: {
        125: 'el-icon-user',
        103: 'el-icon-lock',
        101: 'el-icon-goods',
        102: 'el-icon-notebook-2',
        145: 'el-icon-data-line'
      },
      isCollapse: false,
      curPath: ''
    }
  },
  created () {
    this.getMemuList()
    this.curPath = window.sessionStorage.getItem('currentPath')
  },
  methods: {
    loginout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMemuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status === 200) {
        this.menuList = res.data
      } else return this.$message.error(res.meta.msg)
    },
    // 带单的折叠和展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 记录当前选中的地址保持高亮
    activePath (path) {
      window.sessionStorage.setItem('currentPath', path)
      this.curPath = window.sessionStorage.getItem('currentPath')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  height: 120px;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white; //文本颜色
  font-size: 20px; //字体大小
  .logo {
    border-radius: 50%;
    height: 60px;
  }
  > div {
    //局域flex布局
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-btn {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center; // 字符居中
  letter-spacing: 0.2em; // 字符间距
  cursor: pointer; // 鼠标放上去是一个可点击的小手
}
</style>

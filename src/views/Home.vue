<template>
  <div class="home-container">
    <!-- container 布局容器 -->
    <!-- 头部区域 -->
    <el-container>
      <el-header>
        <div>
          <img src="@/assets/heima.png" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 左侧菜单栏 -->
        <el-aside width="200px">
          <!-- 一级菜单 -->
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            :default-active="activePath"
            router
          >
            <el-submenu
              :index="item.id + ''"
              v-for="item in menulist"
              :key="item.id"
            >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item-group>
                <!-- 二级菜单 -->
                <el-menu-item
                  :index="'/' + subItem.path"
                  v-for="subItem in item.children"
                  :key="subItem.id"
                  @click="savePathState('/' + subItem.path)"
                  >{{ subItem.authName }}</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 被激活的链接地址
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    // 退出
    logout() {
      window.sessionStorage.clear("token");
      this.$router.push("/login");
    },
    // 请求左侧菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("请求数据左侧菜单数据失败");
      this.$message.success("请求左侧菜单数据成功");
      this.menulist = res.data;
    },
    // 保存链接状态
    savePathState(pathState) {
      window.sessionStorage.setItem("activePath", pathState);
    },
  },
};
</script>

<style scoped lang="less">
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
<template>
  <div class="user-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userlist" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 状态列 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改用户 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showModUser(scope.row.id)"
            ></el-button>
            <!-- 删除用户 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <!-- 添加用户的表单 -->
      <el-form
        :model="addUserData"
        :rules="addUserRules"
        ref="addUserRef"
        class="add-user"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="modDialogVisible"
      width="50%"
      @close="closeModDialog"
    >
      <!-- 修改用户的表单 -->
      <el-form
        :model="modusers"
        :rules="modUserRules"
        ref="modUserRef"
        class="mod-user"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="modusers.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modusers.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="modusers.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modUsers(modusers.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "user",
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 用户列表数据
      userlist: [],
      // 用户列表数据请求参数
      queryInfo: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2,
      },
      // 总数据条数
      total: 0,
      // 对话框的显示与隐藏
      dialogVisible: false,
      // 添加用户表单的验证规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 添加用户请求参数
      addUserData: {
        username: "ceshi",
        password: "12425345",
        email: "132854@qq.com",
        mobile: "15626676134",
      },
      // 修改用户对话框的显示和隐藏
      modDialogVisible: false,
      // 修改用户的表单验证规则
      modUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 查询用户信息数据
      modusers: {},
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表数据
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表数据失败");
      this.$message.success("获取用户列表数据成功");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    // 获取最新的每页显示条数 pagesize
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 获取最新的页码 pagenum
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 改变开关状态
    async changeState(row) {
      // console.log(row);
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("设置状态失败");
      this.$message.success("设置状态成功");
      this.getUserList();
    },
    // 显示添加用户对话框
    addUser() {
      this.dialogVisible = true;
    },
    // 请求添加用户
    addUsers() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写完成的用户信息");
        const { data: res } = await this.$http.post("users", this.addUserData);
        // console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加用户失败");
        this.$message.success("添加用户成功");
        this.dialogVisible = false;
        this.getUserList();
      });
    },
    // 关闭对话框
    closeDialog() {
      // console.log(this);
      this.$refs.addUserRef.resetFields();
    },
    // 显示修改用户的对话框
    async showModUser(id) {
      this.modDialogVisible = true;
      // console.log(id);
      // 查询用户信息
      const { data: res } = await this.$http.get(`users/${id}`);
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("查询用户信息失败");
      this.$message.success("查询用户信息成功");
      this.modusers = res.data;
    },
    // 关闭修改用户的对话框
    closeModDialog() {
      this.$refs.modUserRef.resetFields();
    },
    // 请求修改用户
    modUsers(id) {
      this.$refs.modUserRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请输入完整的用户信息");
        const { data: res } = await this.$http.put(
          `users/${id}`,
          this.modusers
        );
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("修改用户信息失败");
        this.$message.success("修改用户信息成功");
        this.modusers.email = res.data.email;
        this.modusers.mobile = res.data.mobile;
        this.modDialogVisible = false;
        this.getUserList();
      });
    },
    // 删除用户
    async deleteUser(id) {
      const resultConfirm = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // console.log(resultConfirm);
      if (resultConfirm !== "confirm") return;
      const { data: res } = await this.$http.delete(`users/${id}`);
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败");
      this.getUserList();
    },
  },
};
</script>

<style scoped lang="less">
.el-card {
  margin: 10px 0;
}
.el-table {
  margin: 10px 0;
}
</style>
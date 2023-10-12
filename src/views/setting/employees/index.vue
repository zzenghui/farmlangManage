//稻丰系统设置-员工管理
<template>
  <div class="ele-body">
    <el-card shadow="never" body-style="padding: 22px 22px 0 22px;">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        label-width="77px"
        @keyup.enter.native="reload"
        @submit.native.prevent
      >
        <el-row :gutter="15">
          <el-col :md="6" :sm="12">
            <el-form-item label="关键字:" prop="Q">
              <el-input
                v-model="where.Q"
                placeholder="请输入关键字"
                clearable
              />
            </el-form-item>
          </el-col>
          <!--          <el-col :md="6" :sm="12">-->
          <!--            <el-form-item label="部门:" prop="area">-->
          <!--              <el-select v-model="where.area" placeholder="请选择部门">-->
          <!--                <el-option label="全部" value="0"></el-option>-->
          <!--                <el-option label="事业部" value="1"></el-option>-->
          <!--                <el-option label="财务部" value="2"></el-option>-->
          <!--                <el-option label="市场部" value="3"></el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :md="18" :sm="12">
            <el-form-item class="ele-text-right">
              <el-button
                type="primary"
                @click="reload"
                icon="el-icon-search"
                class="ele-btn-icon"
                >查询
              </el-button>
              <el-button @click="(where = {}) && reload()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <!-- 数据表格 -->
      <ele-pro-table
        ref="table"
        :datasource="url"
        :request="tableRequestParams"
        :parseData="parseData"
        :parseParam="parseParam"
        :where="where"
        :columns="columns"
      >
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-permission="'userinside_add'"
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="saveEmployees"
            size="small"
            >添加</el-button
          >
        </template>
        <template slot="allowOnline" slot-scope="{ row }">
          <el-switch v-permission="'userinside_up'" v-model="row.isEnabled" @change="changeEnabled(row)" />
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-link
            v-permission="'userinside_up'"
            @click="updateEmployees(row)"
            type="error"
            :underline="false"
            >编辑
          </el-link>
          <!--          <el-link-->
          <!--            @click="resetEmployees(row)"-->
          <!--            type="error"-->
          <!--            :underline="false"-->
          <!--          >重置密码-->
          <!--          </el-link>-->
          <el-popconfirm
            v-permission="'userinside_del'"
            class="ele-action"
            title="确定要删除吗？"
            @confirm="deleteItem(row)"
          >
            <el-link type="danger" slot="reference" :underline="false"
              >删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>
    <el-dialog
      :title="dialogType === 1 ? '添加' : '编辑'"
      :visible.sync="edit"
      width="400px"
      @closed="form = {}"
      :destroy-on-close="true"
      :lock-scroll="false"
    >
      <el-form
        :model="form"
        ref="editForm"
        :rules="rules"
        label-width="110px"
        @submit.native.prevent
      >
        <el-form-item label="员工姓名:" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入员工姓名"
            clearable
          />
        </el-form-item>
        <el-form-item label="联系方式:" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入联系方式"
            clearable
          />
        </el-form-item>
        <el-form-item label="所属部门:" prop="deptName">
          <el-select
            v-model="form.deptName"
            style="width: 100%"
            placeholder="请选择所属部门"
          >
            <el-option
              v-for="(arr, index) in myDeptName"
              :key="index"
              :label="arr.name"
              :value="arr.id"
              @click.native="getRoleListID(arr.id)"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位:" prop="roleName">
          <el-select
            v-model="form.roleName"
            style="width: 100%"
            :placeholder="promptSay"
          >
            <el-option
              v-for="(arr, index) in myRole"
              :key="index"
              :label="arr.name"
              :value="arr.id"
              @click.native="getMyRoleID(arr)"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogType === 1" label="登录密码:" prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入登录密码"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="edit = false">取消</el-button>
        <el-button type="primary" @click="save" :loading="loading"
          >保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  PostEmployeesSave,
  PutEmployeesUpdate,
  DeleteEmployees,
  PatchEmployeesEnableDisable
} from "@/api/employees";
import { GetDepartmentList } from "@/api/department";
import { GetRoleList } from "@/api/role";
export default {
  data() {
    return {
      promptSay: "-",
      myDeptName: new Array(),
      dialogType: 0, //弹窗类型 1是添加 2是修改
      tableRequestParams: {
        pageName: "pageIndex",
        limitName: "pageSize"
      },
      // 表格搜索条件
      where: {},
      // 表格数据接口
      url: "/UserInside",
      tableLoading: true,
      columns: [
        {
          label: "序号",
          columnKey: "index",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          prop: "no",
          label: "员工ID",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "name",
          label: "员工姓名",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "phone",
          label: "联系方式",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "deptName",
          label: "所属部门",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "roleName",
          label: "职位",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "isEnabled",
          label: "禁用启用",
          minWidth: 110,
          align: "center",
          slot: "allowOnline",
          showOverflowTooltip: true,
          show:this.$hasPermission('userinside_up')
        },
        {
          prop: "action",
          label: "操作",
          minWidth: 200,
          align: "center",
          slot: "action",
          show:this.$hasAnyPermission(['userinside_up','userinside_del'])
        }
      ],
      // 编辑表单数据
      form: {
        password: "123456"
      },
      // 编辑表单验证规则
      rules: {
        name: [
          { required: true, message: "请输入员工姓名", trigger: "blur" },
          {
            pattern: "^[\u4e00-\u9fa5_a-zA-Z0-9/]{2,8}$",
            message: "姓名限长8位，至少2位"
          }
        ],
        phone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          {
            pattern:
              "^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$",
            message: "请输入正确的手机号"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: "^[a-zA-Z0-9]{6,16}$",
            message:
              "必须为最小长度为6，最大长度为16的字符串或字母大小写加数字。"
          }
        ],
        deptName: [
          { required: true, message: "请选择所属部门", trigger: "blur" }
        ],
        roleName: [
          { required: true, message: "请选择所属职位", trigger: "blur" }
        ]
      },
      loading: false,
      edit: false,
      updateId: null,
      myRole: new Array(),
      judge: 0
    };
  },
  watch: {
    edit(val) {
      if (val === false) {
        this.judge = 0;
      }
    }
  },
  mounted() {
    this.getDepartmentList();
  },
  methods: {
    //获取部门数据
    async getDepartmentList() {
      const { data } = await GetDepartmentList();
      const myData = data.data;
      for (let i = 0; i < myData.length; i++) {
        this.myDeptName.push({ id: myData[i].id, name: myData[i].name });
      }
    },
    getRoleListID(id, validation, rId) {
      this.getRoleList(id, validation, rId);
    },
    getMyRoleID(arr) {
      this.form.roleName = arr.id;
      this.promptSay = arr.name;
      if (this.dialogType === 2) {
        this.judge = 1;
      }
    },
    //通过部门获取职位信息
    async getRoleList(id, validation, rId) {
      this.myRole = new Array();
      const { data } = await GetRoleList({ dept_Id: id });
      const myData = data.data;
      for (let i = 0; i < myData.length; i++) {
        this.myRole.push({ id: myData[i].id, name: myData[i].name });
      }
      if (validation && rId) {
        this.form.roleName = rId;
        return;
      }
      this.form.roleName = this.myRole[0].id;
    },
    // 定义请求参数，可以理解为参数拦截器
    parseParam(res) {
      if (res.districtId) {
        return {
          ...res,
          districtId: res.districtId[res.districtId.length - 1],
          pageIndex: res.pageIndex - 1
        };
      }
      return { ...res, pageIndex: res.pageIndex - 1 };
    },
    /* 调整数据格式 */
    parseData(res) {
      // 后端接口需要返回的数据格式为：{"code": 0, "data": [{},{}], "count": 10, "msg": ""}
      return {
        code: 0,
        data: res.data,
        count: res.meta.totalItemsCount,
        msg: res.message ? res.message : ""
      };
    },

    //添加员工
    saveEmployees() {
      this.myRole = new Array();
      this.dialogType = 1;
      this.edit = true;
    },
    /* 保存编辑 */
    save() {
      this.$refs["editForm"].validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            if (this.dialogType === 1) {
              const myData = {
                name: this.form.name,
                password: this.form.password,
                phone: this.form.phone,
                role_Id: this.form.roleName
              };
              await PostEmployeesSave(myData);
            } else {
              const myData = {
                name: this.form.name,
                phone: this.form.phone,
                role_Id:
                  this.judge === 1 ? this.form.roleName : this.form.role_Id
              };
              await PutEmployeesUpdate(this.updateId, myData);
            }
            this.$message.success(
              this.dialogType === 1 ? "添加成功" : "修改成功"
            );
            this.edit = false;
            this.reload();
            this.loading = false;
          } catch {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
    //编辑
    updateEmployees(row) {
      this.dialogType = 2;
      this.form = Object.assign({}, row);
      this.updateId = row.id;
      this.getRoleListID(row.dept_Id, true, row.role_Id);
      this.edit = true;
    },
    // 搜索
    reload() {
      this.$nextTick(() => {
        this.$refs.table.reload();
      });
    },
    // 启用禁用
    async changeEnabled(row) {
      try {
        this.tableLoading = true;
        await PatchEmployeesEnableDisable(row.id, { isEnabled: row.isEnabled });
        this.tableLoading = false;
        this.$message.success(row.isEnabled ? "启用成功" : "禁用成功");
      } catch (e) {
        console.log(e.name + ":" + e.message);
      }
    },
    // 删除
    async deleteItem(row) {
      try {
        this.tableLoading = true;
        await DeleteEmployees(row.id);
        this.tableLoading = false;
        this.reload();
        this.$message.success("删除成功");
      } catch {
        this.tableLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ele-body {
  .statuson {
    color: #00c61b;
    display: inline-block;
    position: relative;
    &:after {
      content: " ";
      position: absolute;
      left: -10px;
      top: 9px;
      width: 6px;
      height: 6px;
      background-color: #00c61b;
      border-radius: 6px;
    }
  }
  .statusoff {
    color: #f00000;
    display: inline-block;
    position: relative;
    &:after {
      content: " ";
      position: absolute;
      left: -10px;
      top: 9px;
      width: 6px;
      height: 6px;
      background-color: #f00000;
      border-radius: 6px;
    }
  }
}
</style>

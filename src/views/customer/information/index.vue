//客户管理-客户信息
<template>
  <div class="ele-body">
    <el-card shadow="never" body-style="padding: 22px 22px 0 22px;">
      <!-- 搜索表单 -->
      <el-form :model="where" label-width="77px" @keyup.enter.native="reload" @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :md="6" :sm="12">
            <el-form-item label="关键字:" prop="Q">
              <el-input v-model="where.Q" placeholder="请输入关键字" clearable />
            </el-form-item>
          </el-col>
          <!--          <el-col :md="6" :sm="12">-->
          <!--            <el-form-item label="区域:" prop="area">-->
          <!--              <el-select v-model="where.area" placeholder="请选择区域">-->
          <!--                <el-option label="全部" value="0"></el-option>-->
          <!--                <el-option label="浙江省" value="1"></el-option>-->
          <!--                <el-option label="河南省" value="2"></el-option>-->
          <!--                <el-option label="山东省" value="3"></el-option>-->
          <!--                <el-option label="黑龙江省" value="3"></el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :md="18" :sm="12">
            <el-form-item class="ele-text-right">
              <el-button type="primary" @click="reload" icon="el-icon-search" class="ele-btn-icon">查询
              </el-button>
              <el-button @click="(where = {}) && reload()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <!-- 数据表格 -->
      <ele-pro-table ref="table" :datasource="url" :request="tableRequestParams" :parseData="parseData"
        :parseParam="parseParam" :where="where" :columns="columns">
        <!-- 表头工具栏 -->
        <!--        <template slot="toolbar">-->
        <!--          <el-button-->
        <!--            type="primary"-->
        <!--            icon="el-icon-plus"-->
        <!--            class="ele-btn-icon"-->
        <!--            @click="saveCustomer"-->
        <!--            size="small"-->
        <!--            >添加</el-button-->
        <!--          >-->
        <!--        </template>-->
        <template slot="action" slot-scope="{ row }">
          <!--          <el-link-->
          <!--            @click="customerUpdate(row)"-->
          <!--            type="success"-->
          <!--            :underline="false"-->
          <!--            >修改-->
          <!--          </el-link>-->
          <el-link v-permission="'order_add'" type="success" @click="saveReservationList(row)" :underline="false">添加预约单
          </el-link>
          <el-link v-permission="'field_add'" type="success" @click="saveFarmland(row)" :underline="false">添加农田
          </el-link>
          <el-link @click="customerDetail(row)" type="success" :underline="false">详情
          </el-link>
        </template>
      </ele-pro-table>
    </el-card>
    <el-dialog :title="dialogType === 1 ? '添加' : '编辑'" :visible.sync="edit" width="400px" @closed="form = {}"
      :destroy-on-close="true" :lock-scroll="false">
      <el-form :model="form" ref="editForm" :rules="rules" label-width="110px" @submit.native.prevent>
        <el-form-item label="客户姓名:" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户姓名" clearable />
        </el-form-item>
        <el-form-item label="联系方式:" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系方式" clearable />
        </el-form-item>
        <el-form-item label="所属区域:" prop="areaCode">
          <el-cascader v-model="form.areaCode" placeholder="请选择所属区域" style="width: 100%" :options="villageOptions"
            :props="{ checkStrictly: true }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="edit = false">取消</el-button>
        <el-button type="primary" @click="save" :loading="loading">保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { PostCustomerSave } from "@/api/customer";
import { mapState } from "vuex";
export default {
  name: "index",
  data() {
    return {
      dialogType: 1, //弹窗类型 1是添加 2是修改
      tableRequestParams: {
        pageName: "pageIndex",
        limitName: "pageSize"
      },
      // 表格搜索条件
      where: {},
      // 表格数据接口
      url: "/UserCustomer",
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
          label: "客户ID",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "name",
          label: "客户姓名",
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
          prop: "areaName",
          label: "所属区域",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "address",
          label: "详细地址",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "action",
          label: "操作",
          minWidth: 200,
          align: "center",
          fixed: "right",
          slot: "action"
        }
      ],
      // 编辑表单数据
      form: {},
      // 编辑表单验证规则
      rules: {
        name: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          {
            pattern:
              "^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$",
            message: "请输入正确的手机号"
          }
        ],
        areaCode: [
          { required: true, message: "请选择所属区域", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      loading: false,
      edit: false,
      updateId: null,
      villageOptions: new Array()
    };
  },
  mounted() {
    this.villageOptions = this.areaData;
  },
  methods: {
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
    //添加客户
    saveCustomer() {
      this.dialogType = 1;
      this.edit = true;
    },
    //修改客户
    customerUpdate(row) {
      this.$message.info(`${row.id}功能正在开发中...`);
      // this.dialogType = 2;
      // this.updateId = row.Id;
      // this.form = Object.assign({}, row);
      // this.edit = true;
    },
    /* 保存编辑 */
    save() {
      this.$refs["editForm"].validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            if (this.dialogType === 1) {
              this.form.password = "123456";
              this.form.areaCode = this.form.areaCode[
                this.form.areaCode.length - 1
              ];
              await PostCustomerSave(this.form);
            } else {
            }
            this.$message.success(
              this.dialogType === 1 ? "添加成功" : "修改成功"
            );
            this.edit = false;
            this.reload();
            this.loading = false;
          } catch {
            this.$message.error("添加失败，接口还未完善");
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
    // 搜索
    reload() {
      this.$nextTick(() => {
        this.$refs.table.reload();
      });
    },
    //添加农田
    saveFarmland(row) {
      this.$router.push({
        path: "/customer/information/add-the-farmland",
        query: {
          id: row.id,
          code: row.areaName
        }
      });
    },
    //详情
    customerDetail(row) {
      this.$router.push({
        path: "/customer/information/details",
        query: {
          id: row.id,
          code: row.areaName
        }
      });
    },
    //添加预约单
    saveReservationList(row) {
      this.$router.push({
        path: "/order/add-subscribe",
        query: {
          customerId: row.id
        }
      });
    }
  },
  computed: {
    ...mapState(["areaData"])
  }
};
</script>

<style lang="scss" scoped></style>

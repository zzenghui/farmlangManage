<template>
  <div class="ele-body">
    <el-card shadow="never" body-style="padding: 22px 22px 0 22px;">
      <el-form
        :model="where"
        label-width="77px"
        @keyup.enter.native="reload"
        @submit.native.prevent
        :rules="rules"
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
          <el-col :md="6" :sm="12">
            <el-form-item label="状态：">
              <el-select v-model="where.stateCode" placeholder="请选择状态">
                <el-option label="待派单" value="0"></el-option>
                <el-option label="待处理" value="3"></el-option>
                <el-option label="处理中" value="5"></el-option>
                <el-option label="待审核" value="6"></el-option>
                <el-option label="已完成" value="7"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="12">
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
      <ele-pro-table
        ref="table"
        :datasource="url"
        :where="where"
        :columns="columns"
        :request="tableRequestParams"
        :parseData="parseData"
        :parseParam="parseParam"
      >
        <template slot="auditStatus" slot-scope="{ row }">
          <!-- <div class="state-style">
            <p
              :style="
                row.activity.stateCode === 1
                  ? { backgroundColor: '#5AC725' }
                  : { backgroundColor: '#F9AE3D' }
              "
            ></p>
            <span
              v-if="row.activity"
              :style="
                row.activity.stateCode === 1
                  ? { color: '#5AC725' }
                  : { color: '#F9AE3D' }
              "
              >{{ row.activity.stateCode == 1 ? "已完成" : "待处理" }}</span
            >
          </div> -->
          <ele-dot
            v-if="[0, 1].includes(row.activity.stateCode)"
            class="ele-text-warning"
            type="warning"
            :ripple="false"
            text="待派单"
          />
          <ele-dot
            v-if="[2, 4].includes(row.activity.stateCode)"
            class="ele-text-warning"
            type="warning"
            :ripple="false"
            text="待主管派单"
          />
          <ele-dot
            v-if="row.activity.stateCode === 3"
            class="ele-text-warning"
            type="warning"
            :ripple="false"
            text="待处理"
          />
          <ele-dot
            v-if="row.activity.stateCode === 5"
            class="ele-text-warning"
            type="warning"
            :ripple="false"
            text="处理中"
          />
          <ele-dot
            v-if="row.activity.stateCode === 6"
            class="ele-text-warning"
            type="warning"
            :ripple="false"
            text="待审核"
          />
          <ele-dot
            v-if="row.activity.stateCode === 7"
            class="ele-text-success"
            type="success"
            :ripple="false"
            text="已完成"
          />
        </template>
        <template slot="action" slot-scope="{ row }">
          <!-- 管理员 -->
          <template v-if="departmentRole === DEPARTMENT_ROLE.ADMIN">
            <el-link
              v-if="[0, 1].includes(row.activity.stateCode)"
              @click="handleState(1, 2, row)"
              type="primary"
              :underline="false"
              >派单
            </el-link>
            <el-link
              v-if="row.activity.stateCode === 6"
              @click="handleState(0, 7, row)"
              type="primary"
              :underline="false"
              >通过
            </el-link>
          </template>
          <!-- 主管 -->
          <template v-else-if="departmentRole === DEPARTMENT_ROLE.DIRECTOR">
            <template v-if="[2, 4].includes(row.activity.stateCode)">
              <el-link
                @click="handleState(1, 3, row)"
                type="primary"
                :underline="false"
                >派单
              </el-link>
              <el-link
                @click="handleState(0, 1, row)"
                type="primary"
                :underline="false"
                >退回
              </el-link>
            </template>
            <el-link
              v-if="row.activity.stateCode === 3"
              @click="handleState(1, 3, row)"
              type="primary"
              :underline="false"
              >重新派单
            </el-link>
            <el-link
              v-if="row.activity.stateCode === 6"
              @click="handleState(0, 7, row)"
              type="primary"
              :underline="false"
              >通过
            </el-link>
          </template>
          <!-- 员工 -->
          <template v-else>
            <template v-if="row.activity.stateCode === 3">
              <el-link
                @click="handleState(0, 5, row)"
                type="primary"
                :underline="false"
                >开始处理
              </el-link>
              <el-link
                @click="handleState(0, 4, row)"
                type="primary"
                :underline="false"
                >退回
              </el-link>
            </template>
            <el-link
              v-if="row.activity.stateCode === 5"
              @click="handleState(0, 6, row)"
              type="primary"
              :underline="false"
              >处理完成
            </el-link>
          </template>
          <el-link
            @click="updateFarmland(row)"
            type="primary"
            :underline="false"
            >详情
          </el-link>

          <el-popconfirm
            class="ele-action"
            title="确定要删除吗？"
            v-permission="'order_del'"
            @confirm="deleteFarmlandClick(row)"
          >
            <el-link slot="reference" type="danger" :underline="false"
              >删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>

    <el-dialog
      :close-on-click-modal="false"
      title="操作"
      :visible.sync="isShow"
      width="400px"
      @closed="form = {}"
      :destroy-on-close="true"
      :lock-scroll="false"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent
      >
        <el-form-item class="form-item" label="员工:" prop="id">
          <el-select
            style="width: 100%"
            v-model="form.id"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!--  <el-form-item label="员工:" prop="ProductTypeId">
          <el-select placeholder="请选择员工">
            <el-option v-for="(val,index) in userList" :key="index" :label="val.name" :value="val.id"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="sendOrder">保存 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setOrderState, deleteOrder } from "@/api/order";
import { getDepartmentUserList } from "@/api/department";
import { getUserList } from "@/api/employees";
import { GetFarmlandDetail } from "@/api/farmland";
import { mapState } from "vuex";
import setting from "@/config/setting";
export default {
  data() {
    return {
      tableRequestParams: {
        pageName: "pageIndex",
        limitName: "pageSize"
      },
      // 列表接口地址
      url: "/api/Order",
      // 表格列配置
      columns: [
        {
          columnKey: "index",
          label: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          prop: "no",
          label: "订单ID",
          align: "center",
          minWidth: 130
        },
        {
          prop: "clientNo",
          label: "客户ID",
          align: "center",
          minWidth: 130
        },
        {
          prop: "clientName",
          label: "客户姓名",
          align: "center",
          minWidth: 130
        },
        {
          prop: "userPhone",
          label: "联系方式",
          align: "center",
          minWidth: 130
        },

        // {
        //   prop: "userNo",
        //   label: "发单人ID",
        //   align: "center",
        //   minWidth: 110
        // },
        // {
        //   prop: "userName",
        //   label: "发单人姓名",
        //   align: "center",
        //   minWidth: 110
        // },
        {
          prop: "createDate",
          label: "发布日期",
          align: "center",
          minWidth: 160
        },
        {
          prop: "auditStatus",
          label: "状态",
          align: "center",
          minWidth: 110,
          slot: "auditStatus"
        },
        {
          prop: "action",
          label: "操作",
          minWidth: 200,
          align: "center",
          slot: "action",
          fixed: "right"
        }
      ],
      // 列表搜索参数
      where: {},
      // 订单职位角色
      DEPARTMENT_ROLE: setting.DEPARTMENT_ROLE,
      form: {},
      row: {},
      rules: {
        id: [
          {
            required: true,
            message: "请选择员工",
            trigger: "blur"
          }
        ]
      },
      userList: [],
      isShow: false
    };
  },
  computed: {
    ...mapState({
      departmentRole: state => state.user.user.departmentRole,
      deptId: state => state.user.user.user.dept_Id
    })
  },
  created() {
    this.getUserList();
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
      return {
        ...res,
        pageIndex: res.pageIndex - 1
      };
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
    /* 刷新表格 */
    reload() {
      this.$nextTick(() => {
        this.$refs.table.reload();
      });
    },
    // 获取派单列表
    async getUserList() {
      if (this.departmentRole === this.DEPARTMENT_ROLE.ADMIN) {
        // 获取主管列表
        const { data } = await getDepartmentUserList({
          isOnlyDirector: true
        });
        let userList = [];
        data.forEach(department => {
          department.userInsides.forEach(user => {
            userList.push(user);
          });
        });
        this.userList = userList;
      } else if (this.departmentRole === this.DEPARTMENT_ROLE.DIRECTOR) {
        // 获取员工列表
        const {
          data: { data }
        } = await getUserList({
          deptId: this.deptId,
          isOnlyNormal: true
        });
        this.userList = data;
      }
    },
    // 通用处理方法
    handleState(type, targetStateCode, row) {
      row.targetStateCode = targetStateCode;
      this.row = row;
      // 1 打开弹窗 0 不打开
      if (type === 0) {
        this.setOrderState();
      } else if (type === 1) {
        this.isShow = true;
        console.log(this.row);
      }
    },
    // 派单
    sendOrder() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        this.setOrderState(this.form.id);
        this.isShow = false;
      });
    },
    // 设置订单状态
    async setOrderState(toUserId) {
      await setOrderState(this.row.no, {
        stateCode: this.row.targetStateCode,
        toUserId
      });
      this.$message.success("操作成功");
      this.reload();
    },
    async deleteFarmlandClick(row) {
      await deleteOrder(row.id);
      this.reload();
      this.$message.success("删除成功");
    },
    //详情
    async updateFarmland(row) {
      if (row.fieldId) {
        const { data } = await GetFarmlandDetail(row.fieldId);
        await this.$router.push({
          path: "/order/detail-page",
          query: {
            id: row.id,
            fieldId: data.geoJSON ? row.fieldId : null,
            customerId: row.clientId,
            no: row.no,
            //跳转下一页的判断显示
            geoJSONJudge: 2
          }
        });
        return;
      }
      await this.$router.push({
        path: "/order/detail-page",
        query: {
          id: row.id,
          fieldId: row.fieldId,
          customerId: row.clientId
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "index";
</style>

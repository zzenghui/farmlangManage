//系统设置-方案库管理
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
            <el-form-item label="关键字:" prop="q">
              <el-input
                v-model="where.q"
                placeholder="请输入关键字"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12">
            <el-form-item label="作物:" prop="cropId">
              <el-select v-model="where.cropId" placeholder="请选择作物类型">
                <el-option
                  v-for="(arr, index) in crops"
                  :key="index"
                  :label="arr.name"
                  :value="arr.id"
                ></el-option>
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
            v-permission="'solution_add'"
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="toEdit"
            size="small"
            >添加</el-button
          >
        </template>
        <template slot="state" slot-scope="{ row }">
          <ele-dot v-if="row.state == 0" type="danger" text="待审核" />
          <ele-dot v-else type="success" text="正常" />
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-link
            v-permission="'solution_up'"
            @click="toEdit(row)"
            type="success"
            :underline="false"
            >编辑
          </el-link>
          <el-link @click="toDetail(row)" type="success" :underline="false"
            >详情
          </el-link>
          <el-popconfirm
            v-permission="'solution_del'"
            class="ele-action"
            title="确定要删除吗？"
            @confirm="deleteSolution(row)"
          >
            <el-link type="danger" slot="reference" :underline="false"
              >删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import { getCropsListData } from "@/api/crops";
import { deleteSolution } from "@/api/solution";
export default {
  name: "index",
  data() {
    return {
      tableRequestParams: {
        pageName: "pageIndex",
        limitName: "pageSize"
      },
      // 表格搜索条件
      where: {},
      // 表格数据接口
      url: "/api/Solution",
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
          label: "方案ID",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "name",
          label: "方案名称",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "cropName",
          label: "适用作物",
          minWidth: 150,
          align: "center"
        },
        {
          prop: "createUserNo",
          label: "创建人ID",
          minWidth: 120,
          align: "center"
        },
        {
          prop: "createAt",
          label: "创建时间",
          minWidth: 150,
          align: "center"
        },
        {
          prop: "approveUserNo",
          label: "审核人ID",
          minWidth: 120,
          align: "center"
        },
        {
          prop: "state",
          label: "状态",
          minWidth: 110,
          align: "center",
          slot: "state"
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
      // 编辑表单数据
      form: {},
      crops: []
    };
  },
  mounted() {
    this.getCropsList();
  },
  methods: {
    async getCropsList() {
      const {
        data: { data }
      } = await getCropsListData();
      this.crops = data;
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
    // 搜索
    reload() {
      this.$nextTick(() => {
        this.$refs.table.reload();
      });
    },
    toEdit(row) {
      this.$router.push({
        path: "/solution/add",
        query: { id: row.id }
      });
    },
    toDetail(row) {
      this.$router.push({
        path: "/solution/detail",
        query: { id: row.id }
      });
    },
    // 删除
    async deleteSolution(row) {
      await deleteSolution(row.id);
      this.reload();
      this.$message.success("删除成功");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "index";
</style>

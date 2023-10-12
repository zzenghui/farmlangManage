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
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableRequestParams: {
        pageName: "pageIndex",
        limitName: "pageSize"
      },
      where: {},
      url: "/api/ActionLog",
      columns: [
        {
          label: "序号",
          columnKey: "index",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          prop: "createAt",
          label: "时间",
          minWidth: 100,
          align: "center"
        },
        {
          prop: "userNo",
          label: "用户名",
          minWidth: 80,
          align: "center"
        },
        {
          prop: "userName",
          label: "用户姓名",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "typeName",
          label: "操作类型",
          minWidth: 50,
          align: "center"
        },
        {
          prop: "content",
          label: "操作日志",
          minWidth: 300,
          align: "center"
        }
      ]
    };
  },
  methods: {
    parseParam(res) {
      return { ...res, pageIndex: res.pageIndex - 1 };
    },
    parseData(res) {
      // 后端接口需要返回的数据格式为：{"code": 0, "data": [{},{}], "count": 10, "msg": ""}
      return {
        code: 0,
        data: res.data,
        count: res.meta.totalItemsCount,
        msg: res.message ? res.message : ""
      };
    },
    reload() {
      this.$nextTick(() => {
        this.$refs.table.reload();
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>

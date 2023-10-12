<template>
  <div class="ele-body">
    <el-card shadow="never" body-style="padding: 22px 22px 0 22px;">
      <el-form
        :model="where"
        label-width="77px"
        @keyup.enter.native="reload"
        @submit.native.prevent
      >
        <el-row :gutter="15">
          <el-col :md="6" :sm="12"> </el-col>
          <el-col :md="6" :sm="12">
            <el-form-item label="选择区域:" prop="AreaCode">
              <el-cascader
                style="width:100%"
                v-model="where.AreaCode"
                :options="areaData"
                :props="{ checkStrictly: true }"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <!-- <el-col :md="6" :sm="12">
            <el-form-item label="状态：">
              <el-select v-model="where.AuditStatus" placeholder="请选择状态">
                <el-option label="待审核" value="0"></el-option>
                <el-option label="审核通过" value="1"></el-option>
                <el-option label="审核未通过" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :md="18" :sm="24">
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
        :loading="tableLoading"
      >
        <template slot="geoJSON" slot-scope="{ row }">
          <section
            v-lGeoSvg="{
              geoJSON: row.geoJSON,
              svgModel: row.isQuestion ? svgModel : svg
            }"
          ></section>
        </template>
<!--        <template slot="auditStatus" slot-scope="{ row }">-->
<!--          <span :class="row.auditStatus === 1 ? 'statuson' : 'statusoff'">{{-->
<!--            row.auditStatus === 1-->
<!--              ? "审核通过"-->
<!--              : row.auditStatus === 0-->
<!--              ? "待审核"-->
<!--              : "审核未通过"-->
<!--          }}</span>-->
<!--        </template>-->
        <template slot="action" slot-scope="{ row }">
          <el-link
            @click="toTourFieldLog(row)"
            type="primary"
            :underline="false"
          >巡田日志
          </el-link>
          <el-link
            @click="toProblemRecord(row)"
            type="primary"
            :underline="false"
          >问题记录
          </el-link>
          <el-link
            @click="toReservationService(row)"
            type="primary"
            :underline="false"
          >预约服务
          </el-link>
          <el-link
            @click="farmlandDetails(row)"
            type="primary"
            :underline="false"
            >详情
          </el-link>
          <el-link
            v-permission="'field_up'"
            @click="updateFarmland(row)"
            type="primary"
            :underline="false"
            >编辑
          </el-link>
          <el-popconfirm
            v-permission="'field_del'"
            class="ele-action"
            title="确定要删除吗？"
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
      title="选择日志类型"
      :visible.sync="edit"
      width="400px"
      @closed="formOne = {}"
      :destroy-on-close="true"
      :lock-scroll="false"
    >
      <el-form
        :model="formOne"
        ref="editForm"
        :rules="rules"
        label-width="110px"
        @submit.native.prevent
      >
        <el-form-item label="日志类型:" prop="logType">
          <el-select v-model="formOne.logType" placeholder="请选择日志类型">
            <el-option
              v-for="(arr, index) in options"
              :key="index"
              :value="arr.id"
              :label="arr.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="edit = false">取消</el-button>
        <el-button type="primary" @click="save" :loading="loading"
        >确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { DeleteFarmland } from "@/api/farmland";
import { mapState } from "vuex";
import { SvgModel } from "../../../../public/maps/geo2svg.js";
import { getArchiveList } from "@/api/archive";
const _svgModel = new SvgModel(
  [42, 42],
  [0, 0, 0, 0],
  "rgba(245, 108, 108, 0.4)",
  0.4,
  "#F56C6C"
);
const _svg = new SvgModel(
  [42, 42],
  [0, 0, 0, 0],
  "rgba(68, 174, 254, 0.4)",
  0.4,
  "#44aefe"
);
export default {
  data() {
    return {
      options: new Array(),
      edit: false,
      rules: {
        logType: [
          { required: true, message: "请选择日志类型", trigger: "blur" }
        ]
      },
      formOne:{},
      svgModel: _svgModel,
      svg: _svg,
      tableRequestParams: {
        pageName: "pageIndex",
        limitName: "pageSize"
      },
      // 列表接口地址
      url: "/api/Field",
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
          prop: "geoJSON",
          label: "地块边界",
          align: "center",
          minWidth: 80,
          slot: "geoJSON"
        },
        {
          prop: "no",
          label: "农田ID",
          align: "center",
          minWidth: 90
        },
        {
          prop: "fieldName",
          label: "农田名称",
          align: "center",
          minWidth: 130
        },
        {
          prop: "mu",
          label: "农田面积(亩)",
          align: "center",
          minWidth: 90
        },
        {
          prop: "clientNo",
          label: "客户ID",
          align: "center",
          minWidth: 110
        },
        {
          prop: "clientName",
          label: "客户姓名",
          align: "center",
          minWidth: 80
        },
        {
          prop: "clientPhone",
          label: "联系方式",
          minWidth: 135,
          align: "center"
        },
        {
          prop: "areaName",
          label: "所属区域",
          align: "center",
          minWidth: 110
        },
        // {
        //   prop: "auditStatus",
        //   label: "状态",
        //   align: "center",
        //   minWidth: 110,
        //   slot: "auditStatus"
        // },
        {
          prop: "action",
          label: "操作",
          minWidth: 230,
          align: "center",
          slot: "action",
          fixed: "right"
        }
      ],
      // 列表搜索参数
      where: {},
      // 编辑表单数据
      form: {},
      // 表格请求状态
      tableLoading: false,
      f_c:null,
      loading:false
    };
  },
  mounted() {
    this.getArchive();
  },
  methods: {
    //跳转添加
    save() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          try {
            this.$router.push({
              path: "/customer/information/tour-field",
              query: {
                archiveId: this.formOne.logType,
                ...this.f_c
              }
            });
            this.edit = false;
            this.loading = false;
          } catch {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
    async getArchive() {
      const { data } = await getArchiveList();
      for (let r of data) {
        this.options.push({ id: r.id, name: r.name });
      }
    },
    //巡田日志
    toTourFieldLog(row){
      this.edit = true;
      this.f_c = { fieldId: row.id,customerId:row.clientId}
    },
    //问题记录
    toProblemRecord(row){
      this.$router.push({
        path: "/question/add-record",
        query: {
          fieldId: row.id,
          customerId: row.clientId
        }
      });
    },
    //预约服务
    toReservationService(row){
      this.$router.push({
        path: "/order/add-subscribe",
        query: {
          fieldId: row.id,
          customerId: row.clientId
        }
      });
    },
    // 定义请求参数，可以理解为参数拦截器
    parseParam(res) {
      let AreaCode = "";
      if (this.where.AreaCode) {
        AreaCode = this.where.AreaCode[this.where.AreaCode.length - 1];
      }
      if (res.districtId) {
        return {
          ...res,
          districtId: res.districtId[res.districtId.length - 1],
          pageIndex: res.pageIndex - 1
        };
      }
      return {
        ...res,
        AreaCode: AreaCode,
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
    async deleteFarmlandClick(row) {
      try {
        this.tableLoading = true;
        await DeleteFarmland(row.id);
        this.tableLoading = false;
        this.reload();
        this.$message.success("删除成功");
      } catch {
        this.tableLoading = false;
      }
    },
    //详情
    farmlandDetails(row) {
      this.$router.push({
        path: "/customer/information/farmland-details",
        query: {
          fieldId: row.id,
          customerId: row.clientId
        }
      });
      // this.$router.push({
      //   path: "/farmland/list/list-detail",
      //   query: {
      //     id: row.id
      //   }
      // });
    },
    //编辑
    updateFarmland(row) {
      this.$router.push({
        path: "/farmland/list/edit-fields",
        query: {
          id: row.id,
          clientId: row.clientId
        }
      });
    }
  },
  computed: {
    ...mapState(["areaData"])
  }
};
</script>

<style lang="scss" scoped>
@import "index";
</style>

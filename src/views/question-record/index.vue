<template>
  <div class="ele-body">
    <el-card shadow="never" body-style="padding: 22px 22px 0 22px;">
      <el-form
        :model="where"
        label-width="86px"
        @keyup.enter.native="reload"
        @submit.native.prevent
      >
        <el-row :gutter="15">
          <el-col :lg="5" :sm="12">
            <el-form-item label="问题类型:" prop="QuestionTypeId">
              <el-select v-model="where.QuestionTypeId" placeholder="请选择问题类型">
                <el-option
                  v-for="(arr,index) in questionTypeData"
                  :key="index"
                  :label="arr.name"
                  :value="arr.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="5" :sm="12">
            <el-form-item label="状态:" prop="StateCode">
              <el-select v-model="where.StateCode" placeholder="请选择状态">
                <el-option label="待审核" :value="0"></el-option>
                <el-option label="待发布" :value="1"></el-option>
                <el-option label="已发布" :value="2"></el-option>
                <el-option label="待处理" :value="3"></el-option>
                <el-option label="处理中" :value="4"></el-option>
                <el-option label="已处理" :value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :sm="12">
            <el-form-item label="农田ID:" prop="FieldNo">
              <el-input
                v-model="where.FieldNo"
                placeholder="请输入农田ID"
                style="width: 220px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="10" :sm="12">
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

        <template slot="state" slot-scope="{ row }">
          <div class="state-style">
            <p :style="row.stateCode===5?{ backgroundColor:'#5AC725' }:row.stateCode===4||row.stateCode===2?{ backgroundColor:'#1890FF' }:{ backgroundColor:'#F9AE3D' }"></p>
            <span :class="row.stateCode===5? 'c2' : row.stateCode===4||row.stateCode===2?'c1':'c0'">{{
                row.stateCode===0? "待审核":
                row.stateCode===1? "待发布":
                row.stateCode===2? "已发布":
                row.stateCode===3? "待处理":
                row.stateCode===4? "处理中":
                  "已完成"
              }}</span>
          </div>
        </template>
        <template slot="action" slot-scope="{ row }">
          <div style="display: flex;justify-content:center">
            <div v-if="row.stateCode!==2 && row.stateCode!==5" style="margin-right: 10px">
              <el-link
                v-if="row.stateCode===0"
                v-permission="'question_approve'"
                @click="questionRecordAction(row)"
                type="primary"
                :underline="false"
              >审核
              </el-link>
              <el-link
                v-if="row.stateCode===1"
                v-permission="'question_publish'"
                @click="questionRecordAction(row)"
                type="primary"
                :underline="false"
              >发布
              </el-link>
              <el-link
                v-if="row.stateCode===3"
                v-permission="'question_processor_on'"
                @click="questionRecordAction(row)"
                type="primary"
                :underline="false"
              >处理
              </el-link>
              <el-link
                v-if="row.stateCode===4"
                v-permission="'question_processor_ok'"
                @click="questionRecordAction(row)"
                type="primary"
                :underline="false"
              >完成
              </el-link>
            </div>
            <el-link
              @click="questionRecordDetail(row)"
              type="primary"
              :underline="false"
            >详情
            </el-link>
            <el-popconfirm
              class="ele-action"
              title="确定要删除吗？"
              @confirm="deletequestionRecord(row)"
            >
              <el-link
                v-permission="'question_del'"
                slot="reference"
                type="danger"
                :underline="false"
              >删除
              </el-link>
            </el-popconfirm>
          </div>

        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import {
  patchQuestionRecordProcess,
  deleteQuestionRecord
} from '@/api/questionRecord';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      tableRequestParams: {
        pageName: "pageIndex",
        limitName: "pageSize"
      },
      // 列表接口地址
      url: "/Question",
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
          label: "问题记录ID",
          align: "center",
          minWidth: 130,
        },
        {
          prop: "questionType.name",
          label: "问题类型",
          align: "center",
          minWidth: 130
        },
        {
          prop: "questionLevel.name",
          label: "问题等级",
          align: "center",
          minWidth: 130
        },
        {
          prop: "field.no",
          label: "农田ID",
          align: "center",
          minWidth: 110
        },
        {
          prop: "userInside.no",
          label: "创建人ID",
          align: "center",
          minWidth: 110,
        },
        {
          prop: "userInside.name",
          label: "创建人姓名",
          align: "center",
          minWidth: 120,
        },
        {
          prop: "createAt",
          label: "创建时间",
          minWidth: 135,
          align: "center",
        },
        {
          prop: "stateName",
          label: "审核状态",
          align: "center",
          minWidth: 110,
          slot: "state"
        },
        {
          prop: "action",
          label: "操作",
          minWidth: 160,
          align: "center",
          slot: "action",
          fixed:"right"
        }
      ],
      // 列表搜索参数
      where: {},
      // 编辑表单数据
      form: {},
      // 表格请求状态
      tableLoading: false,

    };
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
    async deletequestionRecord(row) {
      try {
        this.tableLoading = true;
        await deleteQuestionRecord(row.id);
        this.tableLoading = false
        this.reload()
        this.$message.success('删除成功')
      } catch {
        this.tableLoading = false
      }
    },
    //详情
    questionRecordDetail(row) {
      this.$router.push({
        path: "/question/detail",
        query: {
          id: row.id,
          fieldId:row.field.geoJSON?row.field.id:null,
          customerId:row.userCustomer.id,
          //跳转下一页面的判断显示
          geoJSONJudge:1,
        }
      });
    },
    //审核 1 发布 2  处理 4 完成 5 操作
    async questionRecordAction(row) {
      try {
        this.tableLoading = true;
        const state = row.stateCode===0?1:
                      row.stateCode===1?2:
                      row.stateCode===3?4:5
        await patchQuestionRecordProcess(row.id,{
          eventCode:state
        });
        this.tableLoading = false
        this.reload()
        this.$message.success('操作成功');
      } catch {
        this.tableLoading = false
      }
    },
  },
  computed:{
    ...mapState(['questionTypeData'])
  }
};
</script>

<style lang="scss" scoped>
.c0{
  color: #F9AE3D;
}
.c1{
  color: #1890FF;
}
.c2{
  color: #5AC725;
}
.state-style{
  display: flex;
  align-items: center;
  justify-content: center;
  p{
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  span{
    margin-left:5px;
  }
}
</style>

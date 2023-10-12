//系统设置-问题等级
<template>
  <div class="ele-body">
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
            v-permission="'question_level_add'"
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="saveQuestionLevel"
            size="small"
            >添加</el-button
          >
        </template>
        <template slot="icon" slot-scope="{ row }">
          <p :style="{ backgroundColor: row.color }" class="style-color-p"></p>
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-link
            v-permission="'question_level_up'"
            @click="updateQuestionLevel(row)"
            type="success"
            :underline="false"
            >修改
          </el-link>
          <el-popconfirm
            v-permission="'question_level_del'"
            class="ele-action"
            title="确定要删除吗？"
            @confirm="deleteQuestionLevel(row)"
          >
            <el-link type="danger" slot="reference" :underline="false"
              >删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>
    <el-dialog
      :title="dialogType === 1 ? '添加' : '修改'"
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
        <el-form-item label="问题等级:" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入问题等级"
            clearable
          />
        </el-form-item>
        <el-form-item label="等级颜色:" prop="color">
          <el-color-picker v-model="form.color" show-alpha> </el-color-picker>
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
  postquestionGradeSave,
  deletequestionGrade,
  putquestionGradeUpdate
} from "@/api/questionGrade";
import EleIconPicker from "ele-admin/packages/ele-icon-picker";
export default {
  components: {
    EleIconPicker
  },
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
      url: "/api/QuestionLevel",
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
          prop: "name",
          label: "问题等级",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "color",
          label: "等级颜色",
          minWidth: 110,
          align: "center",
          slot: "icon"
        },
        {
          prop: "action",
          label: "操作",
          width: 120,
          align: "center",
          slot: "action"
        }
      ],
      // 编辑表单数据
      form: {},
      // 编辑表单验证规则
      rules: {
        name: [{ required: true, message: "请输入问题等级", trigger: "blur" }],
        color: [{ required: true, message: "请选择等级颜色", trigger: "blur" }]
      },
      loading: false,
      edit: false,
      updateId: null
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

    //添加作业类型
    saveQuestionLevel() {
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
              await postquestionGradeSave(this.form);
            } else {
              await putquestionGradeUpdate(this.updateId, this.form);
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
    updateQuestionLevel(row) {
      this.dialogType = 2;
      this.form = Object.assign({}, row);
      this.updateId = row.id;
      this.edit = true;
    },
    // 搜索
    reload() {
      this.$nextTick(() => {
        this.$refs.table.reload();
      });
    },
    // 删除
    async deleteQuestionLevel(row) {
      try {
        this.tableLoading = true;
        await deletequestionGrade(row.id);
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
.pickerIcon {
  width: 100%;
  ::v-deep .el-input__inner {
    padding-left: 50px;
  }
}
.style-color-p {
  width: 36px;
  height: 36px;
  margin: auto;
  border-radius: 50%;
}
</style>

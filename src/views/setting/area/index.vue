//稻丰系统设置-部门管理
<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 高级表格 -->
      <ele-pro-table
        ref="table"
        row-key="id"
        :datasource="url"
        :columns="columns"
        :request="tableRequestParams"
        :parseData="parseData"
        :parseParam="parseParam"
        :needPage="false"
        lazy
        :load="tableLoad"
        :tree-props="{ children: 'children' }"
      >
        <!--        :tree-props="{children: 'children', hasChildren: 'children'}" -->
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-permission="'area_add'"
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="saveArea"
            size="small"
            >添加</el-button
          >
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-popconfirm
            v-permission="'area_del'"
            class="ele-action"
            title="确定要删除吗？"
            @confirm="DeleteArea(row)"
          >
            <el-link type="danger" slot="reference" :underline="false"
              >删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>
    <el-dialog
      title="添加区域"
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
        <el-form-item label="区域名称:" prop="name">
          <el-autocomplete
            v-model="form.name"
            style="width: 100%"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入区域名称"
            @select="handleSelect"
          ></el-autocomplete>
          <!--          <el-input-->
          <!--            v-model="form.name"-->
          <!--            @blur="AccessToAreas"-->
          <!--            placeholder="请输入区域名称"-->
          <!--            clearable-->
          <!--          />-->
        </el-form-item>
        <!--        <el-form-item label="行政区域代码:" prop="id">-->
        <!--          <el-select v-model="form.id"-->
        <!--                     filterable-->
        <!--                     :placeholder="promptSay"-->
        <!--                     style="width: 100%"-->
        <!--          >-->
        <!--            <el-option-->
        <!--              v-for="item in options"-->
        <!--              :key="item.value"-->
        <!--              :label="item.label"-->
        <!--              :value="item.value">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
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
  GetAreasDataNameList,
  PutSetingAreasData,
  PutDeleteAreasData
} from "@/api/areas";
export default {
  name: "index",
  data() {
    return {
      timeout: null,
      restaurants: [],
      state: "",
      loading: false,
      edit: false,
      rules: {
        name: [{ required: true, message: "请输入区域名称", trigger: "blur" }],
        id: [{ required: true, message: "请选择行政区域", trigger: "blur" }]
      },
      form: new Object(),
      options: new Array(),
      promptSay: "-",
      tableRequestParams: {
        pageName: "pageIndex",
        limitName: "pageSize"
      },
      // 列表接口地址
      url: "/api/Areas/GetCurrentAdminAreaTree",
      // 表格列配置
      columns: [
        {
          columnKey: "index",
          type: "index",
          width: 100,
          label: "序号",
          align: "center"
        },
        {
          prop: "label",
          label: "区域名称",
          align: "center",
          minWidth: 110
        },
        {
          prop: "value",
          label: "行政区划代码",
          align: "center",
          minWidth: 135
        },
        {
          prop: "action",
          label: "操作",
          width: 120,
          align: "center",
          slot: "action",
          show:this.$hasPermission('area_del')
        }
      ],
      areaId: null
    };
  },
  methods: {
    async querySearchAsync(queryString, cb) {
      let restaurants = this.restaurants;
      let result = null;
      if (queryString) {
        await this.createStateFilter().then(results => {
          result = results;
        });
      } else {
        result = restaurants;
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(result);
      }, 500);
    },
    async createStateFilter() {
      const { data } = await GetAreasDataNameList(this.form.name);
      const myArea = [];
      for (let r of data) {
        myArea.push({ value: r.name, address: new String(r.id) });
      }
      return myArea;
    },
    handleSelect(item) {
      this.areaId = item.address;
    },
    //添加区域
    saveArea() {
      this.edit = true;
    },
    //删除区域
    async DeleteArea(row) {
      try {
        this.tableLoading = true;
        await PutDeleteAreasData(row.id);
        this.tableLoading = false;
        this.reload();
        this.$store.commit("setArea");
        this.$message.success("删除成功");
      } catch {
        this.tableLoading = false;
      }
    },
    // async AccessToAreas(){
    //    if(!this.form.name){
    //      this.promptSay='-';
    //      this.options=[];
    //      return;
    //    }
    //    this.options=[];
    //    const { data } = await GetAreasDataNameList(this.form.name);
    //    for(let r of data){
    //      this.options.push({label:r.name,value:r.id});
    //    }
    //    this.promptSay='请选择行政区域';
    //  },
    //保存
    save() {
      this.$refs["editForm"].validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            await PutSetingAreasData(this.areaId);
            this.$message.success("添加成功");
            this.edit = false;
            this.reload();
            this.$store.commit("setArea");
            this.loading = false;
          } catch {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
    tableLoad(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve(tree.children);
      }, 600);
    },
    // 定义请求参数，可以理解为参数拦截器
    parseParam(res) {
      return { startLevel: 1, leverCount: 5 };
      // return { ...res,pageIndex:(res.pageIndex - 1) }
    },
    /* 调整数据格式 */
    parseData(res) {
      // 后端接口需要返回的数据格式为：{"code": 0, "data": [{},{}], "count": 10, "msg": ""}
      return {
        code: 0,
        data: res,
        count: res.length,
        msg: res.message ? res.message : ""
      };
    },
    /* 刷新表格 */
    reload() {
      this.$nextTick(() => {
        this.$refs.table.reload();
      });
    }
  }
};
</script>

<style scoped></style>

//稻丰系统设置-作物管理
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
            <el-form-item label="关键字:" prop="Name">
              <el-input
                v-model="where.Name"
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
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-permission="'crop_add'"
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="saveJobType"
            size="small"
            >添加</el-button
          >
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-link
            v-permission="'crop_up'"
            @click="updateCropVarieties(row)"
            type="success"
            :underline="false"
            >修改
          </el-link>
          <el-popconfirm
            v-permission="'crop_del'"
            class="ele-action"
            title="确定要删除吗？"
            @confirm="deleteCropType(row)"
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
        <el-form-item label="作物名称:" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入作物名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="作物类型:" prop="cropTypesId">
          <el-select
            v-model="form.cropTypesId"
            placeholder="请选择作物类型"
            style="width: 100%"
          >
            <el-option
              v-for="(arr, index) in cropTypesData"
              :key="index"
              :label="arr.name"
              :value="arr.id"
              @click.native="getVarietiesData(arr.id)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品种名称:" prop="cropVarietiesId">
          <el-select
            v-model="form.cropVarietiesId"
            placeholder="请选择作物名称"
            style="width: 100%"
          >
            <el-option
              v-for="(arr, index) in cropVarietiesData"
              :key="index"
              :label="arr.name"
              :value="arr.id"
            ></el-option>
          </el-select>
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
import { PostCropsSave, PutCropsUpdate, DeleteCrops } from "@/api/crops";
import { GetCropVarietiesList } from "@/api/cropVarieties";
import { GetCropTypesList } from "@/api/cropTypes";
export default {
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
      url: "/api/Crops",
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
          prop: "cropTypesName",
          label: "作物类型",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "cropVarietiesName",
          label: "品种名称",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "name",
          label: "名称",
          minWidth: 110,
          align: "center"
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
      form: {
        cropVarietiesId:''
      },
      // 编辑表单验证规则
      rules: {
        cropTypesId: [
          { required: true, message: "请输入作物类型", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入作物名称", trigger: "blur" }],
        cropVarietiesId: [
          { required: true, message: "请选择品种名称", trigger: "blur" }
        ]
      },
      //类型数据
      cropTypesData: new Array(),
      loading: false,
      edit: false,
      updateId: null,
      cropVarietiesData: new Array(),
      //prompting: "-"
    };
  },
  mounted() {
    this.GetCropTypesList();
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
    //
    async getVarietiesData(id) {
      this.cropVarietiesData = [];
      const { data } = await GetCropVarietiesList(id);
      this.form = Object.assign({},{
        name:this.form.name,
        cropTypesId:this.form.cropTypesId,
        cropVarietiesId:data[0]?data[0].id:null
      });
      data.map(r => {
        this.cropVarietiesData.push({ id: r.id, name: r.name });
      });
    },
    //添加作物
    saveJobType() {
      this.dialogType = 1;
      this.edit = true;
    },
    //修改作物品种
    updateCropVarieties(row) {
      this.getVarietiesData(row.cropTypesId);
      this.dialogType = 2;
      this.updateId = row.id;
      this.form = Object.assign({}, row);
      this.edit = true;
    },
    async GetCropTypesList() {
      const { data } = await GetCropTypesList();
      const myData = data.data;
      for (let r of myData) {
        this.cropTypesData.push({ id: r.id, name: r.name });
      }
    },
    /* 保存编辑 */
    save() {
      this.$refs["editForm"].validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            const { name, cropVarietiesId } = this.form;
            if (this.dialogType === 1) {
              await PostCropsSave({ name, cropVarietiesId });
            } else {
              await PutCropsUpdate(this.updateId, { name, cropVarietiesId });
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
    // 搜索
    reload() {
      this.$nextTick(() => {
        this.$refs.table.reload();
      });
    },
    // 删除
    async deleteCropType(row) {
      try {
        this.tableLoading = true;
        await DeleteCrops(row.id);
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

<style lang="scss" scoped></style>

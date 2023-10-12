//稻丰系统设置-农机设备管理
<template>
  <div class="ele-body">
    <el-card shadow="never" body-style="padding: 22px 22px 0 22px;">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        label-width="77px"
        @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :md="6" :sm="12">
            <el-form-item label="关键字:" prop="Name">
              <el-input
                v-model="where.Name"
                placeholder="请输入关键字"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :md="18"  :sm="12">
            <el-form-item class="ele-text-right">
              <el-button
                type="primary"
                @click="reload"
                icon="el-icon-search"
                class="ele-btn-icon">查询
              </el-button>
              <el-button @click="(where={})&&reload()">重置</el-button>
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
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="saveDevice"
            size="small"
          >添加</el-button>
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-link
            @click="updateDevice(row)"
            type="success"
            :underline="false"
          >修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除吗？"
            @confirm="deleteDevice(row)"
          >
            <el-link
              type="danger"
              slot="reference"
              :underline="false"
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
        <el-form-item label="品牌:" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入品牌"
            clearable
          />
        </el-form-item>
        <el-form-item label="型号:" prop="model">
          <el-input
            v-model="form.model"
            placeholder="请输入型号"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="edit=false">取消</el-button>
        <el-button
          type="primary"
          @click="save"
          :loading="loading">保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogType: 1, //弹窗类型 1是添加 2是修改
      tableRequestParams: {
        pageName: 'pageIndex',
        limitName: 'pageSize',
      },
      // 表格搜索条件
      where: {},
      // 表格数据接口
      url:[],
      tableLoading: true,
      columns: [
        {
          label: '序号',
          columnKey: 'index',
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          prop: 'name',
          label: '品牌',
          minWidth: 110,
          align: 'center',
        },
        {
          prop: 'model',
          label: '型号',
          minWidth: 110,
          align: 'center',
        },
        {
          prop: 'action',
          label: '操作',
          width:120,
          align: 'center',
          slot: 'action',
        },
      ],
      // 编辑表单数据
      form: {},
      // 编辑表单验证规则
      rules: {
        model: [{ required: true, message: '请输入型号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
      },
      loading: false,
      edit: false,
      updateId:null,
    }
  },
  mounted() {
    this.url=[
      {id:1,name:'大疆',model:'T16'}
    ]
  },
  methods: {
    // 定义请求参数，可以理解为参数拦截器
    parseParam(res) {
      if (res.districtId) {
        return {
          ...res,
          districtId: res.districtId[res.districtId.length - 1],
          pageIndex: res.pageIndex - 1,
        }
      }
      return { ...res, pageIndex: res.pageIndex - 1 }
    },
    /* 调整数据格式 */
    parseData(res) {
      // 后端接口需要返回的数据格式为：{"code": 0, "data": [{},{}], "count": 10, "msg": ""}
      return {
        code: 0,
        data: res.data,
        count: res.meta.totalItemsCount,
        msg: res.message ? res.message : '',
      }
    },
    //添加作物品种
    saveDevice(){
      this.dialogType=1;
      this.edit=true;
    },
    //修改作物品种
    updateDevice(row){
      this.dialogType=2;
      this.updateId=row.id;
      this.form=Object.assign({},row);
      this.edit=true;
    },
    /* 保存编辑 */
    save() {
      this.$refs['editForm'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          this.form.id=this.url[this.url.length-1].id+1;
          try {
            if(this.dialogType===1){
              this.url.push({...this.form});
              //await PostCropVarietiesSave(this.form);
            }else {
              const arr=this.url;
              for (let r in arr){
                if(arr[r].id===this.updateId){
                  arr[r].name=this.form.name;
                  arr[r].model=this.form.model;
                }
              }
              //await PutCropVarietiesUpdate(this.updateId,this.form);
            }
            this.$message.success(this.dialogType  === 1 ? '添加成功' : '修改成功');
            this.edit = false
            this.reload();
            this.loading = false
          } catch {
            this.loading = false
          }
        } else {
          return false
        }
      })
    },
    // 搜索
    reload() {
      this.$nextTick(() => {
        this.$refs.table.reload()
      })
    },
    // 删除
    async deleteDevice(row) {
      try {
        this.tableLoading = true;
        const arr=this.url;
        for (let r in arr){
          if(row.id===arr[r].id){
            this.url.splice(r,1);
          }
        }
        //await DeleteCropVarieties(row.id);
        this.tableLoading = false
        this.reload()
        this.$message.success('删除成功')
      } catch {
        this.tableLoading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>



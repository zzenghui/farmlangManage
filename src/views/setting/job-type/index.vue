//稻丰系统设置-员工管理
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
<!--          <el-col :md="6" :sm="12">-->
<!--            <el-form-item label="状态:" prop="state">-->
<!--              <el-select v-model="where.state" placeholder="请选择状态">-->
<!--                <el-option label="全部" value="0"></el-option>-->
<!--                <el-option label="未开始" value="1"></el-option>-->
<!--                <el-option label="进行中" value="2"></el-option>-->
<!--                <el-option label="已完成" value="3"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
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
            @click="saveJobType"
            size="small"
          >添加</el-button>
        </template>
        <template slot="icon" slot-scope="{ row }">
          <i :class="row.icon"></i>
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-link
            @click="updateJobType(row)"
            type="success"
            :underline="false"
          >修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除吗？"
            @confirm="deleteItem(row)"
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
        <el-form-item label="作业类型:" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入作业类型"
            clearable
          />
        </el-form-item>
        <el-form-item label="作业图标:" prop="icon">
          <ele-icon-picker
            :class="form.icon==='' || form.icon===undefined?'':'pickerIcon'"
            v-model="form.icon"
            :data="iconData"
            placeholder="请选择作业图标">
          </ele-icon-picker>
        </el-form-item>
<!--        <el-form-item label="参考价格:" prop="price">-->
<!--          <el-input-->
<!--            v-model="form.price"-->
<!--            placeholder="请输入参考价格"-->
<!--            clearable-->
<!--          />-->
<!--        </el-form-item>-->
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
import {
  PostCropsWorkTypesSave,
  PutCropsWorkTypesUpdate,
  DeleteCropsWorkTypes
} from '@/api/cropWorkTypes';
import EleIconPicker from 'ele-admin/packages/ele-icon-picker';
export default {
  components:{
    EleIconPicker
  },
  data() {
    return {
      // icon数据列表
      iconData:[
        { title:'图标',icons:[
            'el-icon--shensongzuoye',
            'el-icon--shouhuozuoye',
            'el-icon--shifeizuoye',
            'el-icon--zuoye1',
            'el-icon--chayangji',
            'el-icon--penyaozuoye',
            'el-icon--honggan'
          ]
        }
      ],
      dialogType: 1, //弹窗类型 1是添加 2是修改
      tableRequestParams: {
        pageName: 'pageIndex',
        limitName: 'pageSize',
      },
      // 表格搜索条件
      where: {},
      // 表格数据接口
      url: '/api/CropWorkTypes',
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
          label: '作业类型',
          minWidth: 110,
          align: 'center',
        },
        {
          prop: 'icon',
          label: '作业图标',
          minWidth: 110,
          align: 'center',
          slot: 'icon'
        },
        // {
        //   prop: 'price',
        //   label: '参考价格',
        //   minWidth: 110,
        //   align: 'center',
        // },
        {
          prop: 'action',
          label: '操作',
          minWidth:120,
          align: 'center',
          slot: 'action',
        },
      ],
      // 编辑表单数据
      form: {
        icon:''
      },
      // 编辑表单验证规则
      rules: {
        name: [{ required: true, message: '请输入作业类型', trigger: 'blur' }],
        icon:[{ required: true, message: '请选择图标', trigger: '' }],
        // price:[{ required: true, message: '请输入参考价格', trigger: 'blur' }],
      },
      loading: false,
      edit: false,
      updateId:null
    }
  },
  watch:{
    edit(val){
      if(val===false){
        this.form.icon='';
      }
    }
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

    //添加作业类型
    saveJobType(){
      this.dialogType=1;
      this.edit=true;
    },
    /* 保存编辑 */
    save() {
      this.$refs['editForm'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            if(this.dialogType===1){
              await PostCropsWorkTypesSave(this.form);
            }else {
              await PutCropsWorkTypesUpdate(this.updateId,this.form);
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
    //编辑
    updateJobType(row) {
      this.dialogType = 2;
      this.form = Object.assign({},row);
      this.updateId=row.id;
      this.edit = true;
    },
    // 搜索
    reload() {
      this.$nextTick(() => {
        this.$refs.table.reload()
      })
    },
    // 删除
    async deleteItem(row) {
      try {
        this.tableLoading = true;
        await DeleteCropsWorkTypes(row.id);
        this.tableLoading = false;
        this.reload();
        this.$message.success('删除成功');
      } catch {
        this.tableLoading = false;
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.pickerIcon{
  width: 100%;
  ::v-deep .el-input__inner{
   padding-left:50px;
  }
}
</style>

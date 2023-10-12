<template>
  <div>
    <el-dialog :title="title" :visible="true" @close="close()" :destroy-on-close="true" :lock-scroll="false">
      <el-card shadow="never" body-style="padding: 0px 0px 0px 0px;">
        <el-form style="padding: 0;" :model="where" label-width="77px" @keyup.enter.native="reload"
          @submit.native.prevent>
          <el-row :gutter="15">
            <el-col :md="6" :sm="12"> </el-col>
            <el-col :md="6" :sm="24">
              <el-form-item label="关键字:" prop="Q">
                <el-input v-model="where.Q" placeholder="请输入关键字" clearable />
              </el-form-item>
            </el-col>

            <el-col :md="18" :sm="24">
              <el-form-item class="ele-text-right">
                <el-button type="primary" @click="reload" icon="el-icon-search" class="ele-btn-icon">查询
                </el-button>
                <el-button @click="(where = {}) && reload()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card shadow="never" body-style="padding: 0 0 0 0;">
        <ele-pro-table ref="table" :datasource="url" :where="where" :columns="columns" :request="tableRequestParams"
          :parseData="parseData" :parseParam="parseParam" :loading="tableLoading">
          <!-- <template slot="state" slot-scope="{ row }">
             <div class="state-style">
                <slot v-bind:row="row"></slot>
             </div>
          </template> -->


          <template slot="allowOnline" slot-scope="{ row }">
            {{row.isEnabled?'启用':'禁用'}}
          </template>
          <template slot="action" slot-scope="{ row }" v-if="row.name!=='Admin'">
            <!-- <el-link type="error" :underline="false"
              >编辑
            </el-link> -->
            <el-radio v-model="radio" name="user" :label="row.id" @change="onChange(row)">{{''}}</el-radio>
          </template>


        </ele-pro-table>

        <div style="text-align: right;">
          <el-button style="margin-left: 10px; float: right" @click.stop="cancel()">取消</el-button>
          <el-button style="float: right" type="primary" @click.stop="save()">确定</el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>


<script>
  import columns from './columns.js';
  import Model from './tableModel.js';
  import tableFun from './tableFun.js';
  import urlArr from './url.js';
  export default {
    name: 'userDialogPanel',
    props: {
      type: {
        type: Number,
        default: 2
      },
      title: {
        type: String,
        default: '关联员工',
      },
      select: {
        type: String,
        default: '',
      }
    },
    created() {
      if (this.select) {
        this.radio = parseInt( this.select);
      }
    },
    watch:{
      datas(val){
           if(this.select&& val.length){
              const dto = val.find(r=> r.id== this.select);
              if(dto){
                this.rowData=dto;
              }
           }
      }
    },
    data() {
      const type = this.type;
      const model = new Model({
        url: urlArr[type],
        columns: columns[type]
      });
      return {
        ...model,
        radio: 0,
        rowData: null,
      };
    },
    methods: {
      ...tableFun,
      close() {
        this.$emit('cancel', false);
      },
      save() {
        this.$emit('save', this.rowData);
      },
      cancel() {
        this.$emit('cancel', false);
      },
      onChange(row) {
        this.rowData = row;
        console.log(this.rowData);
      },
    }
  }
</script>

<style>
</style>

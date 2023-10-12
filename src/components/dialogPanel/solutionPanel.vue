<template>
  <div>
    <el-dialog :title="title" :visible="true" @close="close()" :destroy-on-close="true" :lock-scroll="false"  >
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
            <el-col :md="10" :sm="12">
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
            <el-col :md="8" :sm="10">
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
      <el-card shadow="never" body-style="padding: 0 0 0 0;">
        <ele-pro-table ref="table" :datasource="url" :where="where" :columns="columns" :request="tableRequestParams"
          :parseData="parseData" :parseParam="parseParam" :loading="tableLoading">
          <!-- <template slot="state" slot-scope="{ row }">
             <div class="state-style">
                <slot v-bind:row="row"></slot>
             </div>
          </template> -->



       <template slot="state" slot-scope="{ row }">
         <ele-dot v-if="row.state == 0" type="danger" text="待审核" />
         <ele-dot v-else type="success" text="正常" />
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
  import { getCropsListData } from "@/api/crops";
  export default {
    name: 'solutionPanel',
    props: {
      type: {
        type: Number,
        default: 3
      },
      title: {
        type: String,
        default: '关联方案库',
      },
      select: {
        type: String,
        default: '',
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
    created() {
      this.where.state=1;
      if (this.select) {
        this.radio = parseInt( this.select);
      }
      this.getCropsList();
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
        crops:null,
      };
    },
    methods: {
      ...tableFun,
      async getCropsList() {
        const {
          data: { data }
        } = await getCropsListData();
        this.crops = data;
      },
      close() {
        this.$emit('cancel', false);
      },
      save() {
        if(!this.rowData)return;
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

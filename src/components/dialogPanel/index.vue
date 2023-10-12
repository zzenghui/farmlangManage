<template>
  <div>
    <el-dialog :title="title" :visible="true" @close="close()" :destroy-on-close="true" :lock-scroll="false"
      :width="width">
      <el-card shadow="never" body-style="padding: 0px 0px 0px 0px;">
        <Query @reload="queryLoad($event)" :queryType="queryType"></Query>
      </el-card>
      <el-alert type="info" class="ele-alert-border" :closable="false" style="margin-bottom: 15px;">
        <i class="el-icon-info ele-text-info"></i>
        <span class="ele-text">
          <span>已选择 <b class="ele-text-info">{{ objData.length }}</b> 项</span>
        </span>
        <!--  <el-link style="margin-left: 10px;" @click="clearChoose" type="primary" :underline="false">清空
        </el-link> -->
      </el-alert>
      <el-card shadow="never" body-style="padding: 0 0 0 0;">
        <ele-pro-table ref="table" :datasource="url" :where="where" :columns="columns" :request="tableRequestParams"
          :parseData="parseData" :parseParam="parseParam" :loading="tableLoading" :row-click-checked="true"
          :selection.sync="selection">
          <template slot="state" slot-scope="{ row }">
            <div class="state-style">
              <slot v-bind:row="row"></slot>
            </div>
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
  import Query from './query.vue';
  export default {
    name: 'dialogPanel',
    components: {
      Query,
    },
    props: {
      type: {
        type: Number,
        default: 0
      },
      title: {
        type: String,
        default: '关联订单和服务',
      },
      queryType: {
        type: Number,
        default: 0
      },
      width: {
        type: String,
        default: () => '1200px'
      },
      ids: {
        type: Array,
        default: [],
      }
    },
    watch: {
      datas(val) {
        console.log(this.ids);
        setTimeout(() => {
          const arr= this.objData.map(r=> r.id);
          arr.forEach(r=> {
            if(this.ids.indexOf(r)=== -1){
              this.ids.push(r);
            }
          });
          this.ids.forEach(r => {
            const dto = val.find(res => res.id== r);
            if (dto) {
              this.$refs.table.toggleRowSelection(dto, true);
            }
          });
        }, 50);
      },
      selection(val){
          this.dataMap.set(this.pageIndex,this.selection);
          this.setObjData();
      }
    },

    computed: {
      // 计算服务总调用次数
      sumTimes() {
        this.selection.forEach(d => sum += d.callTimes);
        return sum;
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
        selection: [],
        dataMap : new Map(),
        objData:[]
      };
    },
    methods: {
      ...tableFun,
      close() {
        this.$emit('cancel', false);
      },
      save() {
        console.log(this.selection);
        if (!this.selection.length) return;
        this.$emit('save', this.selection);
      },
      cancel() {
        this.$emit('cancel', false);
      },
      clearChoose() {

      },
      queryLoad(event) {
        this.dataMap.clear();
        this.objData=[];
        this.where = event;
        this.reload();
      },
      setObjData(){
        let arr= [];
        this.dataMap.forEach(val => {
            if(val.length > 0){
                arr= [...new Set([...arr, ...val])];
            }
        });
        this.objData = arr;
        const ids = this.objData.map(r=> r.id);
      }
    }
  }
</script>

<style>
</style>

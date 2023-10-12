<template>
    <el-form :model="where" label-width="86px" @keyup.enter.native="reload" @submit.native.prevent>
      <el-row :gutter="15">
        <el-col :lg="5" :sm="12">
          <el-form-item label="问题类型:" prop="QuestionTypeId">
            <el-select v-model="where.QuestionTypeId" placeholder="请选择问题类型">
              <el-option v-for="(arr,index) in questionTypeData" :key="index" :label="arr.name" :value="arr.id">
              </el-option>
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
            <el-input v-model="where.FieldNo" placeholder="请输入农田ID" style="width: 220px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="10" :sm="12">
          <el-form-item class="ele-text-right">
            <el-button type="primary" @click="reload" icon="el-icon-search" class="ele-btn-icon">查询
            </el-button>
            <el-button @click="(where = {}) && reload()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name:'questionQuery',
    data() {
      return {
        where: {}
      };
    },
    computed:{
      ...mapState(['questionTypeData']),
    },
    methods:{
      /* 刷新表格 */
      reload() {
        console.log(111);
         this.$emit('reload',this.where);
      },

    }
  }
</script>

<style scoped lang="scss">
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

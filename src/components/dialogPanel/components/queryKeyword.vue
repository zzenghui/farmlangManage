<template>
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
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name:'queryKeyword',
    data() {
      return {
        where: {}
      };
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




<style>
</style>

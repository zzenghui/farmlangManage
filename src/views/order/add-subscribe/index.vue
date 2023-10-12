// 添加预约/订单
<template>
  <div class="ele-body">
    <el-row :gutter="10">
      <el-col :lg="$route.query.fieldId?16:24" :md="24">
        <el-card shadow="never" class="never-card">
          <div slot="header">
            <h4 class="ele-text-primary">
              预约服务
            </h4>
          </div>
          <el-form :model="form" ref="editForm" class="form-info" :rules="rules" label-width="100px"
            @submit.native.prevent>
            <el-form-item label="联系人姓名:" prop="clientName">
              <el-input v-model="form.clientName" placeholder="请输入联系人姓名" clearable />
            </el-form-item>
            <el-form-item label="联系方式:" prop="clientPhone">
              <el-input v-model="form.clientPhone" placeholder="请输入联系方式" clearable />
            </el-form-item>
            <el-form-item label="服务类型:" prop="serviceTypeId">
              <el-select v-model="form.serviceTypeId" placeholder="请选择服务类型" style="width: 100%" filterable>
                <el-option v-for="(arr,index) in options" :key="index" :label="arr.name" :value="arr.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预约日期:" prop="reserveDate">
              <el-date-picker v-model="form.reserveDate" type="date" style="width: 100%" placeholder="请选择预约日期"
                value-format="yyyy-MM-dd HH:mm:ss">

              </el-date-picker>
            </el-form-item>
            <el-form-item label="服务内容:" prop="content">
              <el-input type="textarea" resize="none" :rows="6" v-model="form.content" placeholder="请输入服务内容" clearable />
            </el-form-item>
            <el-form-item class="form-item-style">
              <el-button type="primary" @click="save">确定</el-button>
              <el-button @click="form = {}">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :lg="$route.query.fieldId?8:0" :md="$route.query.fieldId?24:0">
        <user-field-map :serviceData="true" @changeService="getConsumerData"></user-field-map>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import userFieldMap from "@/components/user-field-map.vue";
  import {
    getTypeOfServiceList
  } from "@/api/typeOfService";
  import {
    postOrderSave
  } from "@/api/order";
  import {
    getCropWorkTypeList
  } from '@/api/cropWorkTypes/index.js';
  export default {
    components: {
      userFieldMap
    },
    data() {
      return {
        // 编辑表单数据
        form: {
          clientName: '',
          clientPhone: ''
        },
        rules: {
          clientPhone: [{
            required: true,
            message: "请输入联系方式",
            trigger: "blur"
          }],
          serviceTypeId: [{
            required: true,
            message: "请选择服务类型",
            trigger: "blur"
          }],
          reserveDate: [{
            required: true,
            message: "请选择预约日期",
            trigger: "blur"
          }],
        },
        options: new Array()
      };
    },
    created() {
      // this.getServiceType();
      // this.getCropWorkTypeList();
      this.getServiceType();
      this.getConsumerData();
    },
    methods: {
      async getServiceType() {
        this.options = [];
        const {
          data
        } = await getTypeOfServiceList();
        const myData = data.data;
        for (let r of myData) {
          this.options.push({
            name: r.name,
            id: r.id
          });
        }
      },
      async getCropWorkTypeList() {
        // this.options=[];
        // const { data } =await getTypeOfServiceList();
        // const myData=data.data;
        // for (let r of myData){
        //   this.options.push({name:r.name,id:r.id});
        // }
        // const { data } =  await  getCropWorkTypeList();

        // const myData=data.data;

        // for (let r of myData){
        //   this.options.push({name:r.name,id:r.id});
        // }
      },

      getConsumerData(val) {
        if (val) {
          this.form.clientName = val.name;
          this.form.clientPhone = val.phone;
        }
      },
      save() {
        this.$refs["editForm"].validate(async valid => {
          if (valid) {
            const clientId = this.$route.query.customerId;
            const fieldId = this.$route.query.fieldId;
            await postOrderSave({
              ...this.form,
              clientId,
              fieldId
            })
            this.$message.success('添加成功');
            await this.$router.push({
              path: '/order/indent'
            })
          }
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "index";
</style>

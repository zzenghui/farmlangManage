// 我是方案库表单组件
<template>
      <el-form
        v-if="form"
        :model="form"
        :rules="rules"
        ref="editForm"
        style="width:600px"
        label-width="90px"
        @submit.native.prevent
      >
        <el-form-item label="方案名称:" prop="name">
          <el-input
            type="textarea"
            resize="none"
            :autosize="{ minRows: 3, maxRows: 6 }"
            v-model="form.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="方案说明:" prop="instruction">
          <el-input v-model="form.instruction" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="适用作物:" prop="cropId">
          <el-select
            v-model="form.cropId"
            placeholder="请选择适用作物"
            style="width: 100%"
          >
            <el-option
              v-for="(arr, index) in cropData"
              :key="index"
              :label="arr.name"
              :value="arr.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="防治用药:">
          <div
            v-for="(item, index) in form.products"
            :key="index"
            class="product-item ele-cell"
          >
            <el-select
              v-model="item.productId"
              placeholder="请选择防治用药"
              @change="$event => changeProduct(index, $event)"
            >
              <el-option
                v-for="arr in products"
                :key="arr.id"
                :label="arr.name"
                :value="arr.id"
              ></el-option>
            </el-select>
            规格:
            <el-input-number
              v-model="item.amount"
              placeholder="请输入规格"
              style="width: 130px;"
              :controls="false"
              clearable
            ></el-input-number>
            <el-input
              readonly
              v-model="item.unit"
              placeholder="单位"
              style="width: 80px;"
              clearable
            />
            <i
              :class="index===0?'el-icon-circle-plus-outline ele-text-primary':'el-icon-remove-outline ele-text-primary'"
              style="font-size:20px"
              @click="addAndDelProduct(index)"
            ></i>
          </div>
        </el-form-item>

        <el-form-item label="作业方法:" prop="jobDescription">
          <el-input
            type="textarea"
            resize="none"
            :rows="6"
            v-model="form.jobDescription"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="注意事项:" prop="remark">
          <el-input
            type="textarea"
            resize="none"
            :rows="6"
            v-model="form.warnDescription"
            placeholder="请输入注意事项"
            clearable
          />
        </el-form-item>
      </el-form>
</template>

<script>
const initProduct = {
  productId: "",
  amount: "",
  unit: ""
};
import { getCropsListData } from "@/api/crops";
import { getProductList } from "@/api/product";
export default {
  props:{
    form:{
      type:Object,
      default:null
    }
  },
  data() {
    return {
      // 编辑表单数据

      rules: {
        name: [{ required: true, message: "请输入作物名称", trigger: "blur" }],
        instruction: [
          { required: true, message: "请输入方案说明", trigger: "blur" }
        ]
      },
      // 选择方案
      cropData: [],
      products: [],
    };
  },
  created() {
    this.getCropsList();
    this.getProductList();
  },
  methods: {
    async getCropsList() {
      this.cropData = [];
      const { data } = await getCropsListData();
      const myData = data.data;
      for (let r in myData) {
        this.cropData.push({
          id: myData[r].id,
          name: myData[r].name
        });
      }
    },
    async getProductList() {
      const {
        data: { data }
      } = await getProductList();
      this.products = data;
    },
    changeProduct(index, value) {
      this.form.products[index].unit = this.products.find(
        e => e.id == value
      ).unit;
    },
    addAndDelProduct(index) {
      if(index===0){
        this.form.products.push({ ...initProduct });
        return;
      }
      this.form.products.splice(index,1);
    },
  }
};
</script>

<style lang="scss" scoped>
.product-item {
  margin-top: 10px;
  justify-content: space-between;
}
.product-item:nth-of-type(1){
  margin-top: 0;
}
</style>

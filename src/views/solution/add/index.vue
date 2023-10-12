// 添加方案库
<template>
  <div class="ele-body">
    <el-card shadow="never">
      <div slot="header">
        <h4 class="ele-text-primary">添加方案</h4>
      </div>
      <el-form
        :model="form"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        style="width: 600px;"
        @submit.native.prevent
      >
        <el-form-item label="引用方案:">
          <el-select
            v-model="solutionId"
            filterable
            placeholder="请选择"
            @change="changeSolution"
          >
            <el-option
              v-for="item in solutions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方案名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="方案说明:" prop="instruction">
          <el-input v-model="form.instruction" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="适用作物:" prop="cropId">
          <el-cascader
            v-model="form.cropId"
            :options="cropsTree"
            clearable
            style="width: 100%"
          ></el-cascader>
          <!-- @change="handleChange" -->
          <!-- <el-select
            v-model="form.cropId"
            placeholder="请选择作物类型"
            style="width: 33%"
          >
            <el-option
              v-for="(arr, index) in cropData"
              :key="index"
              :label="arr.name"
              :value="arr.id"
            ></el-option>
          </el-select> -->
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
              v-if="index == 0"
              class="el-icon-circle-plus-outline ele-text-primary"
              style="font-size:20px;margin-left: 10px;"
              @click="addProduct(index)"
            ></i>
            <i
              v-else
              class="el-icon-remove-outline ele-text-primary"
              style="font-size:20px;margin-left: 10px;"
              @click="subProduct(index)"
            ></i>
          </div>
        </el-form-item>

        <el-form-item label="作业方法:" prop="jobDescription">
          <el-input
            type="textarea"
            v-model="form.jobDescription"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="注意事项:" prop="remark">
          <el-input
            type="textarea"
            v-model="form.warnDescription"
            placeholder="请输入注意事项"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
const initProduct = {
  productId: "",
  amount: "",
  unit: ""
};
const initForm = {
  name: "",
  cropId: "",
  jobDescription: "",
  warnDescription: "",
  products: [{ ...initProduct }]
};
import {
  getSolutionList,
  getSolution,
  addSolution,
  updateSolution
} from "@/api/solution";
import { getCropsTree } from "@/api/crops";
import { getProductList } from "@/api/product";
export default {
  data() {
    return {
      // 编辑表单数据
      form: initForm,
      rules: {
        name: [{ required: true, message: "请输入作物名称", trigger: "blur" }],
        instruction: [
          { required: true, message: "请输入方案说明", trigger: "blur" }
        ]
      },
      // 选择方案
      solutionId: "",
      solutions: [],
      cropsTree: [],
      products: [],
      // 是否为编辑状态
      edit: false
    };
  },
  created() {
    const { id } = this.$route.query;
    const edit = id ? true : false;
    this.edit = edit;
    this.getCropsTree();
    this.getSolutionList();
    this.getProductList();
    if (edit) {
      this.getSolution();
    }
  },
  methods: {
    async getSolutionList() {
      const {
        data: { data }
      } = await getSolutionList();
      this.solutions = data;
    },
    async getSolution(id = this.$route.query.id) {
      const { data } = await getSolution(id);
      this.form = data;
    },
    async getCropsTree() {
      const { data } = await getCropsTree();
      this.cropsTree = data;
    },
    async getProductList() {
      const {
        data: { data }
      } = await getProductList();
      this.products = data;
    },
    changeSolution(id) {
      this.getSolution(id);
    },
    changeProduct(index, value) {
      this.form.products[index].unit = this.products.find(
        e => e.id == value
      ).unit;
    },
    addProduct(key) {
      this.form.products.push({ ...initProduct });
    },
    subProduct(key) {
      this.form.products.splice(key, 1);
    },
    save() {
      this.$refs["editForm"].validate(async valid => {
        if (valid) {
          const form = { ...this.form };
          form.products = form.products.filter(e => e.productId);
          form.cropId = form.cropId[form.cropId.length - 1];
          console.log(form);
          if (this.edit) {
            const { id } = this.$route.query;
            await updateSolution(id, form);
          } else {
            await addSolution(form);
          }
          this.$message.success("操作成功");
          this.$router.back();
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.form = { ...initForm };
    }
  }
};
</script>

<style lang="scss" scoped>
.product-item {
  margin-top: 10px;
  justify-content: space-between;
}
</style>

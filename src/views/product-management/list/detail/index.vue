//政策管理-政策详情
<template>
  <div class="ele-body">
    <el-card shadow="never" class="el-card-define">
      <el-row :gutter="10">
        <el-col :span="24">
          <h2 style="color: #6b9b52">产品详情</h2>
        </el-col>
      </el-row>
      <el-row class="row-image" :gutter="10">
        <el-col :span="24">
          <div class="upload-image">
            <label>上传图片:</label>
            <p class="upload-p">
              <el-image
                class="img"
                v-for="(arr, index) in form.images"
                :key="index"
                :src="pathHeaderName + arr.thumbImage"
                :preview-src-list="[pathHeaderName + arr.url]"
              >
              </el-image>
            </p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :md="6" :sm="24" class="el-card-row2">
          <p>产品类型:&emsp;<span v-text="form.productTypeName"></span></p>
        </el-col>
        <el-col :md="6" :sm="24" class="el-card-row2">
          <p>产品名称:&emsp;<span v-text="form.name"></span></p>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :md="6" :sm="24" class="el-card-row2">
          <p>规格:&emsp;<span v-text="form.meterage+'/'+form.unit"></span></p>
        </el-col>
        <el-col :md="6" :sm="24" class="el-card-row2">
          <p>批准登记号:&emsp;<span v-text="form.registerCode"></span></p>
        </el-col>
        <!--        <el-col :md="6" :sm="24" class="el-card-row2">-->
        <!--          <p>生产日期:&emsp;<span v-text="form.produceDate.split(' ')[0]"></span></p>-->
        <!--        </el-col>-->
      </el-row>
      <el-row :gutter="10">
        <el-col :md="6" :sm="24" class="el-card-row2">
          <p>产品ID:&emsp;<span v-text="form.no"></span></p>
        </el-col>
        <el-col :span="12" class="el-card-row2">
          <p>主要成分:&emsp;<span v-text="form.meterage"></span></p>
        </el-col>
      </el-row>
      <!--      <el-row :gutter="10">-->
      <!--        <el-col :md="6" :sm="24" class="el-card-row2">-->
      <!--          <p>创建人ID:&emsp;<span v-text="form.createId"></span></p>-->
      <!--        </el-col>-->
      <!--        <el-col :md="6" :sm="24" class="el-card-row2">-->
      <!--          <p>创建时间:&emsp;<span v-text="form.createDate.split(' ')[0]"></span></p>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <el-row :gutter="10">-->
      <!--        -->
      <!--      </el-row>-->
      <el-row :gutter="10">
        <el-col :span="12" class="el-card-row2">
          <div class="upload-image say">
            <label>产品描述:</label>
            <span v-text="form.remark"></span>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {GetProductDetail} from '@/api/product';

export default {
  data() {
    return {
      form: {
        //产品类型
        productTypeName: '',
        //产品名称
        name: '',
        //登记号
        registerCode: '',
        //单位
        unit: '',
        //计量
        meterage: '',
        //生产日期
        produceDate: '',
        //创建时间
        createDate: ''
      }
    }
  },
  computed: {
    pathHeaderName() {
      const header = location.hostname;
      if (header === 'www.hzdaofeng.com') {
        return `https://${header}`
      } else if (header === 'rydemo.ryaims.com') {
        return `https://${header}:30100`
      }
      return `https://rydemo.ryaims.com:30100`
    }
  },
  watch: {
    '$route.query.id': {
      immediate: true,
      deep: true,
      handler(newV) {
        if (newV) {
          return this.getAppUserInfo()
        }
      }
    }
  },
  methods: {
    /* 获取当前产品信息 */
    async getAppUserInfo() {
      const {data} = await GetProductDetail(this.$route.query.id);
      this.form = data;
    },
  }
}
</script>
<style scoped lang="scss">
@import "index";
</style>

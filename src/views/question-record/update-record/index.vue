// 添加预约/订单
<template>
  <div class="ele-body">
    <el-row :gutter="10">
      <el-col :lg="16" :md="24">
        <el-card shadow="never" class="never-card">
          <div slot="header">
            <h4 class="ele-text-primary">
              问题记录
            </h4>
          </div>
          <div class="box-house">
          <el-form
            :model="form"
            ref="editForm"
            class="form-info"
            :rules="rules"
            label-width="100px"
            @submit.native.prevent
          >
            <el-form-item
              label="问题类型:"
              prop="questionTypeId"
            >
              <el-select
                v-model="form.questionTypeId"
                placeholder="请选择问题类型"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="(arr,index) in optionTypes"
                  :key="index"
                  :label="arr.name"
                  :value="arr.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="问题等级:"
              prop="questionLevelId"
            >
              <el-select
                v-model="form.questionLevelId"
                placeholder="请选择问题等级"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="(arr,index) in optionLevels"
                  :key="index"
                  :label="arr.name"
                  :value="arr.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题:" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入标题"
                clearable
              />
            </el-form-item>
            <el-form-item label="问题描述:" prop="remarks">
              <el-input
                type="textarea"
                v-model="form.remarks"
                placeholder="请输入问题描述"
                clearable
              />
            </el-form-item>
            <el-form-item label="上传图片:" prop="album">
              <div class="upload-product upload-file">
                <div
                  class="img-father"
                  v-for="(arr,index) in uploadImgData"
                  :key="index"
                >
                  <!--              删除按钮-->
                  <p class="product-p" @click="UploadDelete(index)">x</p>
                  <!--                  <p class="main-figure">-->
                  <!--                    <span @click="mainFigureClick(arr)">设为主图</span>-->
                  <!--                  </p>-->
                  <img
                    class="product-img"
                    :src="arr"
                    alt="加载失败..."/>
                </div>
                <el-upload
                  :multiple="true"
                  action="none"
                  :before-upload="handleBeforeUpload"
                  :on-exceed="handleExceed"
                  :on-change="imgSaveToUrl"
                  :show-file-list="false"
                  accept=".png,.jpg,.gif"
                  class="product-item"
                >
                  <button class="item-button">+</button>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item class="button-jy">
              <button v-if="!showProgram" @click="changeProgram">添加建议解决方案</button>
              <p v-else>建议解决方案:</p>
            </el-form-item>
            <div v-show="showProgram">
              <el-form-item class="label-slot">
                <span slot="label">引用方案:</span>
                <el-select
                  v-model="solutionId"
                  filterable
                  style="width: 100%"
                  @change="changeSolution"
                  placeholder="请选择"
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
              <el-form-item>
                <span slot="label">建议方案:</span>
                <el-input
                  type="textarea"
                  resize="none"
                  :rows="6"
                  v-model="form.suggestContent"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </div>
            <!--引用方案-->
            <TableProgram :form="formObjData"></TableProgram>
            <el-form-item class="form-item-style">
              <el-button type="primary" @click="save">确定</el-button>
              <el-button @click="form = {}">取消</el-button>
            </el-form-item>
          </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="24">
        <user-field-map></user-field-map>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userFieldMap from "@/components/user-field-map.vue";
import { mapState } from 'vuex';
import {PostProductImageUpload} from "@/api/productImages";
import TableProgram from '@/components/tableProgram';
import { getQuestionRecordDetail,putQuestionRecordUpdate } from "@/api/questionRecord";
import {getSolution, getSolutionList} from "@/api/solution";
export default {
  components: {
    userFieldMap,
    TableProgram
  },
  // props:{
  //   // 允许上传的文件类型, 例如["pdf"]
  //   fileType: {
  //     type: Array,
  //     default: () => []
  //   },
  // },
  data() {
    return {
      fileType:["jpg","png","gif"],
      formData:[],
      // 编辑表单数据
      form: {
        album:null,
      },
      rules:{
        title:[{ required: true, message: "请输入标题", trigger: "blur" }],
        remarks:[{ required: true, message: "请输入问题描述", trigger: "blur" }],
        questionTypeId:[{ required: true, message: "请选择问题类型", trigger: "blur" }],
        questionLevelId:[{ required: true, message: "请选择问题等级", trigger: "blur" }],
        album:[{ required: true, message: "请上传照片", trigger: "blur" }]
      },
      optionTypes:null,
      optionLevels:null,
      uploadImgData:new Array(),
      num:0,
      imageData:new Array(),
      //引用方案
      solutionId:'',
      solutions:new Array(),
      showProgram:false,
      formObjData:null,
    };
  },
  created() {
    this.getLevelsType();
    this.getRecordDetailData();
    this.getSolutionList();
  },
  methods: {
    //过滤方案数据
    filterSolution() {
      const r = this.formObjData;
      const s = [];
      if(r){
        const p = this.formObjData.products;
        for(let i=0;i<p.length;i++){
          s.push({
            productId:p[i].productId,
            amount:100
          })
        }
        return {
          type:1,
          relateId:this.$route.query.id,
          name: r.name,
          instruction:r.instruction,
          cropId: r.cropId,
          jobDescription:r.jobDescription,
          warnDescription:r.warnDescription,
          products: [...s]
        }
      }
    },
    //显示方案
    changeProgram(){
      this.showProgram=true;
    },
    async getSolutionList() {
      const {
        data: { data }
      } = await getSolutionList();
      this.solutions = data;
    },
    //选择方案
    async changeSolution(id){
      const { data } = await getSolution(id);
      this.formObjData=data;
//       let products = '';
//       for(let i=0;i<data.products.length;i++){
//           products +=`${i+'、'+data.products[i].name +data.products[i].meterage+'/'+data.products[i].unit} `
//       }
//       const obj = `方案名称: ${data.name}
// 方案说明: ${data.instruction}
// 适用作物: ${data.cropName}
// 防治用药: ${products}
// 作业方法: ${data.jobDescription}
// 注意事项: ${data.warnDescription}`;
//       this.remarks=obj;
    },
    async getLevelsType(){
      this.optionLevels=[];
      this.optionTypes=[];
      const typeData=this.questionTypeData;
      const levelData=this.questionGradeData;
      for (let r of typeData){
        this.optionTypes.push({name:r.name,id:r.id});
      }
      for (let r of levelData){
        this.optionLevels.push({name:r.name,id:r.id});
      }
    },
    async getRecordDetailData(){
       const { data } = await getQuestionRecordDetail(this.$route.query.id);
       this.form={
         questionTypeId:data.questionTypeId,
         questionLevelId:data.questionLevelId,
         title:data.title,
         remarks:data.remarks,
         album:data.album,
         suggestContent:data.suggestContent
       }
       if(data.solutionA){
         this.showProgram = true;
         this.formObjData = data.solutionA;
       }
       this.uploadImgData=[];
       if(data.album.length > 0){
         for (let r of data.album){
           this.uploadImgData.push(
             r.thumbPath
           )
         }
       }
       this.imageData=data.album;
    },
    // 上传前校检格式和大小
    async handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some((type) => {
          return fileExtension && fileExtension.indexOf(type) > -1;
        });
        if (!isTypeOk) {
          this.$message.warning(`文件格式不正确，请上传${this.fileType.join("/")}格式文件！`);
          return false;
        }
        if([...this.imageData,...this.formData].length > 2 ){
          return ;
        }
        this.formData.push(file);
        this.$message.success('上传成功');
      }
      return false;
    },
    handleExceed(files,fileList) {
      this.$message.warning(`当前限制选择1个文件，本次选择了${files.length} 个文件，共选择了${fileList.length+files.length} 个文件`);
    },
    //生成图片
    imgSaveToUrl(file){
      this.num++;
      if(this.uploadImgData.length > 2&& this.num===1){
        this.$message.info('上传图片最多限制三张^.^');
        return;
      }
      let URL=window.URL || window.webkitURL;
      if(this.num===1){
        this.uploadImgData.push(URL.createObjectURL(file.raw));
        this.form.album=this.uploadImgData;
      }
      if(this.num===2){
        this.num=0;
      }
    },
    UploadDelete(index){
      this.uploadImgData.splice(index,1);
      this.formData.splice(index,1);
      this.form.album=this.uploadImgData;
      this.imageData.splice(index,1);
    },
    save() {
      this.$refs["editForm"].validate(async valid => {
        if(valid){
          if(this.formData.length > 0){
            await this.mySave();
          }
          if(this.formData.length===0){
            this.form.album=this.imageData;
          }
          const s = this.filterSolution();
          const fieldId=this.$route.query.fieldId;
          const id = this.$route.query.id;
          console.log({
            ...this.form,
            fieldId,
            solution:s?{
              ...s
            }:null
          })
          await putQuestionRecordUpdate(Number(id),{
            ...this.form,
            fieldId,
            solution:s?{
              ...s
            }:null
          });
          this.$message.success('修改成功');
          await this.$router.push({
            path:'/question/record'
          })
        }
      });
    },
    async mySave(){
      const images=[];
      if(this.uploadImgData.length > 0){
        for (let file in this.formData){
          let fromData=new FormData();
          fromData.append('file',this.formData[file]);
          const { data } = await PostProductImageUpload(fromData);
          images.push({path:data[0].url,thumbPath:data[1].url});
        }
      }
      this.form.album=[...this.imageData,...images];
    }
  },
  computed:{
    ...mapState(['questionTypeData','questionGradeData'])
  }
};
</script>

<style lang="scss" scoped>
@import "index";
</style>



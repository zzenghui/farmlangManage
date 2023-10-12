// 添加问题记录
<template>
  <div class="ele-body" v-if="form">
    <el-row :gutter="10">
      <el-col :lg="16" :md="24">
        <el-card shadow="never" class="never-card">
          <div slot="header" class="header">
            <h4 class="ele-text-primary">
              {{ form.title }}
            </h4>
            <p class="ele-text-primary" v-for="(obj,index) in form.cycles" :key="index">#{{ obj.name }}</p>
            <p>{{ form.no }}</p>
          </div>
          <div class="box-scroll">
            <div class="type-style">
              <p
                :style="form.questionLevel.color?{ color:form.questionLevel.color }:''"
              >{{ form.questionType.name }}</p>
              <p :class="form.questionType.icon"
                 :style="{ backgroundColor:form.questionLevel.color }"
              >
              </p>
            </div>
            <div class="wt-ms">
              <p>问题描述 {{ form.remarks }}</p>
            </div>
            <div class="wt-img">
              <el-image
                v-for="(arr,index) in form.album"
                :key="index"
                :src="arr.thumbPath"
                :preview-src-list="[arr.path]">
              </el-image>
            </div>
            <div class="dq-mk" v-if="form.solutionA">
              <p class="ele-text-primary p">建议解决方案:</p>
              <p>方案名称: {{ form.solutionA.name }}</p>
              <p>方案说明: {{ form.solutionA.instruction }}</p>
              <p>适用作物: {{ form.solutionA.cropName }}</p>
              <div class="fz">
                <p>防治用药:</p>
                <div>
                  <p class="p1" v-for="(obj,index) in form.solutionA.products" :key="index">
                    <span>{{ obj.name }}</span>
                    {{ obj.amount }}{{ obj.unit === 0 ? '克(K)' : obj.unit === 1 ? '千克(KG)' : obj.unit === 2 ? '毫升(ML)' : '升(L)' }}
                  </p>
                </div>
              </div>
              <p>作业方法: {{ form.solutionA.jobDescription }}</p>
              <p>注意事项: {{ form.solutionA.warnDescription }}</p>
            </div>
            <div class="dq-mk" v-if="form.solutionB">
              <p class="ele-text-primary p">实际解决方案:</p>
              <p>方案名称: {{ form.solutionB.name }}</p>
              <p>方案说明: {{ form.solutionB.instruction }}</p>
              <p>适用作物: {{ form.solutionB.cropName }}</p>
              <div class="fz">
                <p>防治用药:</p>
                <div>
                  <p class="p1" v-for="(obj,index) in form.solutionB.products" :key="index">
                    <span>{{ obj.name }}</span>
                    {{ obj.amount }}{{ obj.unit === 0 ? '克(K)' : obj.unit === 1 ? '千克(KG)' : obj.unit === 2 ? '毫升(ML)' : '升(L)' }}
                  </p>
                </div>
              </div>
              <p>作业方法: {{ form.solutionB.jobDescription }}</p>
              <p>注意事项: {{ form.solutionB.warnDescription }}</p>
            </div>
            <Speak
              class="speak"
              :position-time="'right'"
              v-for="(arr,index) in sayOptions"
              :key="index"
              :say-data="arr"
            ></Speak>
            <hr class="hr"/>
            <div class="comment-style" id="scrollView" ref="toScrollBottom">
              <Speak
                class="speak"
                :position-time="'bottom'"
                v-for="(arr,index) in commentData"
                :key="index"
                :say-data="arr"
              >
                <div slot="img" class="com-img" v-if="arr.album.length > 0">
                  <el-image
                    style="width:80px; height:80px"
                    v-for="(r,index) in arr.album"
                    :key="index"
                    :src="r.thumbPath"
                    :preview-src-list="[r.path]">
                  </el-image>
                </div>
              </Speak>
              <div class="self">
                <div v-if="form.stateCode === 4">
                  <!--                  <div>-->
                  <div v-if="!form.solutionB">
                    <el-form style="width: 600px">
                      <el-form-item class="button-jy">
                        <button v-if="!showProgram" @click="changeProgram" style="margin-bottom: 20px">添加建议解决方案</button>
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
                            v-model="suggestContent"
                            placeholder="请输入"
                            clearable
                          />
                        </el-form-item>
                      </div>
                    </el-form>
                    <TableProgram :form="formObjData"></TableProgram>
                    <div style="width: 600px;text-align: right" v-if="formObjData">
                      <el-button size="small" type="success" style="margin-right:70px;margin-bottom: 20px"
                                 @click="toActualPlan">发送
                      </el-button>
                    </div>
                  </div>
                  <div v-permission="'question_common'">
                    <div class="self-item1">
                      <img :src="infoMe.avatar" alt=""/>
                      <el-input class="input-el" type="textarea"
                                resize="none"
                                :rows="6"
                                placeholder="请输入"
                                maxlength="100"
                                v-model="say"
                                :autofocus="autofocus"
                                show-word-limit
                                @focus="updateScroll"
                                @keyup.enter.native="commentClick"
                                clearable
                      ></el-input>
                    </div>
                    <div slot="img" class="com-img">
                      <div class="img-item" v-for="(arr,index) in uploadImg" :key="index">
                        <el-image
                          style="width:80px; height:80px"
                          :src="arr"
                          :preview-src-list="[arr]">
                        </el-image>
                        <p @click="deleteImage(index)">x</p>
                      </div>
                    </div>
                    <div class="self-item2">
                      <el-upload
                        :multiple="true"
                        action="none"
                        :before-upload="handleBeforeUpload"
                        :on-exceed="handleExceed"
                        :show-file-list="false"
                        accept=".png,.jpg,.gif"
                        :on-change="imgSaveToUrl"
                      >
                        <p class="el-icon-picture-outline"></p>
                      </el-upload>
                      <el-button type="success" size="small" @click="commentClick" id="scroll-comment">发送</el-button>
                    </div>
                  </div>

                </div>
                <div class="cl-xg-wc" v-if="form.stateCode!==5">
                  <el-button v-if="form.stateCode===0" v-permission="'question_approve'" type="primary" size="small"
                             @click="figureOut(form)">
                    审核
                  </el-button>
                  <el-button v-if="form.stateCode===1" v-permission="'question_publish'" type="primary" size="small"
                             @click="figureOut(form)">
                    发布
                  </el-button>
                  <el-button v-if="form.stateCode===2" disabled type="primary" size="small" @click="figureOut(form)">
                    {{ time }}
                  </el-button>
                  <el-button v-if="form.stateCode===3" v-permission="'question_processor_on'" type="primary"
                             size="small" @click="figureOut(form)">
                    处理
                  </el-button>
                  <el-button v-if="form.stateCode===4" v-permission="'question_processor_ok'" type="primary"
                             size="small" @click="figureOut(form)">
                    完成
                  </el-button>
                  <el-button v-permission="'question_up'" size="small" v-if="form.stateCode < 3"
                             @click="questionRecordUpdate">
                    修改
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="24">
        <div class="recommendation">
          <user-field-map :field-color="form.questionLevel.color"></user-field-map>
          <!--         相关推荐 -->
          <!--          <el-card class="correlation">-->
          <!--            <div slot="header">-->
          <!--              <h4 class="ele-text-primary">-->
          <!--                相关推荐-->
          <!--              </h4>-->
          <!--            </div>-->
          <!--            <Recommend-->
          <!--              class="recommend-style"-->
          <!--              v-for="(arr,index) in recommendData"-->
          <!--              :key="index"-->
          <!--              :recommend-data="arr"-->
          <!--            ></Recommend>-->
          <!--          </el-card>-->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userFieldMap from "@/components/user-field-map.vue";
import Speak from "@/components/speak";
import Recommend from '@/components/recommend';
import {getQuestionRecordDetail} from "@/api/questionRecord";
import {PostProductImageUpload} from "@/api/productImages";
import {postCommentSave, getCommentList} from "@/api/comment";
import {patchQuestionRecordProcess, settingQuestionRecordSolution} from "@/api/questionRecord";
import {formatTime} from '@/filters';
import {mapState} from 'vuex';
import dayjs from "dayjs";
import {getSolutionList, getSolution} from "@/api/solution";
import TableProgram from '@/components/tableProgram';

export default {
  components: {
    userFieldMap,
    Speak,
    Recommend,
    TableProgram
  },
  // props:{
  //   // 允许上传的文件类型, 例如["pdf"]
  //   fileType: {
  //     type: Array,
  //     default: () => ["jpg","png","gif"]
  //   },
  // },
  data() {
    return {
      suggestContent: '',
      fileType: ["jpg", "png", "gif"],
      //引用方案
      formObjData: null,
      showProgram: false,
      solutionId: '',
      solutions: new Array(),
      remarks: '',
      uploadImg: [],
      formData: [],
      // 详情数据
      form: null,
      say: '',
      sayOptions: [],
      commentData: [],
      // recommendData: [
      //   {
      //     img: 'https://cdn.uviewui.com/uview/album/4.jpg',
      //     season: '#2022年第一季',
      //     cropName: '水稻',
      //     area: '湖州市吴兴区',
      //     fieldName: '即富大厦',
      //     name: '耘耘',
      //     time: '2021.03.02',
      //     num: 2
      //   },
      //   {
      //     img: 'https://cdn.uviewui.com/uview/album/5.jpg',
      //     season: '#2022年第一季',
      //     cropName: '小麦',
      //     area: '湖州市吴兴区',
      //     fieldName: '即富大厦',
      //     name: '睿睿',
      //     time: '2021.03.06',
      //     num: 2
      //   },
      //   {
      //     img: 'https://cdn.uviewui.com/uview/album/6.jpg',
      //     season: '#2022年第一季',
      //     cropName: '大豆',
      //     area: '湖州市吴兴区',
      //     fieldName: '即富大厦',
      //     name: '乡乡',
      //     time: '2022.01.08',
      //     num: '99+'
      //   },
      // ],
      num: 0,
      autofocus: true,

      //倒计时
      time: '',
      timer: null
    };
  },
  created() {
    this.getCommentList();
    this.getActivityList();
    this.getSolutionList();
  },
  updated() {
    this.toScrollBoottom();
  },
  methods: {
    //发送实际方案
    async toActualPlan() {
      const id = new Number(this.$route.query.id);
      const s = this.filterSolution();
      await settingQuestionRecordSolution(id, {...s})
      this.form.solutionB = {...s.solution};
      this.$message.success('添加实际方案成功');
    },
    //过滤方案数据
    filterSolution() {
      const r = this.formObjData;
      const s = [];
      if (r) {
        const p = this.formObjData.products;
        for (let i = 0; i < p.length; i++) {
          s.push({
            productId: p[i].productId,
            amount: 100
          })
        }
        return {
          suggestContent: this.suggestContent,
          solution: {
            type: 2,
            relateId: this.$route.query.id,
            name: r.name,
            instruction: r.instruction,
            cropId: r.cropId,
            jobDescription: r.jobDescription,
            warnDescription: r.warnDescription,
            products: [...s]
          }
        }
      }
    },
    updateScroll() {
      this.toScrollBoottom();
    },
    //显示方案
    changeProgram() {
      this.showProgram = true;
    },
    async getSolutionList() {
      const {
        data: {data}
      } = await getSolutionList();
      this.solutions = data;
    },
    //选择方案
    async changeSolution(id) {
      const {data} = await getSolution(id);
      this.formObjData = data;
//       let products = '';
//       for(let i=0;i<data.products.length;i++){
//         products +=`${i+'、'+data.products[i].name +data.products[i].meterage+'/'+data.products[i].unit} `
//       }
//       const obj = `方案名称: ${data.name}
// 方案说明: ${data.instruction}
// 适用作物: ${data.cropName}
// 防治用药: ${products}
// 作业方法: ${data.jobDescription}
// 注意事项: ${data.warnDescription}`;
//       this.remarks=obj;
    },
    toScrollBoottom() {
      this.$nextTick(() => {
        let boxMe = this.$el.querySelector('#scrollView');
        boxMe.scrollTop = boxMe.scrollHeight;
      })
    },
    async getActivityList() {
      this.sayOptions = [];
      const {data} = await getQuestionRecordDetail(this.$route.query.id);
      for (let r in data.activitys) {
        this.sayOptions.push({
          img: data.activitys[r].user.avatar,
          no: data.activitys[r].user.no,
          time: data.activitys[r].createAt,
          content: data.activitys[r].event,
          name: data.activitys[r].user.name
        })
      }
      this.form = data;
      await this.getCommentList(data.no);
      this.countDown(data.activitys);
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
        if (this.formData.length > 2) {
          return;
        }
        this.formData.push(file);
        this.$message.success('上传成功');
      }
      return false;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择1个文件，本次选择了${files.length} 个文件，共选择了${fileList.length + files.length} 个文件`);
    },
    //生成图片
    imgSaveToUrl(file) {
      this.num++;
      if (this.uploadImg.length > 2 && this.num === 1) {
        this.$message.info('上传图片最多限制三张^.^');
        return;
      }
      let URL = window.URL || window.webkitURL;
      if (this.num === 1) {
        this.uploadImg.push(URL.createObjectURL(file.raw));
      }
      if (this.num === 2) {
        this.num = 0;
      }
    },
    async getCommentList(no) {
      this.commentData = [];
      const {data} = await getCommentList(no);
      const myData = data.data;
      for (let r of myData) {
        this.commentData.push({
          img: r.user.avatar,
          no: r.user.no,
          time: r.createAt,
          content: r.content,
          album: r.album,
          name: r.user.name
        })
      }
    },
    async commentClick() {
      if (this.say.trim() === '') {
        this.$message.warning('请输入评论...');
        return;
      }
      const images = [];
      const backImages = [];
      if (this.uploadImg.length > 0) {
        for (let file in this.formData) {
          let fromData = new FormData();
          fromData.append('file', this.formData[file]);
          const {data} = await PostProductImageUpload(fromData);
          images.push({path: data[0].url, thumbPath: data[1].url});
          backImages.push({path: data[0].name, thumbPath: data[1].name})
        }
      }
      await postCommentSave({
        relateId: this.form.no,
        content: this.say,
        album: backImages
      })
      const {avatar, no, name} = this.infoMe;
      this.commentData.push({
        img: avatar,
        no: no,
        time: formatTime(new Date()),
        content: this.say,
        album: images,
        name: name
      })
      this.uploadImg = [];
      this.formData = [];
      this.say = '';
      // this.$message.success('评论成功');
    },
    deleteImage(index) {
      this.uploadImg.splice(index, 1);
      this.formData.splice(index, 1);
    },
    //修改问题系统
    questionRecordUpdate() {
      this.$router.push({
        path: `/question/update-record`,
        query: {
          id: this.form.id,
          fieldId: this.form.field.id,
          customerId: this.form.userCustomer.id
        }
      })
    },
    //审核 1 发布 2  处理 4 完成 5 操作
    async figureOut(form) {
      const {avatar, no, name} = this.infoMe;
      if (form.activitys.length === 3) return;

      const state = form.stateCode === 0 ? 1 :
          form.stateCode === 1 ? 2 :
          form.stateCode === 3 ? 4 : 5
      const stateName = form.stateCode === 0 ? '审核' :
          form.stateCode === 1 ? '发布' :
          form.stateCode === 3 ? '处理': '完成';
      await patchQuestionRecordProcess(form.id, {eventCode: state});
      this.form.stateCode = state;
      this.$message.success('操作成功');
      const say = {
        img: avatar,
        no: no,
        time: formatTime(new Date()),
        content: stateName,
        name: name,
      }
      this.sayOptions.push({...say})
      form.activitys.push({...say});
      this.countDown(form.activitys);
    },
    countDown(activity) {
      // 倒计时
      if (activity.length !== 3) return;
      const endTime = dayjs(activity[2].createAt).add(2, "hour");
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        const seconds = endTime.diff(dayjs(new Date()), "seconds");
        if (seconds <= 0) {
          clearInterval(this.timer);
          this.time = "发布完成";
          return;
        }
        const second = seconds % 60;
        const minutes = (seconds - second) / 60;
        const minute = minutes % 60;
        const hours = (minutes - minute) / 60;
        const hour = hours % 24;
        const formatNumber = n => {
          n = n.toString();
          return n[1] ? n : "0" + n;
        };
        const time = [hour, minute, second].map(formatNumber).join(":");
        this.time = "距发布：" + time;
      }, 1000);
    },
  },
  computed: {
    ...mapState(['infoMe'])
  }
};
</script>

<style lang="scss" scoped>
@import "index";
</style>



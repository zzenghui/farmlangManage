// 添加预约/订单
<template>
  <div class="ele-body" v-if="row">
    <el-row :gutter="10">
      <el-col :lg="16" :md="24">
        <el-card shadow="never" class="never-card">
          <div slot="header" class="header">
            <h4 class="ele-text-primary">
              {{ row.serviceName }}
            </h4>
            <p
              class="ele-text-primary"
              v-for="(obj, index) in row.cycles"
              :key="index"
            >
              {{ obj }}
            </p>
            <p>{{ row.no }}</p>
            <i
              v-if="row.activity"
              :class="STATE[row.activity.stateCode].icon"
            ></i>
          </div>
          <p class="p-me">
            <span>联系人</span>
            <span>{{ row.userName }}</span>
          </p>
          <p class="p-me">
            <span>联系方式</span>
            <span>{{ row.userPhone }}</span>
          </p>
          <p class="p-me">
            <span>预约日期</span>
            <span>{{ row.reserveDate }}</span>
          </p>
          <p class="p-me">
            <span>服务内容</span>
            <span>{{ row.content }}</span>
          </p>
          <!-- 活动 -->
          <Speak
            class="speak"
            :position-time="'right'"
            v-for="(arr, index) in sayOptions"
            :key="index"
            :say-data="arr"
          >
            <div slot="to" class="ele-cell">
              <p>
                <img v-if="arr.toUserAvatar" :src="arr.toUserAvatar" alt="" />
              </p>
              <p>{{ arr.toUserNo }}</p>
            </div>
          </Speak>
          <hr class="hr" />
          <div class="comment-style" id="scrollView">
            <!-- 处理记录 -->
            <Speak
              class="speak"
              :position-time="'bottom'"
              v-for="(arr, index) in commentData"
              :key="index"
              :say-data="arr"
            >
              <div slot="img" class="com-img" v-if="arr.album.length > 0">
                <el-image
                  style="width:80px; height:80px"
                  v-for="(r, index) in arr.album"
                  :key="index"
                  :src="r.thumbPath"
                  :preview-src-list="[r.path]"
                >
                </el-image>
              </div>
              <div slot="reply">
                <el-link
                  v-if="
                    departmentRole === DEPARTMENT_ROLE.USERINSIDE &&
                      row.activity &&
                      [5, 6].includes(row.activity.stateCode)
                  "
                  @click="showComment(arr)"
                  type="primary"
                  icon="el-icon-edit"
                  :underline="false"
                  >编辑处理记录
                </el-link>
              </div>
            </Speak>
            <!-- 处理记录输入 -->
            <div
              class="self"
              v-if="
                departmentRole === DEPARTMENT_ROLE.USERINSIDE &&
                  row.activity &&
                  [5, 6].includes(row.activity.stateCode) &&
                  isComment
              "
            >
              <div class="self-item1">
                <img :src="infoMe.avatar" alt="" />
                <div>
                  <el-date-picker
                    class="date"
                    v-model="extendStr"
                    type="datetime"
                    placeholder="请选择处理时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                    >
                  </el-date-picker>
                  <el-input
                    type="textarea"
                    resize="none"
                    :rows="6"
                    placeholder="请输入处理记录"
                    v-model="say"
                    autofocus
                    maxlength="200"
                    show-word-limit
                    clearable
                    @keyup.enter.native="commentClick"
                  ></el-input>
                </div>
              </div>
              <div slot="img" class="com-img">
                <div
                  class="img-item"
                  v-for="(arr, index) in uploadImg"
                  :key="index"
                >
                  <el-image
                    style="width:80px; height:80px"
                    :src="arr"
                    :preview-src-list="[arr]"
                  >
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
                >
                  <!-- :on-change="imgSaveToUrl" -->
                  <p class="el-icon-picture-outline"></p>
                </el-upload>
                <el-button type="primary" size="small" @click="commentClick"
                  >发送</el-button
                >
              </div>
            </div>
            <!-- 操作按钮 -->
            <div class="action-o" v-if="row.activity">
              <!-- 管理员 -->
              <template v-if="departmentRole === DEPARTMENT_ROLE.ADMIN">
                <el-button
                  v-if="[0, 1].includes(row.activity.stateCode)"
                  @click="handleState(1, 2, row)"
                  type="primary"
                  size="small"
                  >派单
                </el-button>
                <el-button
                  v-if="row.activity.stateCode === 6"
                  @click="handleState(0, 7, row)"
                  type="primary"
                  size="small"
                  >通过
                </el-button>
              </template>
              <!-- 主管 -->
              <template v-else-if="departmentRole === DEPARTMENT_ROLE.DIRECTOR">
                <template v-if="[2, 4].includes(row.activity.stateCode)">
                  <el-button
                    @click="handleState(1, 3, row)"
                    type="primary"
                    size="small"
                    >派单
                  </el-button>
                  <el-button
                    @click="handleState(0, 1, row)"
                    type="primary"
                    size="small"
                    >退回
                  </el-button>
                </template>
                <el-button
                  v-if="row.activity.stateCode === 3"
                  @click="handleState(1, 3, row)"
                  type="primary"
                  size="small"
                  >重新派单
                </el-button>
                <el-button
                  v-if="row.activity.stateCode === 6"
                  @click="handleState(0, 7, row)"
                  type="primary"
                  size="small"
                  >通过
                </el-button>
              </template>
              <!-- 员工 -->
              <template v-else>
                <template v-if="row.activity.stateCode === 3">
                  <el-button
                    @click="handleState(0, 5, row)"
                    type="primary"
                    size="small"
                    >开始处理
                  </el-button>
                  <el-button
                    @click="handleState(0, 4, row)"
                    type="primary"
                    size="small"
                    >退回
                  </el-button>
                </template>
                <el-button
                  v-if="row.activity.stateCode === 5"
                  @click="handleState(0, 6, row)"
                  type="primary"
                  size="small"
                  >处理完成
                </el-button>
              </template>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="24">
        <div class="recommendation">
          <user-field-map></user-field-map>
          <!--         相关推荐 -->
          <!--          <el-card class="correlation">-->
          <!--          <div slot="header">-->
          <!--            <h4 class="ele-text-primary">-->
          <!--              相关推荐-->
          <!--            </h4>-->
          <!--          </div>-->
          <!--          <Recommend-->
          <!--            class="recommend-style"-->
          <!--            v-for="(arr,index) in recommendData"-->
          <!--            :key="index"-->
          <!--            :recommend-data="arr"-->
          <!--          ></Recommend>-->
          <!--          </el-card>-->
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :close-on-click-modal="false"
      title="操作"
      :visible.sync="isShow"
      width="400px"
      @closed="form = {}"
      :destroy-on-close="true"
      :lock-scroll="false"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent
      >
        <el-form-item class="form-item" label="员工:" prop="id">
          <el-select
            style="width: 100%"
            v-model="form.id"
            filterable
            placeholder="请选择员工"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="sendOrder">保存 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userFieldMap from "@/components/user-field-map.vue";
import Speak from "@/components/speak";
import Recommend from "@/components/recommend";
import { getOrderDetail, getActivityList, setOrderState } from "@/api/order";
import { PostProductImageUpload } from "@/api/productImages";
import { postCommentSave, getCommentList } from "@/api/comment";
import { getDepartmentUserList } from "@/api/department";
import { getUserList } from "@/api/employees";
import { mapState } from "vuex";
import setting from "@/config/setting";
export default {
  components: {
    userFieldMap,
    Speak,
    Recommend
  },
  data() {
    return {
      // 详情数据
      row: {},
      // 订单职位角色
      DEPARTMENT_ROLE: setting.DEPARTMENT_ROLE,
      userList: [],
      isShow: false,
      form: {},
      rules: {
        id: [
          {
            required: true,
            message: "请选择员工",
            trigger: "blur"
          }
        ]
      },

      // 处理记录输入
      isComment: false,
      say: "",
      extendStr: "",
      fileType: ["jpg", "png", "gif"],
      uploadedImg: [],
      uploadImg: [],
      formData: [],

      sayOptions: [],
      commentData: [],
      recommendData: [],
      num: 0,
      // no: null,
      STATE: {
        0: { name: "待派单", activity: "创建", icon: "el-icon--daipaidan" },
        1: {
          name: "待派单",
          activity: "退回",
          icon: "el-icon--daipaidan"
        },
        2: {
          name: "待主管派单",
          activity: "派单至主管",
          icon: "el-icon--daizhuguanpaidan"
        },
        3: {
          name: "待处理",
          activity: "派单至员工",
          icon: "el-icon--daichuli1"
        },
        4: {
          name: "待主管派单",
          activity: "退回",
          icon: "el-icon--daizhuguanpaidan"
        },
        5: {
          name: "处理中",
          activity: "开始处理",
          icon: "el-icon--chulizhong"
        },
        6: {
          name: "已处理",
          activity: "处理完成",
          icon: "el-icon--yichuli"
        },
        7: { name: "已完成", activity: "审核通过", icon: "el-icon--yiwancheng" }
      }
    };
  },
  computed: {
    ...mapState({
      infoMe: state => state.user.user.user,
      departmentRole: state => state.user.user.departmentRole,
      deptId: state => state.user.user.user.dept_Id
    })
  },
  created() {
    this.getRecommendDetail();
    this.getUserList();
  },
  methods: {
    // 获取派单列表
    async getUserList() {
      if (this.departmentRole === this.DEPARTMENT_ROLE.ADMIN) {
        // 获取主管列表
        const { data } = await getDepartmentUserList({
          isOnlyDirector: true
        });
        let userList = [];
        data.forEach(department => {
          department.userInsides.forEach(user => {
            userList.push(user);
          });
        });
        this.userList = userList;
      } else if (this.departmentRole === this.DEPARTMENT_ROLE.DIRECTOR) {
        // 获取员工列表
        const {
          data: { data }
        } = await getUserList({
          deptId: this.deptId,
          isOnlyNormal: true
        });
        this.userList = data;
      }
    },
    // 通用处理方法
    handleState(type, targetStateCode, row) {
      row.targetStateCode = targetStateCode;
      this.row = row;
      // 1 打开弹窗 0 不打开
      if (type === 0) {
        this.setOrderState();
      } else if (type === 1) {
        this.isShow = true;
        console.log(this.row);
      }
    },
    // 派单
    sendOrder() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        this.setOrderState(this.form.id);
        this.isShow = false;
      });
    },
    // 设置订单状态
    async setOrderState(toUserId) {
      await setOrderState(this.row.no, {
        stateCode: this.row.targetStateCode,
        toUserId
      });
      this.$message.success("操作成功");
      this.getRecommendDetail();
      // this.getActivityList(this.row.no);
    },
    async getRecommendDetail() {
      const { data } = await getOrderDetail(this.$route.query.id);
      this.row = data;
      this.getCommentList(data.no);
      this.getActivityList(data.no);
    },
    async getCommentList(no) {
      this.commentData = [];
      const { data } = await getCommentList(no);
      const myData = data.data;
      this.isComment = !myData.length;
      for (let r of myData) {
        this.commentData.push({
          img: r.user.avatar,
          no: r.user.no,
          time: r.extendStr,
          content: r.content,
          album: r.album,
          name: r.user.name
        });
      }
    },
    async getActivityList(no) {
      this.sayOptions = [];
      const { data } = await getActivityList(no);
      for (let r in data) {
        const content = this.STATE[data[r].stateCode].activity;
        this.sayOptions.push({
          img: data[r].userAvatar,
          no: data[r].userNo,
          time: data[r].createAt,
          content: content,
          name: data[r].userName,
          toUserNo: data[r].toUserNo,
          toUserAvatar: data[r].toUserAvatar
        });
      }
    },
    showComment(item) {
      console.log(item);
      this.extendStr = item.time;
      this.say = item.content;
      this.uploadedImg = [...item.album];
      item.album.forEach(e => {
        this.uploadImg.push(e.path);
      });
      this.isComment = true;
    },
    // 上传前校检格式和大小
    async handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some(type => {
          return fileExtension && fileExtension.indexOf(type) > -1;
        });
        if (!isTypeOk) {
          this.$message.warning(
            `文件格式不正确，请上传${this.fileType.join("/")}格式文件！`
          );
          return false;
        }
        // if (this.formData.length > 2) {
        //   return;
        // }
        if (this.uploadImg.length > 2) {
          this.$message.info("上传图片最多限制三张^.^");
          return;
        }
        let URL = window.URL || window.webkitURL;
        this.uploadImg.push(URL.createObjectURL(file));
        this.formData.push(file);
        this.$message.success("上传成功");
      }
      return false;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择1个文件，本次选择了${
          files.length
        } 个文件，共选择了${fileList.length + files.length} 个文件`
      );
    },
    //生成图片
    imgSaveToUrl(file) {
      this.num++;
      if (this.uploadImg.length > 2 && this.num === 1) {
        this.$message.info("上传图片最多限制三张^.^");
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
    async commentClick() {
      if (!this.extendStr) {
        this.$message.warning("请选择处理时间");
        return;
      }
      if (!this.say) {
        this.$message.warning("请输入处理记录");
        return;
      }
      const images = [];
      let backImages = [];
      if (this.uploadImg.length > 0) {
        for (let file in this.formData) {
          let fromData = new FormData();
          fromData.append("file", this.formData[file]);
          const { data } = await PostProductImageUpload(fromData);
          images.push({ path: data[0].url, thumbPath: data[1].url });
          backImages.push({ path: data[0].name, thumbPath: data[1].name });
        }
        backImages = [...this.uploadedImg, ...backImages];
      }
      await postCommentSave({
        relateId: this.row.no,
        extendStr: this.extendStr,
        content: this.say,
        album: backImages
      });
      console.log(this.uploadImg);
      console.log(this.formData);
      console.log(backImages);
      this.getCommentList(this.row.no);
      this.uploadedImg = [];
      this.uploadImg = [];
      this.formData = [];
      this.say = "";
      this.extendStr = "";
      this.isComment = false;
      this.$message.success("操作成功");
    },
    deleteImage(index) {
      if (this.uploadedImg[index]) {
        this.uploadedImg.splice(index, 1);
      }
      this.uploadImg.splice(index, 1);
      this.formData.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "index";
</style>

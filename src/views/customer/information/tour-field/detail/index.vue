// 巡田日志详情
<template>
  <div class="ele-body">
    <el-row :gutter="10">
      <el-col :lg="16" :md="24">
        <el-card shadow="never" class="never-card">
          <div slot="header" class="header">
            <h4 class="ele-text-primary">
              {{ record.name }}
            </h4>
            <p
              class="ele-text-primary"
              v-for="item in record.cycles"
              :key="item.id"
            >
              #{{ item.name }}
            </p>
            <p>{{ record.no }}</p>
          </div>

          <archive v-if="Object.keys(record).length" :record="record" />

          <!-- <el-form
            :model="form"
            ref="editForm"
            label-width="100px"
            @submit.native.prevent
          >
            <el-form-item
              v-for="item in schema"
              :label="item.title"
              :prop="item.prop"
              :key="item.id"
            >
              <template>
                <p v-if="item.type != formType.RelateUserInside">
                  {{ item.value }}
                </p>
                <template v-if="item.type == formType.RelateUserInside">
                  <p v-if="item.data">{{ item.data.no }}</p>
                </template>
                <template v-if="item.type == formType.RelateProduct">
                  <div v-for="(val, index) in item.data">
                    <section class="solution-style">
                      <label>产品名称</label>
                      <span>{{ val.name }}</span>
                      <label>规格</label>
                      <span>{{ val.amount }}</span>
                      <label>单位</label>
                      <span>{{ val.unit }}</span>
                    </section>
                  </div>
                </template>
                <div
                  class="upload-product upload-file"
                  v-if="item.type == formType.Album"
                >
                  <el-image
                    class="img-father"
                    v-for="(r, index) in item.albumItems"
                    :key="index"
                    :src="r.thumbPath"
                    :preview-src-list="[r.path]"
                  >
                  </el-image>
                </div>
              </template>
            </el-form-item>
          </el-form>
          <template v-if="orderRelationNoStrs">
            <el-form>
              <el-form-item label="关联订单和预约">
                <template>
                  <p>{{ orderRelationNoStrs }}</p>
                </template>
              </el-form-item>
            </el-form>
          </template>
          <template v-if="questionRelationNoStrs">
            <el-form>
              <el-form-item label="关联问题记录">
                <template>
                  <p>{{ questionRelationNoStrs }}</p>
                </template>
              </el-form-item>
            </el-form>
          </template> -->

          <Speak
            class="speak"
            :position-time="'right'"
            v-for="(arr, index) in sayOptions"
            :key="index"
            :say-data="arr"
          >
          </Speak>
          <hr class="hr" />
          <div class="comment-style">
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
              <span
                v-permission="'archive_common'"
                slot="reply"
                class="ele-text-primary"
                @click="showReply(index)"
              >
                <i class="el-icon-chat-line-square"></i>
                {{ !arr.isReply ? "回复" : "收起" }}</span
              >
              <div v-show="arr.isReply" class="self">
                <div class="self-item1">
                  <img :src="infoMe.avatar" alt="" />
                  <el-input
                    type="text"
                    placeholder="请输入"
                    v-model="say"
                    autofocus
                  ></el-input>
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
                    :on-change="imgSaveToUrl"
                  >
                    <p class="el-icon-picture-outline"></p>
                  </el-upload>
                  <el-button type="primary" size="small" @click="commentClick"
                    >发送
                  </el-button>
                </div>
              </div>
              <Speak
                style="padding:0 30px;"
                class="speak"
                :position-time="'bottom'"
                v-for="(arr2, index2) in arr.replys"
                :key="index2"
                :say-data="arr2"
              >
                <div slot="img" class="com-img" v-if="arr2.album.length > 0">
                  <el-image
                    style="width:80px; height:80px"
                    v-for="(r, i) in arr2.album"
                    :key="i"
                    :src="r.thumbPath"
                    :preview-src-list="[r.path]"
                  >
                  </el-image>
                </div>
              </Speak>
            </Speak>
          </div>
          <div class="btns">
            <el-button
              v-if="record.state == 0"
              v-permission="'archive_approve'"
              type="primary"
              @click="approveArchiveRecord"
              >审核</el-button
            >
            <el-button
              v-if="record.state == 1"
              v-permission="'archive_publish'"
              type="primary"
              @click="publishArchiveRecord"
              >发布</el-button
            >
            <span v-if="record.state == 2" class="ele-text-primary">
              {{ time }}
            </span>
            <el-button
              v-if="record.state != 3"
              v-permission="'archive_up'"
              @click="toEdit"
              >修改</el-button
            >
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
import archive from "./templates/archive.vue";
import userFieldMap from "@/components/user-field-map.vue";
import Speak from "@/components/speak";
import Recommend from "@/components/recommend";
import {
  getArchive,
  getArchiveRecord,
  approveArchiveRecord,
  publishArchiveRecord
} from "@/api/archive";
import { PostProductImageUpload } from "@/api/productImages";
import { postCommentSave, getCommentList } from "@/api/comment";
import { formType, pickerOptions } from "../constant";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  components: {
    archive,
    userFieldMap,
    Speak,
    Recommend
  },
  props: {
    // 允许上传的文件类型, 例如["pdf"]
    fileType: {
      type: Array,
      default: () => ["jpg", "png", "gif"]
    }
  },
  data() {
    return {
      formType,
      record: {},
      // 编辑表单数据
      form: {},
      schema: [],

      uploadImg: [],
      formData: [],
      say: "",
      sayOptions: [],
      commentData: [],
      parentId: "",
      num: 0,

      //倒计时
      timer: null,
      time: "",
      orderRelationNoStrs: null,
      questionRelationNoStrs: null
    };
  },
  created() {
    // this.getArchive();
    this.getArchiveRecord();
  },
  computed: {
    ...mapState(["infoMe"])
  },
  methods: {
    async getArchiveRecord() {
      const { id } = this.$route.query;
      const { data } = await getArchiveRecord(id);
      const record = data;
      this.record = record;
      const schema = record.schema;
      const orderRelations = data.orderRelations;
      const questionRelations = data.questionRelations;

      if (orderRelations) {
        const arr = orderRelations.map(r => r.no);
        this.orderRelationNoStrs = arr.join(",");
      }

      if (questionRelations) {
        const arr = questionRelations.map(r => r.no);
        this.questionRelationNoStrs = arr.join(",");
      }

      schema.forEach(e => {
        if (e.type == formType.Select) {
          e.value = e.items.find(item => item.id == e.value)?.name;
        }
      });
      this.schema = schema;
      const { activity, no } = record;
      this.getSayOptions(activity);
      this.getCommentList(no);
      this.countDown(activity);
    },
    async approveArchiveRecord() {
      await approveArchiveRecord(this.record.no);
      this.$message.success("操作成功");
      this.getArchiveRecord();
    },
    async publishArchiveRecord() {
      await publishArchiveRecord(this.record.no);
      this.$message.success("操作成功");
      this.getArchiveRecord();
    },
    async getSayOptions(activity) {
      this.sayOptions = [];
      activity.forEach(e => {
        this.sayOptions.push({
          img: e.user.avatar,
          no: e.user.no,
          time: e.createAt,
          content: e.eventCode,
          name: e.user.name
        });
      });
    },
    async getCommentList(no = this.record.no) {
      this.commentData = [];
      const { data } = await getCommentList(no);
      const myData = data.data;
      for (let r of myData) {
        this.commentData.push({
          id: r.id,
          img: r.user.avatar,
          no: r.user.no,
          time: r.createAt,
          content: r.content,
          album: r.album,
          name: r.user.name,
          isReply: false,
          replys: r.replys
        });
      }
    },
    showReply(index) {
      if (this.commentData[index].isReply) {
        this.commentData[index].isReply = false;
      } else {
        this.commentData = this.commentData.map(e => {
          e.isReply = false;
          return e;
        });
        this.commentData[index].isReply = true;
        this.parentId = this.commentData[index].id;
      }
    },
    countDown(activity) {
      // 倒计时
      if (activity.length != 3) return;
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
    // async getArchive() {
    //   const { data } = await getArchive(this.$route.query.archiveId);
    //   const record = data;
    //   this.record = record;
    //   const schema = record.schema;
    //   let form = {};
    //   schema.forEach(e => {
    //     e.prop = `${e.type}-${String(e.id)}`;
    //     if (e.type == formType.Album) {
    //       form[e.prop] = e.albumItems || [];
    //     } else if (e.type == formType.Select) {
    //       form[e.prop] = e.items[0].id || "";
    //     } else {
    //       form[e.prop] = e.value || "";
    //     }
    //   });
    //   this.schema = schema;
    //   this.form = form;
    // },
    // save() {
    //   this.$refs["editForm"].validate(async valid => {
    //     if (valid) {
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    async commentClick() {
      if (this.say.trim() === "") {
        this.$message.warning("请输入评论...");
        return;
      }
      const images = [];
      if (this.uploadImg.length > 0) {
        for (let file in this.formData) {
          let fromData = new FormData();
          fromData.append("file", this.formData[file]);
          const { data } = await PostProductImageUpload(fromData);
          images.push({
            path: data[0].url,
            thumbPath: data[1].url
          });
        }
      }
      await postCommentSave({
        relateId: this.record.no,
        parentId: this.parentId,
        content: this.say,
        album: images
      });

      this.uploadImg = [];
      this.formData = [];
      this.say = "";
      this.$message.success("评论成功");
      await this.getCommentList();
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
        if (this.formData.length > 2) {
          return;
        }
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
    deleteImage(index) {
      this.uploadImg.splice(index, 1);
      this.formData.splice(index, 1);
    },
    toEdit() {
      const query = this.$route.query;
      this.$router.push({
        path: "/customer/information/tour-field",
        query: {
          ...query,
          archiveId: this.record.archiveId
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// ::v-deep .el-input__inner {
//   border: none;
// }
.never-card {
  position: relative;
  min-height: calc(100vh - 100px);
  border-top: #fdb933 10px solid;

  .header {
    display: flex;

    p {
      margin-left: 10px;
      align-self: end;
    }
  }
}

.upload-product {
  max-height: 160px;
  min-height: 60px;
  display: flex;
  flex-wrap: wrap;

  .img-father {
    width: 138px;
    height: 90px;
    margin: 5px;
    overflow: hidden;
    position: relative;

    .product-p {
      color: white;
      width: 12px;
      height: 12px;
      font-size: 12px;
      border-radius: 50%;
      text-align: center;
      line-height: 11px;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 10;
      cursor: pointer;
      background-color: red;
    }

    .main-figure {
      width: 138px;
      height: 90px;
      color: white;
      font-size: 16px;
      text-align: center;
      line-height: 90px;
      transition: 0.6s;
      top: -90px;
      position: absolute;
      background: rgba(0, 0, 0, 0.6);

      span {
        cursor: pointer;
      }
    }

    .product-img {
      width: 138px;
      height: 90px;
    }

    &:hover .main-figure {
      top: 0;
      left: 0;
    }
  }

  .product-item {
    width: 138px;
    height: 90px;
    margin: 3px;
    border: #2b6f0b 1px solid;
    background-color: #f3f6f2;

    .item-button {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 20px;
      text-align: center;
      cursor: pointer;
      line-height: 24px;
      border: 0;
      color: white;
      margin: 33px 57px;
      background-color: #adc7a0;
    }
  }
}

.upload-file {
  max-height: 500px;
  min-height: 66px;
}

.hr {
  height: 1px;
  border: 0;
  margin-top: 20px;
  background-color: #d8d8d8;
}

.comment-style {
  max-height: 500px;
  overflow-y: scroll;
}

.speak {
  margin-top: 20px;

  .com-img {
    margin-left: 35px;
    margin-top: 5px;

    .el-image {
      width: 80px;
      height: 80px;
      margin-left: 6px;
    }

    .el-image :nth-child(1) {
      margin-left: 0;
    }
  }
}

.self {
  margin-top: 20px;

  .com-img {
    margin-top: 10px;
    margin-left: 35px;
    margin-bottom: 10px;
    display: flex;

    .img-item {
      height: 80px;
      width: 80px;
      position: relative;
      margin-left: 5px;

      img {
        width: 80px;
        height: 80px;
      }

      p {
        top: 0;
        right: 0;
        width: 10px;
        height: 10px;
        color: white;
        line-height: 10px;
        font-size: 12px;
        border-radius: 50%;
        cursor: pointer;
        text-align: center;
        background-color: red;
        position: absolute;
      }
    }

    .img-item:nth-child(1) {
      margin-left: 0;
    }
  }

  .self-item1 {
    display: flex;
    align-items: center;
    width: 530px;

    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }

    .el-input {
      margin-left: 10px;
    }
  }

  .self-item2 {
    width: 500px;
    display: flex;
    align-items: center;
    margin-top: 10px;
    justify-content: space-between;
    margin-left: 30px;

    p {
      cursor: pointer;
      color: #66974d;
      font-size: 30px;
    }

    .el-button {
      width: 56px;
      height: 28px;
      padding: 0;
    }
  }
}

.btns {
  margin-top: 20px;
  display: flex;
  // justify-content: end;
  align-items: center;

  span {
    margin-right: 20px;
  }
}

.solution-style {
  label,
  span {
    display: inline-block;
  }

  label {
    margin-left: 10px;
    &:first-child {
      margin-left: 0;
    }
  }

  span {
    margin-left: 10px;
  }
}
</style>

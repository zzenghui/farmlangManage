// 添加巡田日志
<template>
  <div class="ele-body">
    <el-row :gutter="10">
      <el-col :lg="16" :md="24">
        <el-card shadow="never" :title="archive.name">
          <div slot="header">
            <h4 class="ele-text-primary">
              {{ archive.name }}
            </h4>
          </div>
          <el-form
            :model="form"
            ref="editForm"
            label-width="120px"
            @submit.native.prevent
          >
            <!-- :rules="rules" -->
            <el-form-item
              v-for="item in schema"
              :label="item.title"
              :prop="item.prop"
              :rules="item.rules"
              :key="item.id"
            >
              <el-input
                v-if="item.type == formType.Text"
                v-model="form[item.prop]"
                :placeholder="item.placeholder"
                clearable
              />
              <el-input-number
                v-if="item.type == formType.TextNumber"
                v-model.number="form[item.prop]"
                :controls="false"
              ></el-input-number>
              <!-- <el-input
                v-if="item.type == formType.TextNumber"
                v-model.number="form[item.prop]"
                pattern="\d*"
                :placeholder="item.placeholder"
                clearable
              /> -->
              <el-input
                v-if="item.type == formType.TextArea"
                v-model="form[item.prop]"
                :placeholder="item.placeholder"
                style="width:50%"
                type="textarea"
                resize="none"
                :rows="6"
                clearable
              />
              <el-select
                v-if="item.type == formType.Select"
                v-model="form[item.prop]"
                :placeholder="item.placeholder"
                filterable
              >
                <el-option
                  v-for="option in item.items"
                  :key="option.id"
                  :label="option.name"
                  :value="option.id"
                >
                </el-option>
              </el-select>
              <el-date-picker
                v-if="item.type == formType.DateTimePicker"
                v-model="form[item.prop]"
                type="datetime"
                :placeholder="item.placeholder"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
                >
              </el-date-picker>
              <div
                class="upload-product upload-file"
                v-if="item.type == formType.Album"
              >
                <div
                  class="img-father"
                  v-for="(image, imageIndex) in form[item.prop]"
                  :key="imageIndex"
                >
                  <p
                    class="product-p"
                    @click="deleteImage(item.prop, imageIndex)"
                  >
                    x
                  </p>
                  <p class="main-figure">
                    <span @click="mainFigureClick(item.prop, imageIndex)"
                      >设为主图</span
                    >
                  </p>
                  <img
                    class="product-img"
                    :src="image.thumbPath"
                    alt="加载失败..."
                  />
                </div>
                <el-upload
                  :multiple="true"
                  :limit="9"
                  :on-exceed="handleExceed"
                  action="none"
                  :before-upload="file => handleBeforeUpload(file, item.prop)"
                  :show-file-list="false"
                  accept="image/*"
                  class="product-item"
                >
                  <button class="item-button">+</button>
                </el-upload>
              </div>

              <template v-if="item.type == formType.RelateProduct">
                <div>
                  <el-button plain @click.stop="onSolutionId(3)"
                    >关联方案</el-button
                  >
                  <div class="relation-box" v-if="solutionName">
                    <label>{{ solutionName }}</label>
                    <span @click.stop="deleteSolutionId()">删除</span>
                  </div>
                </div>

                <div
                  v-for="(product, key) in form[item.prop]"
                  :key="key"
                  class="product-item ele-cell top-box"
                >
                  <el-select
                    v-model="product.productId"
                    placeholder="请选择防治用药"
                    @change="$event => changeProduct(key, $event)"
                  >
                    <el-option
                      v-for="arr in products"
                      :key="arr.id"
                      :label="arr.name"
                      :value="arr.id"
                    ></el-option>
                  </el-select>
                  <div style="margin-left: 10px;">
                    规格:
                    <el-input-number
                      v-model="product.amount"
                      placeholder="请输入规格"
                      style="width: 130px;"
                      :controls="false"
                      clearable
                    ></el-input-number>
                  </div>
                  <el-input
                    readonly
                    v-model="product.unit"
                    placeholder="单位"
                    style="width: 80px; margin-left: 10px;"
                    clearable
                  />
                  <i
                    v-if="key == 0"
                    class="el-icon-circle-plus-outline ele-text-primary"
                    style="font-size:20px;margin-left: 10px;"
                    @click="addProduct(key)"
                  ></i>
                  <i
                    v-else
                    class="el-icon-remove-outline ele-text-primary"
                    style="font-size:20px;margin-left: 10px;"
                    @click="subProduct(key)"
                  ></i>
                </div>
              </template>

              <template v-if="item.type == formType.RelateUserInside">
                <div>
                  <input type="hidden" v-model="form[item.prop]" />
                  <el-button plain @click.stop="onUserId(2)"
                    >关联员工</el-button
                  >
                </div>
                <div class="relation-box" v-if="userName">
                  <label>{{ userName }}</label>
                  <span @click.stop="deleteUserId()">删除</span>
                </div>
              </template>
            </el-form-item>

            <el-form-item v-if="orderNos.length">
              <div class="relation-box" v-for="(item, index) in orderNos">
                <label>{{ item }}</label>
                <span @click.stop="deleteOrderId(index)">删除</span>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button plain @click.stop="onOrderIds(0)"
                >关联订单和预约</el-button
              >
            </el-form-item>
            <el-form-item v-if="questionNos.length">
              <div class="relation-box" v-for="(item, index) in questionNos">
                <label>{{ item }}</label>
                <span @click.stop="deleteQuestionId(index)">删除</span>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button plain @click.stop="onQuestionIds(1)"
                >关联问题记录</el-button
              >
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="save">确定</el-button>
              <el-button @click="form = {}">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="24">
        <user-field-map></user-field-map>
      </el-col>
    </el-row>

    <DialogPanel
      :ids="orderIds"
      :queryType="0"
      @save="saveOrderIds($event)"
      v-if="isOrderIds"
      @cancel="cancelOrderIds($event)"
      v-slot="data"
    >
      <template>
        <div class="state-style">
          <p
            :style="
              data.row.activity.stateCode === 1
                ? { backgroundColor: '#5AC725' }
                : { backgroundColor: '#F9AE3D' }
            "
          ></p>
          <span
            v-if="data.row.activity"
            :style="
              data.row.activity.stateCode === 1
                ? { color: '#5AC725' }
                : { color: '#F9AE3D' }
            "
            >{{ data.row.activity.stateCode == 1 ? "已完成" : "待处理" }}</span
          >
        </div>
      </template>
    </DialogPanel>

    <DialogPanel
      :ids="questionIds"
      :queryType="1"
      :type="1"
      title="关联问题记录"
      @save="saveQuestionIds($event)"
      v-if="isQuestionIds"
      @cancel="cancelQuestionIds($event)"
      v-slot="data"
    >
      <template>
        <div class="state-style">
          <p
            :style="
              data.row.state === 0
                ? { backgroundColor: '#F9AE3D' }
                : data.row.state === 1
                ? { backgroundColor: '#1890FF' }
                : { backgroundColor: '#5AC725' }
            "
          ></p>
          <span
            :class="
              data.row.state === 0 ? 'c0' : data.row.state === 1 ? 'c1' : 'c2'
            "
            >{{
              data.row.state === 0
                ? "待处理"
                : data.row.state === 1
                ? "处理中"
                : "已处理"
            }}</span
          >
        </div>
      </template>
    </DialogPanel>

    <DialogUserPanel
      :select="userId"
      :type="2"
      title="关联员工"
      @save="saveUserId($event)"
      v-if="isUserId"
      @cancel="cancelUserId($event)"
    >
    </DialogUserPanel>

    <SolutionPanel
      :select="solutionId"
      :type="3"
      title="关联方案"
      @save="saveSolutionId($event)"
      v-if="isSolution"
      @cancel="cancelSolutionId($event)"
    >
    </SolutionPanel>
  </div>
</template>

<script>
const initProduct = {
  productId: "",
  amount: "",
  unit: ""
};
const initForm = {
  products: [
    {
      ...initProduct
    }
  ]
};

import userFieldMap from "@/components/user-field-map.vue";

import { getProductList } from "@/api/product";

import {
  getArchiveRecord,
  getArchive,
  addArchiveRecord,
  updateArchiveRecord
} from "@/api/archive";
import { upload } from "@/api/file";
import { formType, pickerOptions } from "./constant";

import DialogPanel from "@/components/dialogPanel/index.vue";
import DialogUserPanel from "@/components/dialogPanel/dialogPanel.vue";
import SolutionPanel from "@/components/dialogPanel/solutionPanel.vue";

export default {
  components: {
    userFieldMap,
    DialogPanel,
    DialogUserPanel,
    SolutionPanel
  },
  data() {
    return {
      formType,
      pickerOptions,
      archive: {},
      // 编辑表单数据
      form: {},
      schema: [],
      // 是否为编辑状态
      edit: false,
      isOrderIds: false,
      orderIds: [],
      questionIds: [],
      isQuestionIds: false,
      questionNos: [],
      orderNos: [],
      products: [],
      archiveId: 0,
      userId: "",
      isUserId: false,
      userName: "",
      isSolution: false,
      solutionId: "",
      solutionName: "",
      relateProductProp: "",
      relateUserInsideProp: ""
    };
  },
  created() {
    // 有记录id就是编辑状态，否则为新增
    const { id, archiveId } = this.$route.query;
    this.archiveId = archiveId;

    const edit = id ? true : false;
    this.edit = edit;
    (async () => {
      if (this.archiveId == 4) await this.getProductList();
      if (edit) {
        const data = await this.getArchiveRecord();
        if (this.archiveId == 4) {
          this.setEdit(data);
        }
      } else {
        await this.getArchive();
      }
    })();
  },
  methods: {
    setEdit(data) {
      const { orderRelations, questionRelations, schema } = data;

      if (orderRelations && orderRelations.length) {
        this.saveOrderIds(orderRelations);
      }

      if (questionRelations && questionRelations.length) {
        this.saveQuestionIds(questionRelations);
      }

      const user = schema.find(r => r.type == formType.RelateUserInside);

      if (user && user.data) {
        this.saveUserId({ id: user.value, ...user.data });
      }

      const product = schema.find(r => r.type == formType.RelateProduct);

      if (product && product.data) {
        this.form[product.prop];
        const arr = product.data;
        this.setProduct(arr);
        // if(arr.length > 0){
        //    this.form[product.prop] = this.form[product.prop].filter(r=> r.id);
        //    arr.forEach(val => {
        //         this.form[product.prop].push({
        //           productId: val.productId,
        //           amount: val.productId,
        //           unit: val.unit
        //         });
        //    });
        // }
      }
    },

    setProduct(arr) {
      if (arr.length > 0) {
        const key = this.relateProductProp;
        this.form[key] = this.form[key].filter(r => r.id);
        arr.forEach(val => {
          this.form[key].push({
            productId: val.productId,
            amount: val.productId,
            unit: val.unit
          });
        });
      }
    },

    // 巡田日志
    async getArchiveRecord() {
      const { id } = this.$route.query;
      const { data } = await getArchiveRecord(id);
      this.generateForm(data);
      return data;
    },
    // 巡田模板
    async getArchive() {
      const { archiveId } = this.$route.query;
      const { data } = await getArchive(archiveId);
      this.generateForm(data);
    },
    // 生成动态表单
    generateForm(data) {
      const archive = data;
      this.archive = archive;
      const schema = archive.schema;
      let form = {};
      schema.forEach(e => {
        e.prop = `${e.type}-${String(e.id)}`;
        if (e.type == formType.Album) {
          form[e.prop] = e.albumItems || [];
        } else if (e.type == formType.Select) {
          form[e.prop] = e.items[0].id || "";
        } else if (e.type == formType.RelateProduct) {
          this.relateProductProp = e.prop;
          form[e.prop] = initForm.products;
        } else if (e.type == formType.RelateUserInside) {
          this.relateUserInsideProp = e.prop;
        } else {
          form[e.prop] = e.value || "";
        }
      });
      this.schema = schema;
      this.form = form;
    },
    save() {
      this.$refs["editForm"].validate(async valid => {
        if (valid) {
          let data = [];
          const form = this.form;
          for (let key in form) {
            const [type, id] = key.split("-");
            const valueKey = type == formType.Album ? "albumItems" : "value";
            const formData = {
              id,
              [valueKey]: form[key]
            };

            if (type == formType.RelateProduct) {
              const arr = form[key].map(r => {
                return {
                  productId: r.productId,
                  amount: r.amount
                };
              });
              formData.productItems = arr.filter(r => r.productId);
              delete formData.value;
            }
            data.push(formData);
          }

          const { fieldId, archiveId, id } = this.$route.query;

          const obj = {
            data,
            relation: {
              orderIds: this.orderIds,
              questionIds: this.questionIds
            }
          };
          if (this.edit) {
            await updateArchiveRecord(fieldId, archiveId, id, obj);
          } else {
            await addArchiveRecord(fieldId, archiveId, obj);
          }
          this.$message.success("操作成功");
          this.$router.back();
        } else {
          return false;
        }
      });
    },
    async handleExceed(files, fileList) {
      this.$message.info("上传图片最多限制9张");
    },
    async handleBeforeUpload(file, prop) {
      console.log(file);
      let fromData = new FormData();
      fromData.append("file", file);
      const { data } = await upload(fromData);
      this.form[prop] = [
        ...this.form[prop],
        {
          isCover: false,
          path: data[0].url,
          thumbPath: data[1].url
        }
      ];
    },
    //设为主图
    async mainFigureClick(prop, index) {
      const main = this.form[prop][index];
      const rest = this.form[prop]
        .filter((e, i) => i != index)
        .map(e => {
          e.isCover = false;
          return e;
        });
      main.isCover = true;
      this.form[prop] = [main, ...rest];
    },
    deleteImage(prop, index) {
      this.form[prop].splice(index, 1);
    },
    onOrderIds(type) {
      // this.clearOrderData();
      this.isOrderIds = true;
    },
    clearOrderData() {
      this.orderIds = [];
      this.orderNos = [];
      this.isOrderIds = false;
    },
    onQuestionIds(type) {
      // this.questionIds = [];
      this.isQuestionIds = true;
    },
    saveOrderIds(event) {
      const { names, ids } = this.getData(event);
      const idArr = new Set([...this.orderIds, ...ids]);
      const nameArr = new Set([...this.orderNos, ...names]);
      this.orderIds = [...idArr];
      this.orderNos = [...nameArr];
      this.isOrderIds = false;
    },
    cancelOrderIds(b) {
      // this.clearOrderData();
      this.isOrderIds = false;
    },
    saveQuestionIds(event) {
      const { names, ids } = this.getData(event);
      const idArr = new Set([...this.questionIds, ...ids]);
      const nameArr = new Set([...this.questionNos, ...names]);
      this.questionIds = [...idArr];
      this.questionNos = [...nameArr];
      this.isQuestionIds = false;
    },
    cancelQuestionIds(b) {
      // this.clearQuestionData();
      this.isQuestionIds = false;
    },
    clearQuestionData() {
      this.questionIds = [];
      this.questionNos = [];
      this.isQuestionIds = false;
    },

    clearUserData(event) {
      this.userId = "";
      this.isUserId = false;
      this.userName = null;
      this.form[this.relateUserInsideProp] = "";
    },
    saveUserId(event) {
      const { name, id } = event;
      this.form[this.relateUserInsideProp] = id;
      this.userId = id.toString();
      this.userName = name;
      this.isUserId = false;
    },
    cancelUserId(b) {
      this.isUserId = false;
      // this.clearUserData();
    },
    onUserId() {
      this.isUserId = true;
    },

    saveSolutionId(event) {
      const { no, id, products } = event;

      this.solutionId = id.toString();
      this.solutionName = no;
      this.setProduct(products);
      this.isSolution = false;
    },

    cancelSolutionId(b) {
      this.isSolution = false;
      // this.clearUserData();
    },
    onSolutionId() {
      this.isSolution = true;
    },

    getData(event) {
      const ids = event.map(r => r.id);
      const names = event.map(r => r.no);
      return {
        ids,
        names
      };
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
      this.form[this.relateProductProp][index].unit = this.products.find(
        e => e.id == value
      ).unit;
    },
    addProduct(key) {
      this.form[this.relateProductProp].push({
        ...initProduct
      });
    },
    subProduct(key) {
      this.form[this.relateProductProp].splice(key, 1);
    },
    deleteOrderId(index) {
      this.orderIds.splice(index, 1);
      this.orderNos.splice(index, 1);
    },
    deleteQuestionId(index) {
      this.questionIds.splice(index, 1);
      this.questionNos.splice(index, 1);
    },
    deleteUserId() {
      this.clearUserData();
    },
    deleteSolutionId() {
      this.isSolution = false;
      this.solutionId = "";
      this.solutionName = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-product {
  max-height: 160px;
  min-height: 60px;
  display: flex;
  flex-wrap: wrap;
  overflow-x: scroll;

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

.c0 {
  color: #f9ae3d;
}

.c1 {
  color: #1890ff;
}

.c2 {
  color: #5ac725;
}

.state-style {
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  span {
    margin-left: 5px;
  }
}

.top-box {
  margin-top: 20px;
}

.relation-box {
  span {
    color: #ff3c31 !important;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>

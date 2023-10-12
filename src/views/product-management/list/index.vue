//系统设置-产品管理
<template>
  <div class="ele-body">
    <el-card shadow="never" body-style="padding: 22px 22px 0 22px;">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        label-width="77px"
        @keyup.enter.native="reload"
        @submit.native.prevent
      >
        <el-row :gutter="15">
          <el-col :md="6" :sm="12">
            <el-form-item label="关键字:" prop="Name">
              <el-input
                v-model="where.Name"
                placeholder="请输入关键字"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12">
            <el-form-item label="产品类型:" prop="ProductTypeId">
              <el-select
                v-model="where.ProductTypeId"
                placeholder="请选择产品类型"
              >
                <el-option
                  v-for="(arr, index) in ProductTypeData"
                  :key="index"
                  :label="arr.name"
                  :value="arr.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :sm="12">
            <el-form-item class="ele-text-right">
              <el-button
                type="primary"
                @click="reload"
                icon="el-icon-search"
                class="ele-btn-icon"
                >查询
              </el-button>
              <el-button @click="(where = {}) && reload()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <!-- 数据表格 -->
      <ele-pro-table
        ref="table"
        :datasource="url"
        :request="tableRequestParams"
        :parseData="parseData"
        :parseParam="parseParam"
        :where="where"
        :columns="columns"
      >
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-permission="'product_add'"
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="saveProduct"
            size="small"
            >添加</el-button
          >
        </template>
        <template slot="images" slot-scope="{ row }">
          <p v-if="row.images">
            <el-image
              v-for="(arr, index) in row.images"
              :key="index"
              v-if="arr.isCover"
              style="
              width: 66px;
              height: 40px;
              "
              :src="pathHeaderName + arr.thumbImage"
              :preview-src-list="[pathHeaderName + arr.url]"
            >
            </el-image>
          </p>
        </template>
<!--        <template slot="produceDate" slot-scope="{ row }">-->
<!--          <span>{{-->
<!--            row.produceDate ? row.produceDate.split(" ")[0] : ""-->
<!--          }}</span>-->
<!--        </template>-->
<!--        <template slot="createDate" slot-scope="{ row }">-->
<!--          <span>{{ row.createDate ? row.createDate.split(" ")[0] : "" }}</span>-->
<!--        </template>-->
        <template slot="unit" slot-scope="{ row }">
          <span>{{row.meterage+'/'+row.unit}}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <el-link @click="UploadPhotos(row)" type="success" :underline="false"
            >上传照片
          </el-link>
          <el-link
            v-permission="'product_up'"
            @click="updateProduct(row)"
            type="success"
            :underline="false"
            >编辑
          </el-link>
          <el-link @click="detailProduct(row)" type="success" :underline="false"
            >详情
          </el-link>
          <el-popconfirm
            v-permission="'product_del'"
            class="ele-action"
            title="确定要删除吗？"
            @confirm="deleteProduct(row)"
          >
            <el-link type="danger" slot="reference" :underline="false"
              >删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>
    <!--    上传照片模态框-->
    <el-dialog
      title="上传照片"
      :visible.sync="editUpload"
      width="580px"
      @closed="formUpload = {}"
      :destroy-on-close="true"
      :lock-scroll="false"
    >
      <el-form
        :model="formUpload"
        ref="editForm"
        label-width="80px"
        @submit.native.prevent
      >
        <el-form-item label="上传图片:" prop="img">
          <div class="upload-product upload-file">
            <div
              class="img-father"
              v-for="(arr, index) in uploadImgData"
              :key="index"
            >
              <!--              删除按钮-->
              <p class="product-p" @click="UploadDelete(arr)">x</p>
              <p class="main-figure">
                <span @click="mainFigureClick(arr)">设为主图</span>
              </p>
              <img
                class="product-img"
                :src="pathHeaderName + arr.thumbImage"
                alt="加载失败..."
              />
            </div>
            <el-upload
              :multiple="true"
              action="none"
              :before-upload="handleBeforeUpload"
              :on-exceed="handleExceed"
              :show-file-list="false"
              accept=".png,.jpg,.gif"
              class="product-item"
            >
              <button class="item-button">+</button>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="dialogType === 1 ? '添加产品' : '编辑产品'"
      :visible.sync="edit"
      width="600px"
      @closed="form = {}"
      :destroy-on-close="true"
      :lock-scroll="false"
    >
      <el-form
        :model="form"
        ref="editForm"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent
      >
        <el-form-item label="上传照片:" prop="img" v-show="dialogType === 2">
          <div class="upload-product upload-file">
            <div
              class="img-father"
              v-for="(arr, index) in uploadImgData"
              :key="index"
            >
              <!--              删除按钮-->
              <p class="product-p" @click="UploadDelete(arr)">x</p>
              <p class="main-figure">
                <span @click="mainFigureClick(arr)">设为主图</span>
              </p>
              <img
                class="product-img"
                :src="pathHeaderName + arr.thumbImage"
                alt="加载失败..."
              />
            </div>
            <el-upload
              :multiple="true"
              action="none"
              :before-upload="handleBeforeUpload"
              :on-exceed="handleExceed"
              :show-file-list="false"
              accept=".png,.jpg,.gif"
              class="product-item"
            >
              <button class="item-button">+</button>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="产品名称:" prop="name">
          <el-input v-model="form.name" placeholder="产品名称" clearable />
        </el-form-item>
        <el-form-item label="产品类型:" prop="productTypeId">
          <el-select
            v-model="form.productTypeId"
            placeholder="请选择产品类型"
            style="width: 100%"
          >
            <el-option
              v-for="(arr, index) in ProductTypeData"
              :key="index"
              :label="arr.name"
              :value="arr.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批准登记号:" prop="registerCode">
          <el-input
            v-model="form.registerCode"
            placeholder="请输入产品批准登记号"
            clearable
          />
        </el-form-item>
        <el-form-item label="主要成分:" prop="ingredient">
          <el-input
            v-model="form.ingredient"
            placeholder="请输入主要成分"
            clearable
          />
        </el-form-item>
        <!--        <el-form-item label="生产日期:" prop="produceDate">-->
        <!--          <el-date-picker-->
        <!--            style="width: 100%"-->
        <!--            v-model="form.produceDate"-->
        <!--            type="date"-->
        <!--            format="yyyy 年 MM 月 dd 日"-->
        <!--            value-format="yyyy-MM-dd"-->
        <!--            placeholder="选择日期"-->
        <!--          >-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
        <div class="meterage">
          <el-form-item label="规格:" prop="meterage">
            <el-input
              v-model="form.meterage"
              placeholder="请输入规格"
              clearable
            />
          </el-form-item>
          <el-form-item prop="unit" label-width="10px">
            <el-select
              v-model="form.unit"
              placeholder="请选择单位"
              style="width: 100%"
            >
              <el-option
                v-for="(arr, index) in unitData"
                :key="index"
                :label="arr.name"
                :value="arr.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="产品描述:" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="请输入产品描述"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="edit = false">取消</el-button>
        <el-button type="primary" @click="save" :loading="loading"
          >保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  PostProductSave,
  PutProductUpdate,
  DeleteProduct
} from "@/api/product";
import { GetProductTypeList } from "@/api/productType";
import {
  PostProductImagesSave,
  DeleteProductImages,
  GetProductImagesList,
  PutProductImageCover,
  PostProductImageUpload
} from "@/api/productImages";
export default {
  name: "index",
  // props:{
  //   // 允许上传的文件类型, 例如["pdf"]
  //   fileType: {
  //     type: Array,
  //     default: () => ["jpg","png","gif"]
  //   },
  // },
  data() {
    return {
      fileType: ["jpg", "png", "gif"],
      dialogType: 1, //弹窗类型 1是添加 2是修改
      tableRequestParams: {
        pageName: "pageIndex",
        limitName: "pageSize"
      },
      // 表格搜索条件
      where: {},
      // 表格数据接口
      url: "/api/Product",
      tableLoading: true,
      columns: [
        {
          label: "序号",
          columnKey: "index",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          prop: "no",
          label: "产品ID",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "images",
          label: "产品主图",
          minWidth: 110,
          align: "center",
          slot: "images"
        },
        {
          prop: "name",
          label: "产品名称",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "productTypeName",
          label: "产品类型",
          minWidth: 110,
          align: "center"
        },
        {
          prop: "registerCode",
          label: "产品批准登记号",
          minWidth: 120,
          align: "center"
        },
        {
          prop: "unit",
          label: "规格",
          minWidth: 110,
          align: "center",
          slot:'unit'
        },
        // {
        //   prop: 'meterage',
        //   label: '剂量',
        //   minWidth: 110,
        //   align: 'center',
        // },
        // {
        //   prop: "produceDate",
        //   label: "生产日期",
        //   minWidth: 110,
        //   align: "center",
        //   slot: "produceDate"
        // },
        // {
        //   prop: 'createDate',
        //   label: '创建时间',
        //   minWidth: 110,
        //   align: 'center',
        //   slot: 'createDate'
        // },
        {
          prop: "action",
          label: "操作",
          minWidth: 200,
          align: "center",
          slot: "action",
          fixed: "right"
        }
      ],
      // 编辑表单数据
      form: {},
      formUpload: {},
      ProductTypeData: new Array(),
      // 编辑表单验证规则
      rules: {
        productTypeId: [
          { required: true, message: "请输入产品类型", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        registerCode: [
          { required: true, message: "请输入产品登记服务号", trigger: "blur" }
        ],
        produceDate: [
          { required: true, message: "请输入生产日期", trigger: "blur" }
        ]
        //unit:[{ required: true, message: '请输入规格', trigger: 'blur' }]
      },
      loading: false,
      edit: false,
      editUpload: false,
      updateId: null,
      uploadImgData: new Array(),
      unitData: [
        { id: 0, name: "克(K)" },
        { id: 1, name: "千克(KG)" },
        { id: 2, name: "毫升(ML)" },
        { id: 3, name: "升(L)" }
      ]
    };
  },
  computed:{
    pathHeaderName(){
      const header = location.hostname;
      if(header==='www.hzdaofeng.com'){
        return `https://${header}`
      }else if(header==='rydemo.ryaims.com'){
        return `https://${header}:30100`
      }
      return `https://rydemo.ryaims.com:30100`
    }
  },
  mounted() {
    this.GetProductType();
  },
  methods: {
    //请求产品类型数据
    async GetProductType() {
      const { data } = await GetProductTypeList();
      const myData = data.data;
      for (let r of myData) {
        this.ProductTypeData.push({ id: r.id, name: r.name });
      }
    },
    // 定义请求参数，可以理解为参数拦截器
    parseParam(res) {
      if (res.districtId) {
        return {
          ...res,
          districtId: res.districtId[res.districtId.length - 1],
          pageIndex: res.pageIndex - 1
        };
      }
      return { ...res, pageIndex: res.pageIndex - 1 };
    },
    /* 调整数据格式 */
    parseData(res) {
      // 后端接口需要返回的数据格式为：{"code": 0, "data": [{},{}], "count": 10, "msg": ""}
      return {
        code: 0,
        data: res.data,
        count: res.meta.totalItemsCount,
        msg: res.message ? res.message : ""
      };
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
        let fromData = new FormData();
        fromData.append("file", file);
        const { data } = await PostProductImageUpload(fromData);
        await PostProductImagesSave({
          productId: this.updateId,
          url: data[0].url,
          thumbImage: data[1].url
        });
        await this.GetProductImagesList();
        this.$message.success("上传成功");
      }
      return false;
    },
    async GetProductImagesList() {
      const { data } = await GetProductImagesList(this.updateId);
      this.uploadImgData = data;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择1个文件，本次选择了${
          files.length
        } 个文件，共选择了${fileList.length + files.length} 个文件`
      );
    },
    //设为主图
    async mainFigureClick(arr) {
      if (this.uploadImgData.some(r => r.isCover === true && r.id === arr.id)) {
        this.$message.warning("该照片已设置主图，无需再次操作");
        return;
      }
      await PutProductImageCover(arr.id);
      this.$message.success("设置成功");
      await this.GetProductImagesList();
      this.reload();
    },
    //删除图片
    async UploadDelete(arr) {
      await DeleteProductImages(arr.id);
      this.$message.success("删除成功");
      await this.GetProductImagesList();
      this.reload();
    },
    //上传照片
    UploadPhotos(row) {
      this.updateId = row.id;
      this.GetProductImagesList();
      this.editUpload = true;
    },
    //添加产品
    saveProduct() {
      this.dialogType = 1;
      this.edit = true;
    },
    //修改产品
    updateProduct(row) {
      this.dialogType = 2;
      this.updateId = row.id;
      this.form = Object.assign({}, row);
      this.GetProductImagesList();
      this.edit = true;
    },
    /* 保存编辑 */
    save() {
      this.$refs["editForm"].validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            if (this.dialogType === 1) {
              await PostProductSave(this.form);
            } else {
              await PutProductUpdate(this.updateId, this.form);
            }
            this.$message.success(
              this.dialogType === 1 ? "添加成功" : "修改成功"
            );
            this.edit = false;
            this.reload();
            this.loading = false;
          } catch {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
    // 搜索
    reload() {
      this.$nextTick(() => {
        this.$refs.table.reload();
      });
    },
    //详情
    detailProduct(row) {
      this.$router.push({
        path: "/product-management/list/detail",
        query: { id: row.id }
      });
    },
    // 删除
    async deleteProduct(row) {
      try {
        this.tableLoading = true;
        await DeleteProduct(row.id);
        this.tableLoading = false;
        this.reload();
        this.$message.success("删除成功");
      } catch {
        this.tableLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "index";
</style>

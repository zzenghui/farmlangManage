//稻丰客户管理-列表-详情
<template>
  <div class="ele-body" v-if="form">
    <el-row :gutter="10">
      <el-col :lg="10" :md="24">
        <el-card shadow="never" class="card_style">
          <!-- 搜索表单 -->
          <el-form :model="where" class="form_style" label-width="0px" @submit.native.prevent>
            <el-row :gutter="15">
              <el-col :md="4" :lg="4">
                <el-form-item v-permission="'field_add'">
                  <el-button
                    size="small"
                    type="primary"
                    @click="customerFieldSave"
                    >增加农田</el-button
                  >
                </el-form-item>
              </el-col>
              <el-col :md="7" :lg="7">
                <el-form-item prop="fieldName">
                  <el-input
                    size="small"
                    v-model="where.Q"
                    placeholder="农田名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="7" :lg="7">
                <el-form-item prop="AreaCode">
                  <el-input
                    size="small"
                    v-model="where.AreaCode"
                    placeholder="区域编码"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="6">
                <el-form-item class="ele-text-right">
                  <el-button
                    size="small"
                    type="primary"
                    @click="getFarmlandList(true)"
                    class="ele-btn-icon"
                    >查询
                  </el-button>
                  <el-button
                    size="small"
                    class="ele-btn-icon"
                    @click="getFarmlandList(false)"
                    >重置</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <div
          v-if="myBig === 2"
          :class="form.length > 2 ? 'fields-data' : 'fields-data-two'"
        >
          <el-card
            class="fromCard"
            v-for="(arr, index) in form"
            :key="index"
            ref="card"
          >
            <div class="fields-name">
              <div class="border" @click="getCenterGeo(arr)">
                <section
                  v-lGeoSvg="{
                    geoJSON: arr.geoJSON,
                    svgModel: arr.isQuestion ? svgModel : svg
                  }"
                ></section>
                <p>
                  {{ arr.fieldName }} <span>{{ arr.no }}</span>
                </p>
              </div>
              <div
                v-permission="'field_list'"
                class="detail"
                @click="CustomerFarmlandDetails(arr)"
              >
                查看详情
              </div>
            </div>
            <div class="area-image">
              <el-row>
                <el-col :lg="10" :md="10">
                  <div class="farmers-crops">
                    <img
                      src="../../../../assets/customerImages/mj.png"
                      alt=""
                    />
                    <div class="farmers-item">
                      <p>农田面积</p>
                      <p>{{ arr.mu }}亩</p>
                    </div>
                  </div>
                  <div class="farmers-crops crops">
                    <img
                      src="../../../../assets/customerImages/area.png"
                      alt=""
                    />
                    <div class="farmers-item">
                      <p>作物</p>
                      <p v-if="arr.cropName.length <= 5">{{ arr.cropName }}</p>
                      <el-tooltip
                        v-else
                        class="item"
                        effect="dark"
                        :content="arr.cropName"
                        placement="right-start"
                      >
                        <p style="cursor: pointer">
                          {{ arr.cropName.slice(0, 5) + "..." }}
                        </p>
                      </el-tooltip>
                    </div>
                  </div>
                </el-col>
                <el-col :lg="14" :md="14">
                  <div class="farmers-crops">
                    <img
                      src="../../../../assets/customerImages/crops.png"
                      alt=""
                    />
                    <div class="farmers-item">
                      <p>农田区域</p>
                      <p v-if="arr.areaName.length <= 9">{{ arr.areaName }}</p>
                      <el-tooltip
                        v-else
                        class="item"
                        effect="dark"
                        :content="arr.areaName"
                        placement="right-start"
                      >
                        <p style="cursor: pointer">
                          {{ arr.areaName.slice(0, 9) + "..." }}
                        </p>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="farmers-crops crops">
                    <img
                      src="../../../../assets/customerImages/address.png"
                      alt=""
                    />
                    <div class="farmers-item">
                      <p>农田地址</p>
                      <p v-if="arr.address.length <= 9">{{ arr.address }}</p>
                      <el-tooltip
                        v-else
                        class="item"
                        effect="dark"
                        :content="arr.address"
                        placement="right-start"
                      >
                        <p style="cursor: pointer">
                          {{ arr.address.slice(0, 9) + "..." }}
                        </p>
                      </el-tooltip>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-row class="save-footer" :gutter="8">
              <el-col v-permission="'archive_add'" :lg="8" :sm="16">
                <ul>
                  <li>+</li>
                  <li @click="getTourFieldLog(arr)">巡田日志</li>
                </ul>
              </el-col>
              <el-col v-permission="'question_add'" :lg="8" :sm="16">
                <ul>
                  <li>+</li>
                  <li @click="getQuestionRecord(arr)">问题记录</li>
                </ul>
              </el-col>
              <el-col v-permission="'order_add'" :lg="8" :sm="16">
                <ul>
                  <li>+</li>
                  <li @click="getBookingService(arr)">预约服务</li>
                </ul>
              </el-col>
              <!--              <el-col :lg="6" :sm="12">-->
              <!--                <ul>-->
              <!--                  <li>+</li>-->
              <!--                  <li @click="getPlantingScheme(arr)">种植方案</li>-->
              <!--                </ul>-->
              <!--              </el-col>-->
            </el-row>
          </el-card>
        </div>
        <Empty v-if="myBig === 1"></Empty>
      </el-col>
      <el-col :lg="14" :md="24">
      <div class="right_padding">
          <el-card shadow="never" class="medir-style" body-style="padding:20px">
            <div class="self-info">
              <el-row>
                <el-col :span="6">
                  <img :src="Personal.avatar" alt="加载失败..." /><br />
                  <span>{{ Personal.name }}</span>
                </el-col>
                <el-col :span="8">
                  <div class="farmers-crops">
                    <img src="../../../../assets/customerImages/bh.png" alt="" />
                    <div class="farmers-item">
                      <p>客户ID</p>
                      <p>{{ Personal.no }}</p>
                    </div>
                  </div>
                  <div class="farmers-crops">
                    <img src="../../../../assets/customerImages/tel.png" alt="" />
                    <div class="farmers-item">
                      <p>联系方式</p>
                      <p>{{ Personal.phone }}</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="farmers-crops">
                    <img
                      src="../../../../assets/customerImages/area.png"
                      alt=""
                    />
                    <div class="farmers-item">
                      <p>所属区域</p>
                      <p>{{ Personal.areaName }}</p>
                    </div>
                  </div>
                  <div class="farmers-crops">
                    <img
                      src="../../../../assets/customerImages/address.png"
                      alt=""
                    />
                    <div class="farmers-item">
                      <p>详细地址</p>
                      <p>{{ Personal.address }}</p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <!--        地图-->
          <div v-lmap:loadMap class="map-style"></div>
      </div>
      </el-col>

    </el-row>
    <el-dialog
      title="选择日志类型"
      :visible.sync="edit"
      width="400px"
      @closed="formOne = {}"
      :destroy-on-close="true"
      :lock-scroll="false"
    >
      <el-form
        :model="formOne"
        ref="editForm"
        :rules="rules"
        label-width="110px"
        @submit.native.prevent
      >
        <el-form-item label="日志类型:" prop="logType">
          <el-select v-model="formOne.logType" placeholder="请选择日志类型">
            <el-option
              v-for="(arr, index) in options"
              :key="index"
              :value="arr.id"
              :label="arr.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="edit = false">取消</el-button>
        <el-button type="primary" @click="save" :loading="loading"
          >确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LMapServicesNew from "@/utils/lMapServicesNew.js";
import CheckPoint from "../../../../../public/maps/checkPoint.js";
import { GetFarmlandCaptureCenterPoint } from "@/api/farmland";
import { GetCustomerDetail } from "@/api/customer";
import { getArchiveList } from "@/api/archive";
import { GetFarmlandList } from "@/api/farmland";
import Empty from "@/components/empty";
import { SvgModel } from "../../../../../public/maps/geo2svg.js";

const _svgModel = new SvgModel(
  [42, 42],
  [0, 0, 0, 0],
  "rgba(245, 108, 108, 0.4)",
  0.4,
  "#F56C6C"
);
const _svg = new SvgModel(
  [42, 42],
  [0, 0, 0, 0],
  "rgba(68, 174, 254, 0.4)",
  0.4,
  "#44aefe"
);
export default {
  components: {
    Empty
  },
  data() {
    return {
      svgModel: _svgModel,
      svg: _svg,
      edit: false,
      formOne: new Object(),
      rules: {
        logType: [
          { required: true, message: "请选择日志类型", trigger: "blur" }
        ]
      },
      // 表格搜索条件
      where: {},
      // 编辑表单数据
      form: null,
      loading: false,
      isLoad: false,
      isshowNearbyField: false,
      x: null,
      y: null,
      map: null,
      lMap: new LMapServicesNew(),
      Personal: new Object(),
      fieldId: null,
      options: new Array(),
      myBig: ""
    };
  },
  created() {
    this.getDetail();
    this.getArchive();
    this.getFarmlandList();
  },
  methods: {
    getCenterGeo(arr) {
      const {
        properties: { center }
      } = JSON.parse(arr.geoJSON);
      this.lMap.setCenter([center[0], center[1]], 15);
    },
    async getDetail() {
      const { data } = await GetCustomerDetail(this.$route.query.id);
      this.Personal = data;
    },
    async getArchive() {
      const { data } = await getArchiveList();
      for (let r of data) {
        this.options.push({ id: r.id, name: r.name });
      }
    },
    async getFarmlandList(judge) {
      const Q = this.where.Q;
      const AreaCode = this.where.AreaCode;
      if (judge && !Q) {
        return;
      }

      const { data } = await GetFarmlandList({
        ClientId: this.$route.query.id,
        Q: judge ? Q : "",
        AreaCode: judge ? AreaCode : ""
      });
      this.form = data.data;
      this.form.length === 0 ? (this.myBig = 1) : (this.myBig = 2);
      if (this.map) {
        await this._initPolygon();
      }
      if (!judge) {
        this.where = {};
      }
    },
    //添加农田
    customerFieldSave() {
      this.$router.push({
        path: "/customer/information/add-the-farmland",
        query: {
          id: this.Personal.id,
          code: this.Personal.areaName,
          judgment: 1
        }
      });
    },
    //选择巡田日志
    getTourFieldLog(row) {
      this.edit = true;
      this.fieldId = row.id;
    },
    //添加预约服务
    getBookingService(row) {
      this.$router.push({
        path: "/order/add-subscribe",
        query: {
          fieldId: row.id,
          customerId: this.$route.query.id
        }
      });
    },
    //跳转添加
    save() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          try {
            this.$router.push({
              path: "/customer/information/tour-field",
              query: {
                fieldId: this.fieldId,
                archiveId: this.formOne.logType,
                customerId: this.$route.query.id
              }
            });
            this.edit = false;
            this.loading = false;
          } catch {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
    /*
     *初始化地图
     *
     */
    loadMap(el) {
      this.lMap.init({
        el,
        type: 1,
        callback: map => {
          this.map = map;
          (async () => {
            const { data } = await GetFarmlandCaptureCenterPoint(
              this.$route.query.code
            );
            this.x = data.centerLongitude;
            this.y = data.centerLatitude;
            this.lMap.setCenter(
              [data.centerLongitude, data.centerLatitude],
              12
            );
            if (this.form.length > 0) {
              await this._initPolygon();
            }
          })();
        }
      });
    },
    async _initPolygon() {
      this.lMap.removeOverlays();
      this.lMap.removePolygonGeojsons();
      const centerPointArr = [];
      this.form.forEach(val => {
        const _geo = JSON.parse(val.geoJSON);
        const points = _geo.properties.center;
        const bbox = _geo.bbox;
        this.lMap.createPolygonGeojson(
          _geo,
          `${
            val.isQuestion
              ? "rgba(245, 108, 108, 0.4)"
              : "rgba(184, 233, 134, 0.56)"
          }`,
          `${
            val.isQuestion
              ? "rgba(245, 108, 108, 1)"
              : "rgba(23, 168, 162, 0.56)"
          }`
        );
        centerPointArr.push([bbox[0], bbox[1]]);
        centerPointArr.push([bbox[2], bbox[3]]);
        this.createCheckPoint(`${val.fieldName} ${val.mu}`, points);
      });

      if (centerPointArr.length >= 2) {
        this.lMap.fit(centerPointArr);
      }
      this.isLoad = true;
    },
    createCheckPoint(text, pointArr) {
      const checkPoint = new CheckPoint(` ${text}亩`, 12, "#fff");
      checkPoint.setOffset([0, -5]);
      checkPoint.setPosition(pointArr);
      this.map.addOverlay(checkPoint.getMarker());
    },
    CustomerFarmlandDetails(row) {
      this.$router.push({
        path: "/customer/information/farmland-details",
        query: {
          fieldId: row.id,
          customerId: this.$route.query.id
        }
      });
    },
    getQuestionRecord(row) {
      this.$router.push({
        path: "/question/add-record",
        query: {
          fieldId: row.id,
          customerId: this.$route.query.id
        }
      });
    },
    getPlantingScheme() {
      this.$message.info("功能正在开发中...");
    }
  },
  destroyed() {
    this.lMap.removeOverlays();
    this.lMap.removePolygonGeojsons();
    this.lMap.clear();
  }
};
</script>

<style lang="scss" scoped>
@import "index";
</style>

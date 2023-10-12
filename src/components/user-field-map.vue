// 用户-地块-地图合并组件
<template>
  <div>
    <div class="why-name">
      <el-card class="medir-style">
        <el-row>
          <el-col :lg="6" :md="10" class="name-col">
            <img :src="CustomerDetail.avatar" alt="" /><br />
            <span>{{ CustomerDetail.name }}</span>
          </el-col>
          <el-col :lg="18" :md="14">
            <div class="farmers-crops">
              <img src="@/assets/customerImages/bh.png" alt="" />
              <div class="farmers-item">
                <p>客户ID</p>
                <p>{{ CustomerDetail.no }}</p>
              </div>
            </div>
            <div class="farmers-crops">
              <img src="@/assets/customerImages/tel.png" alt="" />
              <div class="farmers-item">
                <p>联系方式</p>
                <p>{{ CustomerDetail.phone }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="ch-detail" v-if="$route.query.fieldId">
      <el-card>
        <el-col :lg="13" :md="12">
          <div class="farmers-crops">
            <img src="@/assets/customerImages/bh.png" alt="" />
            <div class="farmers-item">
              <p>农田ID</p>
              <p>{{ fieldDetail.no }}</p>
            </div>
          </div>
          <div class="farmers-crops" v-if="fieldDetail.fieldName">
            <img src="@/assets/customerImages/field.png" alt="" />
            <div class="farmers-item">
              <p>农田名称</p>
              <p v-if="fieldDetail.fieldName.length <= 5">{{ fieldDetail.fieldName }}</p>
              <el-tooltip v-else class="item" effect="dark" :content="fieldDetail.fieldName" placement="left-start">
                <p>{{ fieldDetail.fieldName.slice(0,6) + '...'}}</p>
              </el-tooltip>
            </div>
          </div>
          <div class="farmers-crops">
            <img src="@/assets/customerImages/mj.png" alt="" />
            <div class="farmers-item">
              <p>面积(亩)</p>
              <p>{{ fieldDetail.mu }}</p>
            </div>
          </div>
          <div class="farmers-crops" v-if="fieldDetail.estimateYield">
            <i class="el-icon--yuguchanliang"></i>
            <div class="farmers-item">
              <p>预估产量</p>
              <p>{{ fieldDetail.estimateYield }}</p>
            </div>
          </div>
        </el-col>
        <el-col :lg="11" :md="12">
          <div class="farmers-crops">
            <img src="@/assets/customerImages/type.png" alt="" />
            <div class="farmers-item">
              <p>农田类型</p>
              <p>承包</p>
            </div>
          </div>
          <div class="farmers-crops">
            <img src="@/assets/customerImages/xz.png" alt="" />
            <div class="farmers-item">
              <p>农田性质</p>
              <p>水田</p>
            </div>
          </div>
          <div class="farmers-crops" v-if="fieldDetail.cropName">
            <img src="@/assets/customerImages/crops.png" alt="" />
            <div class="farmers-item">
              <p>种植作物</p>
              <p v-if="fieldDetail.cropName.length <= 3">{{ fieldDetail.cropName }}</p>
              <el-tooltip v-else class="item" effect="dark" :content="fieldDetail.cropName" placement="top">
                <p>{{ fieldDetail.cropName.slice(0,3) + '...'}}</p>
              </el-tooltip>
            </div>
          </div>
          <div class="farmers-crops" v-if="fieldDetail.actualYield">
            <i class="el-icon--shishouchanliang"></i>
            <div class="farmers-item">
              <p>实收产量</p>
              <p>{{fieldDetail.actualYield}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="farmers-crops">
            <img src="@/assets/customerImages/area.png" alt="" />
            <div class="farmers-item">
              <p>农田区域</p>
              <p>{{ fieldDetail.areaName }}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="farmers-crops">
            <img src="@/assets/customerImages/address.png" alt="" />
            <div class="farmers-item">
              <p>农田地址</p>
              <p>{{ fieldDetail.address }}</p>
            </div>
          </div>
        </el-col>

        <el-col v-if="isFieldRecore" :span="24">
          <div class="farmers-crops">
            <i class="el-icon--guanliannongtian1"></i>
            <div class="farmers-item">
              <p>关联地块</p>
              <div class="oveflow-no">
                <p v-for="(item,index) in fieldRecores" :key="index">{{item.childNo}}</p>
              </div>
            </div>
          </div>
        </el-col>

      </el-card>
    </div>
    <div>
      <div v-if="$route.query.fieldId">
        <div v-lmap:loadMap class="map-style"></div>
      </div>
      <div v-else>
        <el-empty :description="$route.query.geoJSONJudge==='1'?'该地块可能已被删除':'该地块可能已删除或发单方式为快速预约'"></el-empty>
      </div>
    </div>
  </div>
</template>
<script>
  import LMapServicesNew from "@/utils/lMapServicesNew.js";
  import CheckPoint from "../../public/maps/checkPoint.js";
  import {
    GetFarmlandDetail
  } from "@/api/farmland";
  import {
    GetCustomerDetail
  } from "@/api/customer";
  export default {
    name: "user-field-map",
    props: ['serviceData', 'fieldColor', 'isFieldRecore', 'fieldRecores'],
    data() {
      return {
        fieldDetail: new Object(),
        CustomerDetail: new Object(),
        x: 0,
        y: 0,
        isshowNearbyField: false,
        field: null,
        mapClick: null,
        map: null,
        lMap: new LMapServicesNew(),
        r: null,
        g: null,
        b: null
      };
    },
    mounted() {
      this.getCustomerDetail();
    },
    methods: {
      async getCustomerDetail() {
        const {
          data
        } = await GetCustomerDetail(this.$route.query.customerId);
        this.CustomerDetail = data;
        if (this.serviceData) {
          const emData = {
            id: data.id,
            name: data.name,
            phone: data.phone,
            no: data.no
          };
          this.$emit('changeService', emData);
        }
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
            const fieldId = this.$route.query.fieldId;
            if (!fieldId) {
              return;
            }
            this.init();
            this.map = map;
          }
        });
      },
      init() {
        GetFarmlandDetail(this.$route.query.fieldId)
          .then(r => r.data)
          .then(res => {
            this.fieldDetail = res;
            if (res.geoJSON) {
              const geo = JSON.parse(res.geoJSON);
              this.properties = geo.properties;
              const [x, y] = geo.properties.center;
              this.x = x;
              this.y = y;
              this.lMap.fit(geo.geometry.coordinates[0]);
              if (this.fieldColor) {
                const fieldColor = this.fieldColor.split(',');
                this.r = fieldColor[0].split('(')[1];
                this.g = fieldColor[1];
                this.b = fieldColor[2];
              }
              this.lMap.createPolygonGeojsonNew(
                geo,
                this.fieldColor ? `rgba(${this.r},${this.g},${this.b},0.4)` : "rgba(255,201,14, 0.4)",
                this.fieldColor ? `${this.fieldColor}` : "rgba(255,201,14, 1)",
                res.id,
                true
              );
              const points = geo.properties.center;
              this.createCheckPoint(`${res.fieldName} ${res.mu}`, points);
            }
          });
      },
      createCheckPoint(text, pointArr) {
        const checkPoint = new CheckPoint(` ${text}亩`, 12, "#fff");
        checkPoint.setOffset([0, -5]);
        checkPoint.setPosition(pointArr);
        this.map.addOverlay(checkPoint.getMarker());
      },
      beforeDestroy() {
        this.lMap.removeMapsLayers();
        this.lMap.clear();
      }
    }
  };
</script>

<style scoped lang="scss">
  .why-name {
    .el-card {
      height: 100%;

      .name-col {
        text-align: center;

        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
      }
    }
  }

  .farmers-item {
    margin-left: 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.65);

    p:nth-child(1) {
      min-width: 55px;
    }

    p:nth-child(2) {
      color: black;
      margin-left: 20px;
    }

    .oveflow-no {
      height: 30px;
      //border: 1px solid #66974D;
      overflow-y: scroll;
      margin-left: 20px;
      border-radius: 10px;

      p {
        color: black;
        margin-left: 0;
        line-height: 30px;
      }
    }
  }

  .farmers-crops {
    display: flex;
    margin-top: 10px;
    align-items: center;
    margin-left: 10px;

    img {
      width: 26px;
      height: 26px;
      margin-left: -10px;
    }

    i {
      font-size: 26px;
      margin-left: -10px;
    }
  }

  .ch-detail {
    margin-top: 16px;
  
  .el-card {
      height: 100%;
      padding-bottom: 16px;
    }
  }

  .map-style {
    margin-top: 16px;
    height: calc(100vh - 437px);
  }

  @media (max-width:1200px) {
    .medir-style {
      margin-top: 16px;
    }
  }
</style>

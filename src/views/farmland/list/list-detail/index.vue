<template>
  <div>
    <el-row>
      <el-col :lg="6" :md="24">
        <div v-if="field">
          <div class="fields-mes-box">
            <el-card>
              <h2>农田信息</h2>
              <section>
                <label>农田ID:</label>
                <span>{{field.no}}</span>
              </section>
              <section>
                <label>面积(亩):</label>
                <span>{{field.mu}}</span>
              </section>
              <section>
                <label>创建人ID:</label>
                <span>{{field.creadId}}</span>
              </section>
              <section>
                <label>创建时间:</label>
                <span>{{field.createDate}}</span>
              </section>
              <section>
                <label>客户ID:</label>
                <span>{{field.clientNo}}</span>
              </section>
              <section>
                <label>联系方式:</label>
                <span>{{field.clientPhone}}</span>
              </section>
              <section>
                <label>种植作物:</label>
                <span>{{field.cropName}}</span>
              </section>
              <!--              <section>-->
              <!--                <label>农田类型:</label>-->
              <!--                <span>{{field.fieldType}}</span>-->
              <!--              </section>-->
              <!--              <section>-->
              <!--                <label>农田性质:</label>-->
              <!--                <span>{{field.property}}</span>-->
              <!--              </section>-->
              <section>
                <label>所属区域:</label>
                <span>{{field.areaName}}</span>
              </section>
              <section>
                <label>详细地址:</label>
                <span>{{field.address}}</span>
              </section>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :lg="18" :md="24">
        <div class="map">
          <div v-lmap:loadMap class="map-style"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import LMapServicesNew from '@/utils/lMapServicesNew.js';
  import CheckPoint from "../../../../../public/maps/checkPoint.js";
  import {
    GetFarmlandDetail
  } from '@/api/farmland';
  export default {
    data() {
      return {
        properties: null,
        x: 0,
        y: 0,
        isshowNearbyField: false,
        field: null,
        mapClick: null,
        map: null,
        lMap: new LMapServicesNew(),
      }
    },
    beforeDestroy() {
      this.lMap.removeMapsLayers();
      this.lMap.clear();
    },
    methods: {
      /*
       *初始化地图
       *
       */
      loadMap(el) {
        this.lMap.init({
          el,
          type: 1,
          callback: map => {
            this.init();
            this.map = map;
          }
        });
      },
      init() {
        GetFarmlandDetail(this.$route.query.id)
          .then(r => r.data)
          .then(res => {
            this.field = res;
            if (res.geoJSON) {
              const geo = JSON.parse(res.geoJSON);
              this.properties = geo.properties;
              const [x, y] = geo.properties.center;
              this.x = x;
              this.y = y;
              this.lMap.fit(geo.geometry.coordinates[0]);
              this.lMap.createPolygonGeojsonNew(geo, 'rgba(255,201,14, 0.4)', 'rgba(255,201,14, 1)', res.id, true);
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
    }
  }
</script>
<style lang="scss" scoped>
  @import 'index';
</style>

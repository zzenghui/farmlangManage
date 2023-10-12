<template>
  <div class="ele-body">
    <div v-lmap:loadMap class="map-style"></div>
    <!--  <aside class="map-layer">
      <div @click.stop="$lmap.onSetLayers(0)">地图</div>
      <div @click.stop="$lmap.onSetLayers(1)">卫星</div>
      <div @click.stop="$lmap.onSetLayers(2)">混合</div>
    </aside> -->
    <aside class="map-control" v-if="lMap">
      <button class="icon ruiyun iconadd" @click.stop="lMap.onCreatePolygon()"></button>
      <button class="icon ruiyun iconback" @click.stop="lMap.onCancel()"></button>
      <button class="icon ruiyun iconashbin" @click.stop="lMap.onDelete()"></button>
      <button class="icon ruiyun iconduihao" @click.stop="onSave()"></button>
    </aside>

    <aside class="map-button-box" v-if="lMap">
      <!--      <el-switch class="el-switch-style" @change="change" active-color="#1890FF" v-model="isshowNearbyField">-->
      <!--      </el-switch>-->
      <button class="icon ruiyun iconchangdu" @click.stop="lMap.onCreateLine()"></button>
      <button class="icon ruiyun iconmianji" @click.stop="lMap.onCreateArea()"></button>
      <!--      <button class="icon ruiyun iconarrow-left-bold" @click.stop="onGoto"></button>-->
    </aside>

    <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="isShow" width="400px" top="30px"
      @closed="form = {}" :destroy-on-close="true" :lock-scroll="false">
      <el-form :model="form" ref="editForm" :rules="rules" label-width="85px" @submit.native.prevent>
        <el-form-item label="农田名称:" prop="fieldName">
          <el-input v-model="form.fieldName" placeholder="请输入农田名称" clearable />
        </el-form-item>
        <el-form-item label="种植作物:" prop="cropId">
          <el-select v-model="form.cropId" placeholder="请选择种植作物" style="width: 100%">
            <el-option v-for="(row,index) in cropData" :key="index" :label="row.name" :value="row.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域:" prop="areaCode">
          <el-cascader v-model="form.areaCode" placeholder="请选择所属区域" style="width: 100%" :options="villageOptions"
            :props="{ checkStrictly: true }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" clearable />
        </el-form-item>
        <el-form-item label="预估产量:" prop="estimateYield">
          <el-input type="number" v-model="form.estimateYield" placeholder="请输入预估产量" clearable />
        </el-form-item>
        <el-form-item label="实收产量:" prop="actualYield">
          <el-input type="number" v-model="form.actualYield" placeholder="请输入实收产量" clearable />
        </el-form-item>
        <el-form-item label="关联地块" prop="childNo">
          <el-autocomplete v-model="form.childNo" style="width: 100%" :fetch-suggestions="querySearchAsync"
            placeholder="请输入关键字" @select="handleSelect"></el-autocomplete>
          <!--          <el-input-->
          <!--            v-model="form.childNo"-->
          <!--            placeholder="请输入地块Id或业务Id"-->
          <!--            clearable-->
          <!--          />-->
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="saveFarmland()" :loading="loading">保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex';
  import LMapServicesNew from '@/utils/lMapServicesNew.js';
  import {
    PutFarmlandUpdate,
    GetFarmlandDetail,
    GetFarmlandList,
    GetFarmlandCaptureSurrounding
  } from '@/api/farmland';
  import {
    getCropsListData
  } from '@/api/crops';
  export default {
    data() {
      return {
        id: null,
        map: null,
        lMap: new LMapServicesNew(),
        isLoad: false,
        isshowNearbyField: false,
        isShow: false,
        geoJSON: null,
        x: 0,
        y: 0,
        form: new Object(),
        rules: {
          areaCode: [{
            required: true,
            message: "请选择所属区域",
            trigger: "blur"
          }],
          cropId: [{
            required: true,
            message: "请选择种植作物",
            trigger: "blur"
          }],
          // fieldName:[{ required: true, message: "请输入农田名称", trigger: "blur" }],
          address: [{
            required: true,
            message: "请输入详细地址",
            trigger: "blur"
          }]
        },
        loading: false,
        updateData: new Object(),
        villageOptions: new Array(),
        cropData: new Array(),
        restaurants: [],
        timeout: null,
        noId: null
      }
    },
    mounted() {
      this.villageOptions = this.areaData;
      this.getCropsList();
    },
    methods: {
      async querySearchAsync(queryString, cb) {
        let restaurants = this.restaurants;
        let result = null;
        if (queryString) {
          const {
            data: {
              data
            }
          } = await GetFarmlandList({
            q: queryString
          });
          data.length === 0 ? result = restaurants : result = this.createStateFilter(data);
        } else {
          result = restaurants;
        }
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(result);
        }, 500);
      },
      createStateFilter(data) {
        const myData = [];
        for (let r of data) {
          myData.push({
            value: r.no,
            id: r.id,
            name: r.fieldName
          });
        }
        return myData;
      },
      handleSelect(item) {
        this.noId = item.value;
      },
      async getCropsList() {
        this.cropData = [];
        const {
          data: {
            data
          }
        } = await getCropsListData();
        for (let r of data) {
          this.cropData.push({
            id: r.id,
            name: r.name
          })
        }

      },
      /*
       *初始化地图
       *
       */
      loadMap(el) {
        this.lMap.init({
          el,           type: 1,
          callback: map => {
            this.map = map;
            if (this.$route.query.id) {
              GetFarmlandDetail(this.$route.query.id)
                .then(r => r.data)
                .then(res => {
                  this.updateData = res;
                  if (res.geoJSON) {
                    const geo = JSON.parse(res.geoJSON);
                    const [x, y] = geo.properties.center;
                    this.x = x;
                    this.y = y;
                    this.lMap.fit(geo.geometry.coordinates[0]);
                    // this.lMap.createPolygonGeojsonNew(geo, `${res.isQuestion?'rgba(245, 108, 108, 0.4)':'rgba(255,201,14, 0.4)'}`, `${res.isQuestion?'rgba(245, 108, 108, 1)':'rgba(255,201,14, 1)'}`);

                    this.lMap.createModifyPolygonGeojson({
                      geoJson: geo,
                      fillColor: `${res.isQuestion?'rgba(245, 108, 108, 0.4)':'rgba(255,201,14, 0.4)'}`,
                      strokeColor: `${res.isQuestion?'rgba(245, 108, 108, 1)':'rgba(255,201,14, 1)'}`
                    });

                    this._getNearbyPoint(x, y);

                    setTimeout(() => {
                      this.lMap.lModifyEvent();
                    }, 1000);
                    this.isLoad = true;
                  }
                });
            }
          }
        });
      },
      change(b) {
        this.isshowNearbyField = b;
        // if (b) {
        //   const [x, y] = this.lMap.getCenter();
        //   this._getNearbyPoint(x, y);
        // } else {
        //   this.lMap.removePolygonGeojsons();
        // }
      },
      /*
       *保存地图信息
       */
      async onSave() {
        let geoJson = this.lMap.getGeoJson();
        if (geoJson) {
          if (!this.lMap.isTruePolygon) {
            this.$message.error('多边形不合法请从新绘制或编辑！');
            return;
          }
        }
        if (!geoJson) {
          geoJson = this.lMap.getGeoJsonNew();
          if (!this.lMap.isModifyTruePolygon) {
            this.$message.error('多边形不合法请从新绘制或编辑！');
            return;
          }
        }
        if (!this.isLoad) {
          this.$message.error('该页面尚未加载完成请稍后在尝试其他操作！');
          return;
        }
        if (!geoJson) {
          this.$message.error('请绘制地块后在进行保存操作！');
          return;
        }
        if (geoJson) {
          this.form = Object.assign({}, this.updateData);
          this.isShow = true;
          this.geoJSON = JSON.stringify(geoJson);
        }
      },
      saveFarmland() {
        this.$refs["editForm"].validate(async valid => {
          if (valid) {
            try {
              const geoJSON = this.geoJSON;
              const clientId = this.$route.query.clientId;

              await PutFarmlandUpdate(this.$route.query.id, {
                geoJSON,
                clientId,
                fieldName: this.form.fieldName,
                areaCode: this.form.areaCode,
                address: this.form.address,
                cropId: this.form.cropId,
                childNo: this.noId,
                estimateYield: this.form.estimateYield,
                actualYield: this.form.actualYield
              });
              this.clear();
              this.lMap.clearlPolygon();
              this.lMap.createPolygonGeojson(this.geoJSON);
              this.$message.success('修改成功');
              await this.$router.push({
                path: '/farmland/list'
              })
              this.isShow = false;
            } catch {
              this.loading = false;
            }
          } else {
            return false;
          }
        });
        this.onGoto();
      },
      beforeDestroy() {
        this.clear();
        this.lMap.clear();
      },
      clear() {
        this.lMap.removePolygonGeojsonNew();
        this.lMap.removeLModifyEvent();
      },
      async _getNearbyPoint(x, y) {


        await GetFarmlandCaptureSurrounding({
          CenterLongitude: x,
          CenterLatitude: y,
          DistanceKM: 3
        }).then(r => r.data).then(res => {
          const centerPointArr = []
          // centerPointArr.push([x, y]);
          for (let i = 0; i < res.data.length; i++) {
            if (this.$route.query.id == res.data[i].id) {
              continue;
            }
            const _geo = JSON.parse(res.data[i].geoJSON);
            this.lMap.createPolygonGeojson(_geo, 'rgba(184, 233, 134, 0.56)', 'rgba(23, 168, 162, 0.56)');
            const [x2, y2] = _geo.properties.center;
            // centerPointArr.push([x2, y2]);
          }
          // if (res.data.length > 1) {
          //   this.lMap.fit(centerPointArr);
          // }
          this.isLoad = true;
        });
      },
      // onGoto() {
      //   this.$router.go(-1)
      // }
    },
    computed: {
      ...mapState(['areaData'])
    }
  }
</script>
<style lang="scss" scoped>
  @import 'index';
</style>

<template>
  <div class="ele-body">
    <div v-lmap:loadMap class="map-style"></div>
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

    <el-dialog :close-on-click-modal="false"
               title="添加"
               :visible.sync="isShow"
               width="400px"
               top="30px"
               @closed="form = {}"
               :destroy-on-close="true"
               :lock-scroll="false"
    >
      <el-form
        :model="form"
        ref="editForm"
        :rules="rules"
        label-width="85px"
        @submit.native.prevent
      >
        <el-form-item label="农田名称:" prop="fieldName">
          <el-input
            v-model="form.fieldName"
            placeholder="请输入农田名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="种植作物:" prop="cropId">
          <el-select v-model="form.cropId" placeholder="请选择种植作物" style="width: 100%">
            <el-option v-for="(row,index) in cropData" :key="index" :label="row.name" :value="row.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域:" prop="areaCode">
          <el-cascader
            v-model="form.areaCode"
            placeholder="请选择所属区域"
            style="width: 100%"
            :options="areaData"
            :props="{ checkStrictly: true }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:" prop="address">
          <el-input
            v-model="form.address"
            placeholder="请输入详细地址"
            clearable
          />
        </el-form-item>
        <el-form-item label="预估产量:" prop="estimateYield">
          <el-input
            type="number"
            v-model="form.estimateYield"
            placeholder="请输入预估产量"
            clearable
          />
        </el-form-item>
        <el-form-item label="实收产量:" prop="actualYield">
          <el-input
            type="number"
            v-model="form.actualYield"
            placeholder="请输入实收产量"
            clearable
          />
        </el-form-item>

        <el-form-item label="关联地块" prop="childNo">
          <el-autocomplete
            v-model="form.childNo"
            style="width: 100%"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入关键字"
            @select="handleSelect"
          ></el-autocomplete>
<!--          <el-input-->
<!--            v-model="form.childNo"-->
<!--            placeholder="请输入地块Id或业务Id"-->
<!--            clearable-->
<!--          />-->
        </el-form-item>

      </el-form>
      <div slot="footer" style="display: flex">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="saveAndContinue"
        >保存并继续绘制
        </el-button>
        <el-button type="primary" @click="saveFarmland" :loading="loading"
        >保存并返回列表
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import LMapServicesNew from '@/utils/lMapServicesNew.js';
import CheckPoint from '../../../../../public/maps/checkPoint.js';
import {
  PostFarmlandSave,
  GetFarmlandCaptureCenterPoint,
  GetFarmlandCaptureSurrounding,
  GetFarmlandList
} from '@/api/farmland';
import {getCropsListData} from '@/api/crops';
import {mapState} from 'vuex';

export default {
  data() {
    return {
      isLoad: false,
      isshowNearbyField: false,
      geoJSON: null,
      isShow: false,
      x: null,
      y: null,
      map: null,
      lMap: new LMapServicesNew(),
      form: new Object(),
      rules: {
        areaCode: [{required: true, message: "请选择所属区域", trigger: ["blur", 'change']}],
        cropId: [{required: true, message: "请选择种植作物", trigger: "blur"}],
        // fieldName: [{required: true, message: "请输入农田名称", trigger: "blur"}],
        address: [{required: true, message: "请输入详细地址", trigger: "blur"}]
      },
      loading: false,
      pointMap: new Map(),
      checkPointMap: new Map(),
      cropData: new Array(),
      restaurants:[],
      timeout:null,
      noId:null
    }
  },
  created() {
    this.$nextTick(() => {
      document.onkeydown = (e) => {
        if (e.keyCode == 46) {
          this.lMap.onCancel();
        }
      }
    });
  },
  mounted() {
    this.getCropsList();
  },
  methods: {
    async querySearchAsync(queryString, cb) {
      let restaurants = this.restaurants;
      let result = null;
      if (queryString) {
        const { data:{data} } = await GetFarmlandList({
          q:queryString
        });
        data.length===0?result = restaurants:result = this.createStateFilter(data);
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
        myData.push({ value: r.no, id: r.id ,name:r.fieldName});
      }
       return myData;
    },
    handleSelect(item) {
      this.noId = item.value;
    },
    async getCropsList() {
      this.cropData = [];
      const {data} = await getCropsListData();
      const myData = data.data;
      for (let r in myData) {
        this.cropData.push({
          id: myData[r].id,
          name: myData[r].name
        })
      }

    },
    /*
     *初始化地图
     *
     */
    loadMap(el) {
      this.lMap.init({
        el,
        type:1,
        callback: (map) => {
          this.map = map;
          (async () => {
            const {data} = await GetFarmlandCaptureCenterPoint(this.$route.query.code);
            this.x = data.centerLongitude;
            this.y = data.centerLatitude;
            this.lMap.setCenter([data.centerLongitude, data.centerLatitude], 12);
            await this._getNearbyPoint(this.x, this.y);
            this.isLoad = true;
          })();
        }
      });

    },
    /*
     *保存地图信息
     */
    async onSave() {
      const geoJson = this.lMap.getGeoJson();
      if (!this.lMap.isTruePolygon) {
        this.$message.error('多边形不合法请从新绘制或编辑！');
        return;
      }
      this.lMap.formatArea();
      this.lMap.formatLength();
      if (!this.isLoad) {
        this.$message.error('该页面尚未加载完成请稍后在尝试其他操作！');
        return;
      }
      if (!geoJson) {
        this.$message.error('请绘制地块后在进行保存操作！');
        return;
      }

      if (geoJson) {
        this.isShow = true;
        this.geoJSON = JSON.stringify(geoJson);
      }
    },
    async unityFun() {
      const geoJSON = this.geoJSON;
      const clientId = this.$route.query.id;
      this.form.areaCode = this.form.areaCode[this.form.areaCode.length - 1];
      this.form.childNo = this.noId;
      const { bbox } = JSON.parse(geoJSON);
      const  x = bbox[2]+((bbox[0]-bbox[2])/2);
      const  y = bbox[3]+((bbox[1]-bbox[3])/2);
      const mu = this.lMap.formatArea().split('亩')[0];
      await PostFarmlandSave({
         geoJSON,
         clientId,
        ...this.form
      });
      this.isShow = false;
      this.lMap.createPolygonGeojson(geoJSON, 'rgba(184, 233, 134, 0.56)', 'rgba(23, 168, 162, 0.56)');
      this.createCheckPoint(`${this.form.fieldName?this.form.fieldName:'无农田名称'} ${mu}`, [x,y]);
      this.$message.success('添加成功');
    },
    saveAndContinue() {
      this.$refs["editForm"].validate(async valid => {
        if (valid) {
          await this.unityFun();
          this.lMap.onDelete();
          this.isShow = false;
          this.form = {};
        }
      })
    },
    saveFarmland(b) {
      this.$refs["editForm"].validate(async valid => {
        if (valid) {
          try {
            await this.unityFun();
            this.lMap.clearlPolygon();
            if (this.$route.query.judgment) {
              const id = this.$route.query.id;
              const code = this.$route.query.code;
              await this.$router.push({
                path: '/customer/information/details',
                query: {
                  id: id,
                  code: code
                }
              });
            } else {
              await this.$router.push({
                path: '/farmland/list'
              })
            }
          } catch {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
      // if (b) {
      //   this.onGoto();
      // };
      if (!this.isshowNearbyField) {
        return;
      }
      (async () => {
        this.lMap.removePolygonGeojsons();
        const [x, y] = this.lMap.getCenter();
        await this._getNearbyPoint(x, y);
      })();
    },
    change(b) {
      if (b) {
        const [x, y] = this.lMap.getCenter();
        this._getNearbyPoint(x, y);
      } else {
        this.lMap.removePolygonGeojsons();
      }
    },
    async _getNearbyPoint(x, y) {
      await GetFarmlandCaptureSurrounding({
        CenterLongitude: x,
        CenterLatitude: y,
        DistanceKM: 3
      }).then(r => r.data).then(res => {
        const centerPointArr = []
        for (let i = 0; i < res.data.length; i++) {
          const _geo = JSON.parse(res.data[i].geoJSON);
          const points = _geo.properties.center;
          this.lMap.createPolygonGeojson(_geo, 'rgba(184, 233, 134, 0.56)',
            'rgba(23, 168, 162, 0.56)');
          const [x2, y2] = _geo.properties.center;
          centerPointArr.push([x2, y2]);
          this.createCheckPoint(`${res.data[i].fieldName?res.data[i].fieldName:'无农田名称'} ${res.data[i].mu}`, points);
        }

        if (res.data.length > 1) {
          this.lMap.fit(centerPointArr);
        }
        this.isLoad = true;
      });
    },
    createCheckPoint(text, pointArr) {
      const checkPoint = new CheckPoint(` ${text}亩`, 12, '#fff');
      checkPoint.setOffset([0, -5]);
      checkPoint.setPosition(pointArr);
      this.map.addOverlay(checkPoint.getMarker());
    },
    // onGoto() {
    //   this.$router.push({
    //     path: '/customer/information'
    //   });
    // },
  },
  computed: {
    ...mapState(['areaData'])
  },
  beforeDestroy() {
    this.lMap.clear();
  },
}
</script>
<style lang="scss" scoped>
@import 'index';
</style>

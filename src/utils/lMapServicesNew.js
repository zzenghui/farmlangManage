import 'ol/ol.css';
import LMap from '../../public/maps/mapService.js';
import mapConfig from '../../public/maps/mapConfig.js';
import LPolygon from '../../public/maps/lPolygon.js';
import {
  createGeoJson,
  createPolygonGeojson,
  createPolylinePoints,
  createGPSPoints,
} from '../../public/maps/lzh.js';
import LDraw from '../../public/maps/lDraw.js';

import MeasureTooltip from '../../public/maps/measureTooltip.js';
import HelpTooltip from '../../public/maps/helpTooltip.js';
import PolygonGeojson from '../../public/maps/lPolygonGeojson.js';

import {
  formatArea,
  formatLength,
  getCenterPoint,
  fit as fitNew,
  polygonStyle,
  createPolygonBoundary,
  PolygonModel,
  caculateLL
} from '../../public/maps/lzh.js';

import LMarker from '../../public/maps/lMarker.js';
import LModifyEvent from '../../public/maps/lModifyEvent.js';
import BingMapsServices from '../../public/maps/bingMapsServices.js';
import GPS from '../../public/maps/gps.js';
import {
  Polyline,
  addPolylinePoint,
  addPolylinePointNew
} from '../../public/maps/lPolyline.js';
import AM from '../../public/maps/am.js';
// import {
//   GetFarmlandCaptureCenterPoint
// } from '@/api/farmland';


import LPolygonNew from '../../public/maps/lPolygonNew.js'

export default class LMapServicesNew {

  constructor() {
    this.map = null;
    this._lPolygon = null;
    this._measureTooltip = null;
    this.currentLayer = [false, false, true];
    this.polygonGeojsonArr = [];
    this.polygonGeojson = null;
    this.lModifyEventArr = [];
    this.lmap = null;
    this.lMEvent = null;
    this.am = new AM();
    this.type = 2;
    this.lPolygonNewArr = new Array();
    this.polygonGeojsonMap = new Map();
    this.modifyPolygonGeojson = null;
  }
  init(optins) {
    const {
      el,
      type,
      callback
    } = optins;
    if (type === 1) {
         this.initMap(el, callback);
      // this.initBingMap(el, callback);
    } else if (type == 2) {
      this.initVectorMap(el, callback);
    } else {
       // this.initBingMap(el, callback);
      this.initMap(el, callback);
    }
  }
  initMap(el, callback) {
    // this.clear();
    if (!this.lmap) {
      this.lmap = new LMap({
        controls: mapConfig.Defaults,
        layers: mapConfig.TMapLayerArr[2],
      });
    }

    setTimeout(() => {
      const _async = async () => {
        if (this.map) {
          this.map = null;
        }
        this.map = await this.lmap.onLoad(el);
        this.map.setView(mapConfig.View);
        if (callback) {
          callback(this.map);
        }
      };
      _async();
    }, 100);
  }
  initBingMap(el, callback) {
    // this.clear();
    if (!this.lmap) {
      this.lmap = new BingMapsServices({
        controls: mapConfig.Defaults,
      });
    }

    setTimeout(() => {
      const _async = async () => {
        if (this.map) {
          this.map = null;
        }
        this.map = await this.lmap.onLoad(el);
        this.map.setView(mapConfig.View);
        if (callback) {
          callback(this.map);
        }
      };
      _async();
    }, 100);
  }

  initVectorMap(el, callback) {
    // this.clear();
    if (!this.lmap) {
      if (this.map) {
        this.map = null;
      }
      this.lmap = new LMap({
        controls: mapConfig.Defaults,
        interactions: mapConfig.InteractionsDeft
      });
    }

    setTimeout(() => {
      const _async = async () => {
        if (this.map) {
          this.map = null;
        }
        this.map = await this.lmap.onLoad(el);
        this.map.setView(mapConfig.getVectorLayerView);
        if (callback) {
          callback(this.map);
        }
      };
      _async();
    }, 100);
  }

  getVectorLayerView() {
    return mapConfig.getVectorLayerView;
  }

  onSetLayers(type) {
    this.type = type;
    this.currentLayer = this.currentLayer.map(r => r = false);
    this.currentLayer[type] = true;
    this.removeLayers(type);
    this.addLayers(type);
  }

  removeLayers(type) {
    mapConfig.TMapLayerArr[type].forEach((val, key) => {
      this.map.removeLayer(val);
    });
  }

  addLayers(type) {
    mapConfig.TMapLayerArr[type].forEach((val, key) => {
      this.map.addLayer(val);
    });
  }

  onCreatePolygon(callback) {

    // if (this.polygonGeojson) {
    //   this.map.removeLayer(this.polygonGeojson);
    // }

    if (this.modifyPolygonGeojson) {
      this.modifyPolygonGeojson.remove();
      this.modifyPolygonGeojson=null;
    }
    if (this._lPolygon) {
      this.clearlPolygon();
      // this._removeMeasureTooltip();
    }
    const _this = this;
    this._lPolygon = new LPolygon('Polygon', this.map, (obj) => {});

    // if (callback) {
    //   callback();
    // }
  }

  get isTruePolygon() {
    if (!this._lPolygon) return false;
    return this._lPolygon.isTruePolygon;
  }

  get isModifyTruePolygon() {
    if (!this.modifyPolygonGeojson) return false;
    return this.modifyPolygonGeojson.isTruePolygon;
  }


  onCancel() {
    if (this._lPolygon) {
      this._lPolygon.removeLastPoint();
    }
  }

  onDelete(callback) {
    if (this._lPolygon) {
      this._lPolygon.remove();
      this._lPolygon = null;
      this._removeMeasureTooltip();
      if (callback) {
        callback();
      }
    } else {

    }
  }

  getGeoJson() {
    if (this._lPolygon) {
      const [x, y] = this._lPolygon.getCenterPoint();
      const geojson = createGeoJson(this._lPolygon.getCoordinates(), {
        ruleId: '',
        centerlon: x,
        centerlat: y
      });
      return geojson;
    }
    return null;
  }

  getGeoJsonNew(index) {
    // if (this.polygonGeojson) {
    //   const polygon = this.polygonGeojson;

    //   const geojson = createGeoJson(polygon.getSource().getFeatures()[0].getGeometry().getCoordinates(), {
    //     ruleId: '',
    //     centerlon: 0,
    //     centerlat: 0
    //   });
    //   return geojson;
    // }

    if (this.modifyPolygonGeojson) {
      const polygon = this.modifyPolygonGeojson;
      const geojson = createGeoJson(polygon.getCoordinates(), {
        ruleId: '',
        centerlon: 0,
        centerlat: 0
      });
      return geojson;
    }

    return null;
  }

  onCreateLine() {
    if (this.map) {
      new LDraw('LineString', e => {
        // let arrs = e.feature.getGeometry().getCoordinates();
        // let tooltipCoord = e.coordinate;
        // const obj = {
        //   pointArr: arrs,
        //   color: '#000',
        //   width: 2
        // };
        // new Polyline(obj, this.map);
      }, this.map);
    }
  }

  onCreateArea() {
    if (this.map) {
      new LDraw('Polygon', e => {}, this.map);
    }
  }

  clearlPolygon() {
    if (this.map && this._lPolygon) {
      this._lPolygon.remove();
      this._lPolygon = null;
    }
  }

  _createMeasureTooltip() {
    const marker = new MeasureTooltip();
    marker.setOffset([0, -30]);
    this._measureTooltip = marker;
    return marker;
  }

  _removeMeasureTooltip() {
    if (this.map) {
      if (this._measureTooltip) {
        this.map.removeOverlay(this._measureTooltip.getMarker());
      }
    }
  }

  createPolygonGeojson(geoJsonObj,
    fillColor = 'rgba(255, 255, 255, 0.3)',
    stroke = 'rgba(00, 131, 241, 1)',
    id,
    isSetId = false,
    lineDash = []
  ) {
    if (this.map) {
      const polygonGeojson = createPolygonGeojson(geoJsonObj, fillColor, stroke, id, isSetId, lineDash);
      this.polygonGeojsonArr.push(polygonGeojson);
      this.polygonGeojson = null;
      this.map.addLayer(polygonGeojson);
    }
  }

  createPolygonGeojsonNew(geoJsonObj,
    fillColor = 'rgba(255, 255, 255, 0.3)',
    stroke = 'rgba(00, 131, 241, 1)',
    id,
    isSetId = false
  ) {
    if (this.polygonGeojson) {
      this.polygonGeojson = null;
    }
    if (this.map) {
      const polygonGeojson = createPolygonGeojson(geoJsonObj, fillColor, stroke, id, isSetId);
      // this.polygonGeojsonArr.push(polygonGeojson);
      this.polygonGeojson = polygonGeojson;
      this.map.addLayer(polygonGeojson);
    }
  }

  removePolygonGeojsons() {
    if (!this.polygonGeojsonArr.length) {
      return;
    }
    let item = null
    while (item = this.polygonGeojsonArr.shift()) {
      this.map.removeLayer(item);
      item = null;
    }
  }

  removePolygonGeojsonNew() {
    if (!this.polygonGeojson) {
      return;
    }
    this.map.removeLayer(this.polygonGeojson);
    this.polygonGeojson = null;
  }

  clear() {
    if (!this.map) {
      return;
    }
    if (this.am) {
      this.am = null;
      this.am = new AM();
    }
    this.removeOverlays();
    this.removeLModifyEventArr();
    this.removePolygonGeojsons();
    this.clearlPolygon();
    this.removeLModifyEvent();
    this.removePolygonGeojsonNew();
    this.removeMapsLayers();
    if (this.modifyPolygonGeojson) {
      this.modifyPolygonGeojson.remove();
      this.modifyPolygonGeojson = null;
    }

  }
  clearNew() {
    this.removeOverlays();
    this.removeLModifyEventArr();
    this.removePolygonGeojsons();
    this.clearlPolygon();
    this.removeLModifyEvent();
    this.removePolygonGeojsonNew();
    if (this.modifyPolygonGeojson) {
      this.modifyPolygonGeojson.remove();
      this.modifyPolygonGeojson = null;
    }
  }

  getMap() {
    return this.map;
  }

  setCenter([x, y], zoom) {
    if (!this.map) {
      return;
    }
    const view = this.map.getView();
    view.setCenter([x, y]);
    view.setZoom(zoom);
  }

  setZoom(zoom) {
    if (!this.map) {
      return;
    }
    const view = this.map.getView();
    view.setZoom(zoom);
  }
  get getZoom() {
    if (!this.map) {
      return 0;
    }
    const view = this.map.getView();
    return view.getZoom();
  }
  getCenter() {
    if (!this.map) {
      return;
    }
    const view = this.map.getView();
    let [x, y] = view.getCenter();
    return [x, y];
  }

  fit(coordinates) {
    fitNew(this.map, coordinates);
  }

  createMarker(imgSrc, width = 15, height = 15) {
    return new LMarker(imgSrc, width, height);
  }

  removeMarker(marker) {
    this.map.removeOverlay(marker.getMarker());
  }

  lModifyEventArr() {
    this.lModifyEventArr.length = 0;
    this.polygonGeojsonArr.forEach((item, key) => {
      const lMEvent = new LModifyEvent(item, this.map);
      lMEvent.setActive();
      this.lModifyEventArr.push(lMEvent);
    });
  }

  removeLModifyEventArr() {
    if (!this.lModifyEventArr.length) {
      return;
    }
    let item = null;
    while (item = this.lModifyEventArr.shift()) {
      item.setActive(false);
      item.remove();
      item = null;
    }
  }

  lModifyEvent() {
    // if (this.map && this.polygonGeojson) {
    //   const lMEvent = new LModifyEvent(this.polygonGeojson, this.map);
    //   lMEvent.setActive();
    //   this.lMEvent = lMEvent;
    // }
    if (this.map && this.modifyPolygonGeojson) {
      const lMEvent = new LModifyEvent(this.modifyPolygonGeojson, this.map);
      lMEvent.setActive();
      this.lMEvent = lMEvent;
    }
  }


  removeLModifyEvent() {
    if (!this.lMEvent) {
      return;
    }
    this.lMEvent.setActive(false);
    this.lMEvent.remove();
  }

  createModifyPolygonGeojson(options) {
    const {
      geoJson,
      strokeColor,
      fillColor,
      id
    } = options;
    this.modifyPolygonGeojson = new PolygonGeojson({
      geoJson,
      strokeColor,
      fillColor,
      id
    }, this.map);
  }

  convertWGS84GeoJSONgcj_encrypt(geoJSON) {
    const {
      bbox,
      geometry,
      properties
    } = geoJSON;
    const bboxArr = [];
    for (let i = 0; i < bbox.length; i += 2) {
      const {
        lon,
        lat
      } = GPS.gcj_encrypt(bbox[i], bbox[i + 1]);
      bboxArr.push(lon);
      bboxArr.push(lat);
    }
    geoJSON.bbox = bboxArr;
    const coordinates = geometry.coordinates;
    const coordinateArr = new Array();

    for (let i = 0; i < coordinates.length; i++) {
      coordinateArr.push(coordinates[i]);
      for (let j = 0; j < coordinates[i].length; j++) {
        const arr = coordinates[i][j];
        const {
          lon,
          lat
        } = GPS.gcj_encrypt(arr[0], arr[1]);
        coordinateArr[i][j] = [lon, lat];
      }
    }
    geometry.coordinates = coordinateArr;
    if (properties) {
      if (properties.center) {
        const [x, y] = properties.center;
        const [lat, lon] = GPS.gcj_encrypt(x, y);
        geoJSON.properties.center = [lat, lon];
      }
    }
    return geoJSON;

  }

  gcj_encryptConvertWGS84GeoJSON(geoJSON) {
    const {
      bbox,
      geometry,
      properties
    } = geoJSON;
    const bboxArr = [];
    for (let i = 0; i < bbox.length; i += 2) {
      const {
        lon,
        lat
      } = GPS.gcj_decrypt(bbox[i], bbox[i + 1]);
      bboxArr.push(lon);
      bboxArr.push(lat);
    }
    geoJSON.bbox = bboxArr;
    const coordinates = geometry.coordinates;
    const coordinateArr = new Array();
    for (let i = 0; i < coordinates.length; i++) {
      coordinateArr.push(coordinates[i]);
      for (let j = 0; j < coordinates[i].length; j++) {
        const arr = coordinates[i][j];
        const {
          lon,
          lat
        } = GPS.gcj_decrypt(arr[0], arr[1]);
        coordinateArr[i][j] = [lon, lat];
      }
    }
    geometry.coordinates = coordinateArr;
    if (properties) {
      if (properties.center) {
        const [x, y] = properties.center;
        const [lat, lon] = GPS.gcj_decrypt(x, y);
        geoJSON.properties.center = [lat, lon];
      }
    }
    return geoJSON;
  }

  gcj_encrypt(wgsLon, wgsLat) {
    return GPS.gcj_encrypt(wgsLon, wgsLat);
  }

  gcj_decrypt(gcjLon, gcjLat) {
    return GPS.gcj_decrypt(gcjLon, gcjLat);
  }

  formatArea() {
    if (!this._lPolygon) {
      return 0;
    }
    if (!this._lPolygon.getGeometry()) {
      return 0;
    }
    return formatArea(this._lPolygon.getGeometry());
  }

  formatLength() {
    if (!this._lPolygon) {
      return 0;
    }
    if (!this._lPolygon.getGeometry()) {
      return 0;
    }
    return formatLength(this._lPolygon.getGeometry());
  }

  createPolylinePointList(data, isGCJ02Point = false, isFit = true, callback = null) {
    let polylines = new Array();
    const polylinePoints = createPolylinePoints(data, isGCJ02Point);
    polylines = addPolylinePoint(polylinePoints, this.map)
    const gpsPoints = createGPSPoints(data, isGCJ02Point, this.am);
    if (gpsPoints != null && isFit) {
      const amGpsArr = this.am.getLngLats();
      fitNew(this.map, [
        [amGpsArr[0], amGpsArr[1]],
        [amGpsArr[2], amGpsArr[3]]
      ]);
    }
    return polylines;
  }

  async setAreaCenterPoint() {
    let _code = '3301';
    if (window.localStorage.getItem('user')) {
      const user = JSON.parse(window.localStorage.getItem('user'));
      _code = user['areaCode'];
    }

    const {
      data
    } = await GetFarmlandCaptureCenterPoint({
      areaCode: _code
    });
    const {
      areaCode,
      areaName,
      centerLongitude,
      centerLatitude
    } = data;
    window.localStorage.setItem('createPointData', JSON.stringify(data));
  }

  async getAreaCenterPoint(isGCJ02Point = false) {
    if (!window.localStorage.getItem('createPointData')) {
      await this.setAreaCenterPoint();
    }
    const obj = JSON.parse(window.localStorage.getItem('createPointData'));
    if (isGCJ02Point) {
      const {
        lon,
        lat
      } = GPS.gcj_encrypt(obj.centerLongitude, obj.centerLatitude);
      obj.centerLongitude = lon;
      obj.centerLatitude = lat;
    }
    return obj;
  }

  removeAreaCenterPoint() {
    window.localStorage.removeItem('createPointData');
  }

  polygonStyle() {
    return polygonStyle;
  }

  removeMapsLayers() {
    const arrs = this.map.getLayers().getArray();
    for (let i = arrs.length; 0 <= i; i--) {
      this.map.removeLayer(arrs[i]);
    }
  }

  removeOverlays() {
    if (!this.map) {
      return;
    }
    const arrs = this.map.getOverlays().getArray();
    for (let i = arrs.length; 0 <= i; i--) {
      this.map.removeOverlay(arrs[i]);
    }
  }

  resetAM() {
    this.am = null;
    this.am = new AM();
  }

  createPolygonBoundary(geoJson, mode) {
    const polygonBoundary = createPolygonBoundary(geoJson, mode)
    this.polygonGeojsonArr.push(polygonBoundary);
    this.map.addLayer(polygonBoundary);
  }

  createPolylinePointListNew(data, optins, optins2 = {
    isGCJ02Point: false,
    isFit: false
  }) {
    let polylines = new Array();
    const polylinePoints = createPolylinePoints(data, false);
    polylines = addPolylinePointNew(polylinePoints, this.map, optins);
    const gpsPoints = createGPSPoints(data, false, this.am);
    if (gpsPoints != null && optins2.isFit) {
      const amGpsArr = this.am.getLngLats();
      fitNew(this.map, [
        [amGpsArr[0], amGpsArr[1]],
        [amGpsArr[2], amGpsArr[3]]
      ]);
    }
    return polylines;
  }

  createLPolygonNew(options, map) {
    this.lPolygonNewArr.push(new LPolygonNew(options, map));
  }
  setPolygonColor(id, colors = ['rgba(255,201,14, 0.4)', 'rgba(255,201,14, 1)']) {

    this.lPolygonNewArr.forEach(val => {
      if (val.Id == id) {
        val.setPolygonColor(colors);
        return;
      }
    });

  }

  setPolygonColorAll(colors = ['rgba(184, 233, 134, 0.56)', 'rgba(23, 168, 162, 0.56)']) {
    this.lPolygonNewArr.forEach(val => {
      val.setPolygonColor(colors);
    });
  }

  removePolygonNew() {
    this.lPolygonNewArr.forEach(val => {
      val.removePolygon();
      val = null;
    });
    this.lPolygonNewArr = [];
  }

  caculateLL(lat1, lng1, lat2, lng2) {
    return caculateLL(lat1, lng1, lat2, lng2);
  }

  get LPolygonNewArr() {
    return this.lPolygonNewArr;
  }
}

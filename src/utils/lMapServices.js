import 'ol/ol.css';
import LMap from '../../public/maps/mapService.js';
import mapConfig from '../../public/maps/mapConfig.js';
import LPolygon from '../../public/maps/lPolygon.js';
import {
  createGeoJson,
  createPolygonGeojson,
  createPolylinePoints,
  createGPSPoints,
  createPolygonBoundary,
  PolygonModel
} from '../../public/maps/lzh.js';
import LDraw from '../../public/maps/lDraw.js';

import MeasureTooltip from '../../public/maps/measureTooltip.js';
import HelpTooltip from '../../public/maps/helpTooltip.js';
import {
  formatArea,
  formatLength,
  getCenterPoint,
  fit as fitNew,
  polygonStyle
} from '../../public/maps/lzh.js';

import LMarker from '../../public/maps/lMarker.js';
import LModifyEvent from '../../public/maps/lModifyEvent.js';
import BingMapsServices from '../../public/maps/bingMapsServices.js';
import GPS from '../../public/maps/gps.js';
import {
  Polyline,
  addPolylinePoint
} from '../../public/maps/lPolyline.js';
import AM from '../../public/maps/am.js';
import {
  getAreaCenter
} from '../api/fields/fieldsListApi.js';

export default {
  map: null,
  _lPolygon: null,
  _measureTooltip: null,
  type: 2,
  currentLayer: [false, false, true],
  polygonGeojsonArr: [],
  polygonGeojson: null,
  lModifyEventArr: [],
  lmap: null,
  lMEvent: null,
  am: new AM(),
  initMap(el, callback) {
    this.clear();
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
  },
  init(optins) {
    const {
      el,
      type,
      callback
    } = optins;
    if (type === 1) {
      this.initBingMap(el, callback);
    } else if (type == 2) {
      this.initVectorMap(el, callback);
    } else {
      this.initMap(el, callback);
    }
  },
  initBingMap(el, callback) {
    this.clear();
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
  },
  initVectorMap(el, callback) {
    this.clear();
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
  },
  getVectorLayerView() {
    return mapConfig.getVectorLayerView;
  },
  onSetLayers(type) {
    this.type = type;
    this.currentLayer = this.currentLayer.map(r => r = false);
    this.currentLayer[type] = true;
    this.removeLayers(type);
    this.addLayers(type);
  },

  removeLayers(type) {
    mapConfig.TMapLayerArr[type].forEach((val, key) => {
      this.map.removeLayer(val);
    });
  },

  addLayers(type) {
    mapConfig.TMapLayerArr[type].forEach((val, key) => {
      this.map.addLayer(val);
    });
  },

  onCreatePolygon(callback) {
    if (this._lPolygon) {
      this.clearlPolygon();
      // this._removeMeasureTooltip();
    }
    const _this = this;
    this._lPolygon = new LPolygon('Polygon', this.map, (obj) => {
      // const _point = obj.feature.getGeometry();
      // console.log(_point.getCoordinates());
      // const [x, y] = getCenterPoint(_point.getCoordinates());
      // _this._helpTooltip = _this._createMeasureTooltip();
      // _this._helpTooltip.setHtml(formatArea(_point));
      // _this.map.addOverlay(_this._helpTooltip.getMarker());
      // _this._helpTooltip.setPosition([x, y]);
    });

    if (callback) {
      callback();
    }

  },

  onCancel() {
    if (this._lPolygon) {
      this._lPolygon.removeLastPoint();
    }
  },

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
  },

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
  },

  getGeoJsonNew(index) {
    if (this.polygonGeojson) {
      const polygon = this.polygonGeojson;
      const geojson = createGeoJson(polygon.getSource().getFeatures()[0].getGeometry().getCoordinates(), {
        ruleId: '',
        centerlon: 0,
        centerlat: 0
      });
      return geojson;
    }
    return null;
  },
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
  },

  onCreateArea() {
    if (this.map) {
      new LDraw('Polygon', e => {}, this.map);
    }
  },

  clearlPolygon() {
    if (this.map && this._lPolygon) {
      this._lPolygon.remove();
      this._lPolygon = null;
    }
  },

  _createMeasureTooltip() {
    const marker = new MeasureTooltip();
    marker.setOffset([0, -30]);
    this._measureTooltip = marker;
    return marker;
  },

  _removeMeasureTooltip() {
    if (this.map) {
      if (this._measureTooltip) {
        this.map.removeOverlay(this._measureTooltip.getMarker());
      }
    }
  },
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
  },
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
  },

  removePolygonGeojsons() {
    if (!this.polygonGeojsonArr.length) {
      return;
    }
    let item = null
    while (item = this.polygonGeojsonArr.shift()) {
      this.map.removeLayer(item);
      item = null;
    }
  },

  removePolygonGeojsonNew() {
    if (!this.polygonGeojson) {
      return;
    }
    this.map.removeLayer(this.polygonGeojson);
    this.polygonGeojson = null;
  },

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
  },

  getMap() {
    return this.map;
  },
  setCenter([x, y], zoom) {
    if (!this.map) {
      return;
    }
    const view = this.map.getView();
    view.setCenter([x, y]);
    view.setZoom(zoom);
  },
  getCenter() {
    if (!this.map) {
      return;
    }
    const view = this.map.getView();
    let [x, y] = view.getCenter();
    return [x, y];
  },
  fit(coordinates) {
    fitNew(this.map, coordinates);
  },
  createMarker(imgSrc, width = 15, height = 15) {
    return new LMarker(imgSrc, width, height);
  },
  removeMarker(marker) {
    this.map.removeOverlay(marker.getMarker());
  },
  lModifyEventArr() {
    this.lModifyEventArr.length = 0;
    this.polygonGeojsonArr.forEach((item, key) => {
      const lMEvent = new LModifyEvent(item, this.map);
      lMEvent.setActive();
      this.lModifyEventArr.push(lMEvent);
    });
  },
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
  },
  lModifyEvent() {
    if (this.map && this.polygonGeojson) {
      const lMEvent = new LModifyEvent(this.polygonGeojson, this.map);
      lMEvent.setActive();
      this.lMEvent = lMEvent;
    }
  },
  removeLModifyEvent() {
    if (!this.lMEvent) {
      return;
    }
    this.lMEvent.setActive(false);
    this.lMEvent.remove();
  },
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

  },
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
  },

  gcj_encrypt: function(wgsLon, wgsLat) {
    return GPS.gcj_encrypt(wgsLon, wgsLat);
  },
  gcj_decrypt: function(gcjLon, gcjLat) {
    return GPS.gcj_decrypt(gcjLon, gcjLat);
  },
  formatArea: function() {
    if (!this._lPolygon) {
      return null;
    }
    return formatArea(this._lPolygon.getGeometry());
  },
  formatLength: function() {
    if (!this._lPolygon) {
      return null;
    }
    return formatLength(this._lPolygon.getGeometry());
  },
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
  },
  async setAreaCenterPoint() {
    let _code = '3301';
    if (window.localStorage.getItem('user')) {
      const user = JSON.parse(window.localStorage.getItem('user'));
      _code = user['districtId'];
    }
    const {
      data
    } = await getAreaCenter();
    const {
      areaCode,
      areaName,
      centerLongitude,
      centerLatitude
    } = data;
    window.localStorage.setItem('createPointData', JSON.stringify(data));
  },
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
  },
  removeAreaCenterPoint() {
    window.localStorage.removeItem('createPointData');
  },
  polygonStyle() {
    return polygonStyle;
  },
  removeMapsLayers() {
    const arrs = this.map.getLayers().getArray();
    for (let i = arrs.length; 0 <= i; i--) {
      this.map.removeLayer(arrs[i]);
    }
  },
  removeOverlays() {
    const arrs = this.map.getOverlays().getArray();
    for (let i = arrs.length; 0 <= i; i--) {
      this.map.removeOverlay(arrs[i]);
    }
  },
  createPolygonBoundary(geoJson, mode) {
    this.map.addLayer(createPolygonBoundary(geoJson, mode));
  }
}

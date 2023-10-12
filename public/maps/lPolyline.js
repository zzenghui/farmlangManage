import AM from './am.js';

import {
  Fill,
  Stroke,
  Style
} from 'ol/style';

import {
  Vector as VectorSource
} from 'ol/source';

import {
  Vector as VectorLayer
} from 'ol/layer';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';

export class Polyline {
  constructor(options, map) {
    this._layer = null;
    this._source = null;
    this._lineFeature = null;
    this._color = options.color;
    this._polylineWidth = options.width;
    this._pointArr = options.pointArr;
    this._zIndex = options.zIndex;
    this._id = options.id;
    this._map = map;
    this._lineString = null;
    this._createPolyline();
  }

  _createPolyline() {
    this._source = new VectorSource();
    this._layer = new VectorLayer({
      source: this._source,
      zIndex: this._zIndex,
      style: new Style({
        stroke: new Stroke({
          color: this._color,
          width: this._polylineWidth
        })
      })
    });
    const line = new LineString(this._pointArr);
    this._lineString=line;
    this._lineFeature = new Feature(line);
    if (this._id) {
      this._lineFeature.setId(this._id);
    }
    this._layer.getSource().addFeatures([this._lineFeature]);
    this._map.addLayer(this._layer);
  }

  setPolylineColor(color) {
    const style = this._layer.getStyle();
    const stroke = style.getStroke();
    stroke.setColor(color);
  }

  getLayer() {
    return this._layer;
  }

  setPolylineWidth(width) {
    const style = this._layer.getStyle();
    const stroke = style.getStroke();
    stroke.setWidth(width);
  }

  getPolylineColor() {
    const style = this._layer.getStyle();
    const stroke = style.getStroke();
    return stroke.getColor();
  }

  getPolylineWidth() {
    const style = this._layer.getStyle();
    const stroke = style.getStroke();
    return stroke.getWidth();
  }

  removePolyline() {
    this._map.removeLayer(this._layer);
    if(!this._lineFeature){return;}
    this._source.removeFeature(this._lineFeature);
    this._lineFeature = null;
    this._source = null;
    this._layer = null;
    this._lineString=null;
  }

  appendCoordinate(coordinate){
    this._lineString.appendCoordinate(coordinate);
  }

  get getLength() {
   return this._lineString.getCoordinates().length;
  }
}


export function getDeepColorNew(workstate, colors = ['blue', 'Lime']) {
  if (workstate) {
    return colors[1];
  } else {
    return colors[0];
  }
}

export function addPolylinePoint(workData, map, id = null, colors = ['blue', 'Lime']) {
  let tPolyline = null;
  const tPolylines = [];
  const points = workData.gpsPoints;
  const isNJOpt = workData.isNJOpt;
  let index = -1;
  if (points.length > 1) {
    let arry = [];
    let curColor;
    if (index === -1) {
      index = 0;
      arry.push(points[0]);
      arry.push(points[1]);
      curColor = getDeepColorNew(isNJOpt[1], colors);
      index = 1;
    } else {
      arry.push(points[index]);
      curColor = getDeepColorNew(isNJOpt[index + 1], colors);
    }

    for (let i = index + 1; i < points.length; i++) {
      const color = getDeepColorNew(isNJOpt[i], colors);
      if (color === curColor) {
        arry.push(points[i]);
      } else {
        tPolyline = new Polyline({
          color: curColor,
          width: 2,
          pointArr: arry,
          zIndex: isNJOpt[i] ? 10 : 1,
          id: id
        }, map);
        tPolylines.push(tPolyline);
        arry = [];
        arry.push(points[i - 1]);
        arry.push(points[i]);
        curColor = color;
      }
    }
    if (arry.length > 0) {
      tPolyline = new Polyline({
        color: curColor,
        width: 2,
        pointArr: arry,
        zIndex: isNJOpt[0] ? 10 : 1,
        id: id
      }, map);
      tPolylines.push(tPolyline);
    }
    index = points.length - 1;
  }
  return tPolylines;
}

export function addPolylinePointNew(workData,map, options) {
  let tPolyline = null;
  const tPolylines = [];
  const points = workData.gpsPoints;
  const isNJOpt = workData.isNJOpt;
  let index = -1;
  if (points.length > 1) {
    let arry = [];
    let curColor;
    if (index === -1) {
      index = 0;
      arry.push(points[0]);
      arry.push(points[1]);
      curColor = getDeepColorNew(isNJOpt[1], options.colors);
      index = 1;
    } else {
      arry.push(points[index]);
      curColor = getDeepColorNew(isNJOpt[index + 1], options.colors);
    }

    for (let i = index + 1; i < points.length; i++) {
      const color = getDeepColorNew(isNJOpt[i], options.colors);
      if (color === curColor) {
        arry.push(points[i]);
      } else {
        tPolyline = new Polyline({
          color: curColor,
          width: options.width,
          pointArr: arry,
          zIndex: options.zIndex,
          id: options.id
        }, map);
        tPolylines.push(tPolyline);
        arry = [];
        arry.push(points[i - 1]);
        arry.push(points[i]);
        curColor = color;
      }
    }
    if (arry.length > 0) {
      tPolyline = new Polyline({
        color: curColor,
        width: options.width,
        pointArr: arry,
        zIndex: options.zIndex,
        id: options.id
      }, map);
      tPolylines.push(tPolyline);
    }
    index = points.length - 1;
  }
  return tPolylines;
}

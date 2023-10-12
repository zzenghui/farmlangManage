import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';

export default class PolygonNew {

  constructor(options, map) {
    this._layer = null;
    this._source = null;
    this._lineFeature = null;
    this._fillColor = options.fillColor;
    this._stroke = options.stroke;
    this._width = options.width || 2;
    this._coordinates = options.coordinates;
    this._zIndex = options.zIndex;
    this._id = options.id;
    this._map = map;
    this._polygon = null;
    this._polygonFeature = null;
    this._lineDash = options.lineDash || [];
    this._isHidePolygon = options.isHidePolygon || false;
    this._ids = options.ids;
    this.isShowPolygon = false;
    this._createPolygon();
  }

  _createPolygon() {
    this._layer = new VectorLayer({
      source: new VectorSource(),
      style: this._createStyles(),
    });
    this._polygon = new Polygon(this._coordinates);
    this._polygonFeature = new Feature(this._polygon);
    if (this._id) {
      this._polygonFeature.setId(this._id);
    }
    this._layer.getSource().addFeature(this._polygonFeature);
    if (this._isHidePolygon) {
      return;
    }
    this._map.addLayer(this._layer);
  }

  _createStyles() {
    return new Style({
      fill: new Fill({
        color: this._fillColor
      }),
      stroke: new Stroke({
        color: this._stroke,
        width: this._width,
        lineDash: this._lineDash
      })
    })
  }

  getLayer() {
    return this._layer;
  }

  removePolygon() {
    this._map.removeLayer(this._layer);
    if (!this._lineFeature) {
      return;
    }
    this._source.removeFeature(this._polygonFeature);
    this._polygonFeature = null;
    this._source = null;
    this._layer = null;
    this._polygon = null;
  }

  setPolygonColor(colors = ['rgba(255, 255, 255, 0.3)', 'rgba(00, 131, 241, 1)']) {
    const style = this._layer.getStyle();
    const fill = style.getFill();
    fill.setColor(colors[0]);
    const stroke = style.getStroke();
    stroke.setColor(colors[1]);
  }

  show() {
    if (!this.isShowPolygon) {
      this._map.addLayer(this._layer);
      this.isShowPolygon = true;
    }
  }

  hide() {
    if (this.isShowPolygon) {
      this._map.removeLayer(this._layer);
      this.isShowPolygon = false;
    }
  }

  get Id() {
    return this._id;
  }

  get ShowState(){
    return this.isShowPolygon;
  }

  get Ids(){
    return this._ids;
  }


}

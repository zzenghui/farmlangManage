// import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import HelpTooltip from './helpTooltip';
import * as lzh from './lzh';
import MeasureTooltip from './measureTooltip';


export default class LDraw {
  constructor(darwType, callback, map, strokeColor, fillColor) {
    this._source = new VectorSource();
    this._vector = lzh.getVector(this._source);
    this._draw;
    this._sketch;
    this._measureTooltip;
    this._helpTooltip;
    this._pointerMoveHandler;
    this._darwType = darwType;
    this._callback = callback;
    this._map = map;
    this._strokeColor = strokeColor;
    this._fillColor = fillColor;
    this._init();
  }

  _init() {
    this._addInteraction();
  }
  _addInteraction() {
    this._pointerMoveHandler = evt => {
      if (evt.dragging) {
        return;
      }
      let helpMsg = '点击绘制图形';
      if (this._sketch) {
        helpMsg = '单击继续绘制，双击结束测量';
      }
      this._helpTooltip.getDom().innerHTML = helpMsg;
      this._helpTooltip.setPosition(evt.coordinate);
    };
    this._map.addLayer(this._vector);
    this._map.on('pointermove', this._pointerMoveHandler);
    this._draw = lzh.addInteraction(this._darwType, this._source, this._fillColor, this._strokeColor);
    this._map.addInteraction(this._draw);
    this._createMarker();
    this._drawBinDrawstart();
    this._drawBinDrawend();
    
  }
  _createMarker() {
    this._measureTooltip = new MeasureTooltip();
    this._measureTooltip.setOffset([0, -30]);
    this._map.addOverlay(this._measureTooltip.getMarker());
    this._helpTooltip = new HelpTooltip();
    this._helpTooltip.setOffset([10, 0]);
    this._map.addOverlay(this._helpTooltip.getMarker());
  }

  _drawBinDrawstart() {
    this._draw.once('drawstart', evt => {
      this._sketch = evt.feature;
      let tooltipCoord = evt.coordinate;
      this._sketch.getGeometry().on('change', e => {
        const geom = e.target;
        if (geom instanceof Polygon) {
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          tooltipCoord = geom.getLastCoordinate();
        }
        this._measureTooltip.getDom().innerHTML = lzh._arr[this._darwType](geom);
        this._measureTooltip.setPosition(tooltipCoord);
      });
    }, this);
  }

  _drawBinDrawend() {
    this._draw.once('drawend', e => {
      this._map.removeInteraction(this._draw);
      this._measureTooltip.getDom().appendChild(lzh.createSpan(this));
      this._map.un('pointermove', this._pointerMoveHandler);
      this._map.removeOverlay(this._helpTooltip.getMarker());
      this._helpTooltip = null;
      this._sketch = null;
      this._callback(e);
    }, this);
  }
  
  _clear() {
    this._map.removeLayer(this._vector);
    this._map.removeOverlay(this._measureTooltip.getMarker());
    this._measureTooltip = null;
    this._vector = null;
    this._source = null;
  }
  getDraw() {
    return this._vector;
  }
}

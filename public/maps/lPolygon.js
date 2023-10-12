import {
	Circle as CircleStyle,
	Fill,
	Stroke,
	Style,
	Text,
	RegularShape,
} from 'ol/style';

import {
  Draw,
  Modify,
  Snap
} from 'ol/interaction';
import {
  OSM,
  Vector as VectorSource
} from 'ol/source';
import {
  Vector as VectorLayer
} from 'ol/layer';

import {
  getCenterPoint,
  formatArea,
  formatLength
} from './lzh.js';

import {
  isTruePolygon
} from './isTruePolygon.js';

import CheckPoint from './checkPoint.js';
import {
  getCenter,
  getHeight,
  getWidth
} from 'ol/extent';

import Polygon from 'ol/geom/Polygon';

import Point from 'ol/geom/Point';

import MultiPoint from 'ol/geom/MultiPoint';

import LineString from 'ol/geom/LineString';


 const segmentStyle = new Style({
   text: new Text({
     fill: new Fill({
       color: 'rgba(255, 255, 255, 1)',
     }),
     padding: [2, 2, 2, 2],
     textBaseline: 'bottom',
     offsetY: -20,
   }),
 });



 const segmentStyles = [segmentStyle];

export function calculateCenter(geometry) {
  let center, coordinates, minRadius;
  const type = geometry.getType();
  if (type === 'Polygon') {
    let x = 0;
    let y = 0;
    let i = 0;
    coordinates = geometry.getCoordinates()[0].slice(1);
    coordinates.forEach(function(coordinate) {
      x += coordinate[0];
      y += coordinate[1];
      i++;
    });
    center = [x / i, y / i];
  } else if (type === 'LineString') {
    center = geometry.getCoordinateAt(0.5);
    coordinates = geometry.getCoordinates();
  } else {
    center = getCenter(geometry.getExtent());
  }
  let sqDistances;
  if (coordinates) {
    sqDistances = coordinates.map(function(coordinate) {
      const dx = coordinate[0] - center[0];
      const dy = coordinate[1] - center[1];
      return dx * dx + dy * dy;
    });
    minRadius = Math.sqrt(Math.max.apply(Math, sqDistances)) / 3;
  } else {
    minRadius =
      Math.max(
        getWidth(geometry.getExtent()),
        getHeight(geometry.getExtent())
      ) / 3;
  }
  return {
    center: center,
    coordinates: coordinates,
    minRadius: minRadius,
    sqDistances: sqDistances,
  };
}

export default class LPolygon {

  constructor(darwType, map, callback, strokeColor = 'rgba(255,201,14, 1)', fillColor = 'rgba(255,201,14, 0.4)') {
    this._map = map;
    this._source = null;
    this._vector = null;
    this._modify = null;
    this._snap = null;
    this._draw = null;
    this._callback = callback;
    this._strokeColor = strokeColor;
    this._fillColor = fillColor;
    this._darwType = darwType;
    this._checkPoint = null;
    this._checkPointArea = null;
    this._createVectorSource();
    this._createVectorLayer();
    this._createModify();
    this._createSnap();
    this._createDraw();
    this._addLayer();
    this._addInteraction();
    this._drawBinDrawend();
    this._drawBinDrawstart();
    this._isTruePolygon = false;
  }
  _createVectorSource() {
    this._source = new VectorSource();
  }

  _createVectorLayer() {
    this._vector = new VectorLayer({
      source: this._source,
     style: (feature,segments) => {

        const geometry = feature.getGeometry();
         const point = geometry.getInteriorPoint();
         let arr = geometry.getCoordinates()[0];
         const line = new LineString(geometry.getCoordinates()[0]);

        if (this._id) {
        	feature.setId(this._id);
        }

        const result = calculateCenter(feature.getGeometry());

        const {
        	coordinates,
        	center
        } = result;
        const b = isTruePolygon(coordinates);
        this._isTruePolygon = b;
        const styles = [this.getStyle(b)];

        const text =  `${formatArea(feature.getGeometry())}`;
        if (!this._checkPointArea) {
         this._checkPointArea =  this.createCheckPoint(text, center);
        } else {
          this._checkPointArea.setText(text);
          this._checkPointArea.setPosition(center);
        }

        if (!b && coordinates) {
        	if (!this._checkPoint && coordinates.length > 2) {
        		this._checkPoint = this.createCheckPoint('多边形不合法', center);
        	} else if(this._checkPoint){
        		this._checkPoint.setPosition(center);
        		this._checkPoint.show();
        	}
        	if(this._checkPointArea){
        	  this._checkPointArea.hide();
        	}
        }

        if (b && this._checkPoint) {
        	this._checkPoint.hide();
        }

        if(b){
          if(this._checkPointArea){
            this._checkPointArea.show();
          }
        }

          if (segments && line) {
             let count = 0;
             line.forEachSegment((a, b) => {
               const segment = new LineString([a, b]);
               const label = formatLength(segment);
               if (segmentStyles.length - 1 < count) {
                 segmentStyles.push(segmentStyle.clone());
               }

               const segmentPoint = new Point(segment.getCoordinateAt(0.5));
               segmentStyles[count].setGeometry(segmentPoint);
               segmentStyles[count].getText().setText(label);
               styles.push(segmentStyles[count]);
               count++;
             });
           }
           let color= '#33cc33';

           styles.push(
           	new Style({
           		geometry: new MultiPoint(coordinates),
           		image: new CircleStyle({
           			radius: 4,
           			fill: new Fill({
           				color
           			}),
           	}),
           })
           );

        return styles;


        // const result = calculateCenter(feature.getGeometry());
        // const {
        //   coordinates,
        //   center
        // } = result;
        // // console.log('coordinates',coordinates);
        // const b = isTruePolygon(coordinates);
        // this._isTruePolygon = b;
        // if (!b) {
        //   if (!this._checkPoint) {
        //      this._checkPoint = this.createCheckPoint('多边形不合法', center);
        //   } else {
        //     this._checkPoint.show();
        //   }
        //   if(this._checkPointArea){
        //     this._checkPointArea.hide();
        //   }
        // }

        // if(b && this._checkPoint){
        //    this._checkPoint.hide();
        // }

        // if(b){
        //   if(this._checkPointArea){
        //     this._checkPointArea.show();
        //   }
        // }

        // return this.getStyle(b);
      },
    });

    // this._vector.on('change',(e)=> {
    //    console.log('change');
    // });
    // this._vector.on('propertychange',(e)=> {
    //    console.log('propertychange');
    // });
  }

  getStyle(b = true) {
    return new Style({
      fill: new Fill({
        color: b ? this._fillColor : 'rgba(255,0,0, 0.5)',
      }),
      stroke: new Stroke({
        color: b ? this._strokeColor : 'rgba(255,0,0, 0.5)',
        width: 1,
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33',
        }),
      }),
    })
  }

  _createModify() {
    this._modify = new Modify({
      source: this._source
    });
  }
  _createSnap() {
    this._snap = new Snap({
      source: this._source
    });
  }

  _drawBinDrawstart() {
    this._draw.once('drawstart', evt => {
      const sketch = evt.feature;
      let tooltipCoord = evt.coordinate;
      sketch.getGeometry().on('change', e => {
        const geom = e.target;

        if (geom instanceof Polygon) {
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
          const result = calculateCenter(sketch.getGeometry());
          const {
            coordinates,
            center
          } = result;

          const text =  `${formatArea(geom)}`;
          if (!this._checkPointArea) {
           this._checkPointArea =  this.createCheckPoint(text, center);
          } else {
            this._checkPointArea.setText(text);
            this._checkPointArea.setPosition(center);
          }
        }
      });
    }, this);
  }

  createCheckPoint(text, pointArr) {
    const checkPoint = new CheckPoint(` ${text}`, 12, "#fff");
    checkPoint.setOffset([0, -5]);
    checkPoint.setPosition(pointArr);
    // this._checkPoint = checkPoint;
    this._map.addOverlay(checkPoint.getMarker());
    return checkPoint;
  }

  _createDraw() {
    this._draw = new Draw({
      source: this._source,
      type: this._darwType,
      style: new Style({
      fill: new Fill({
        color: this._fillColor,
      }),
      stroke: new Stroke({
        color: this._strokeColor,
        width: 1,
      }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33',
          }),
        }),
      }),
    });

  }

  _addLayer() {
    this._map.addLayer(this._vector);
  }

  _addInteraction() {
    this._map.addInteraction(this._modify);
    this._map.addInteraction(this._draw);
    this._map.addInteraction(this._snap);
  }

  _drawBinDrawend() {
    this._draw.once('drawend', e => {
      this._map.removeInteraction(this._draw);
      if (this._callback) {
        this._callback(e);
      }
    }, this);
  }


  remove() {
    this._map.removeInteraction(this._modify);
    this._map.removeInteraction(this._draw);
    this._map.removeInteraction(this._snap);
    this._map.removeLayer(this._vector);
    if (this._checkPoint) {
      this._map.removeOverlay(this._checkPoint.getMarker());
    }

    if (this._checkPointArea) {
      this._map.removeOverlay(this._checkPointArea.getMarker());
    }
    this._checkPointArea=null;
    this._checkPoint=null;
    this._modify = null;
    this._draw = null;
    this._vector = null;
  }

  removeLastPoint() {
    this._draw.removeLastPoint();
  }

  getCoordinates() {
    return this._vector.getSource().getFeatures()[0].getGeometry().getCoordinates();
  }

  getExtent() {
    return this._vector.getSource().getFeatures()[0].getGeometry().getExtent();
  }

  getCenterPoint() {
    return getCenterPoint(this.getCoordinates());
  }

  getGeometry() {
    if (!this._vector) {
      return null;
    }
    if (this._vector.getSource().getFeatures()[0]) {
      return this._vector.getSource().getFeatures()[0].getGeometry();
    }
    return null;
  }

  get isTruePolygon() {
    return this._isTruePolygon;
  }
}

import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from 'ol/layer/Vector';

import {
	Circle as CircleStyle,
	Fill,
	Stroke,
	Style,
	Text,
	RegularShape,
} from 'ol/style';


import {isTruePolygon} from './isTruePolygon.js';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import CheckPoint from './checkPoint.js';

import {
	calculateCenter
} from './lPolygon.js';

import {
  getCenterPoint,
  formatArea,
  formatLength
} from './lzh.js';

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

export default class PolygonGeojson {
	constructor(opt, map) {
		this._map = map;
		this._source = null;
		this._vector = null;
		this._modify = null;
		this._strokeColor = opt.strokeColor;
		this._fillColor = opt.fillColor;
		this._checkPoint = null;
		this._checkPointArea = null;
		this._id = opt.id;
		this.geoJson = opt.geoJson;
		this._isTruePolygon=false;
		this.createPolygonGeojson();
	}

	createPolygonGeojson() {
		this._createSource();
		this._createLayer();
	}

	_createSource() {
		this._source = new VectorSource({
			features: new GeoJSON().readFeatures(this.geoJson)
		});
	}

	_createLayer() {
		this._vector = new VectorLayer({
			source: this._source,
			style:  (feature,segments) => {
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
				
				// if (this._id) {
				// 	feature.setId(this._id);
				// }
    //            const result = calculateCenter(feature.getGeometry());
    //            const {coordinates,center} = result;
    //            const b = isTruePolygon(coordinates);
    //            this._isTruePolygon=b;
			 //   if(!b ){
			 //     if(!this._checkPoint){
			 //       this.createCheckPoint('多边形不合法',center);
			 //     }else{
			 //       this._checkPoint.show();
			 //     }
			 //   }
			   
			 //   if(b && this._checkPoint){
			 //      this._checkPoint.hide();
			 //   }
				// return this.getStyle(b);
				
			}
		});
		this._map.addLayer(this._vector);
	}


	createCheckPoint(text, pointArr) {
		const checkPoint = new CheckPoint(` ${text}`, 12, "#fff");
		checkPoint.setOffset([0, -5]);
		checkPoint.setPosition(pointArr);
		// this._checkPoint = checkPoint;
		this._map.addOverlay(checkPoint.getMarker());
		return checkPoint;
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
		});
	}


	getCoordinates() {
		return this._vector.getSource().getFeatures()[0].getGeometry().getCoordinates();
	}

	getExtent() {
		return this._vector.getSource().getFeatures()[0].getGeometry().getExtent();
	}

	get Vector() {
		return this._vector;
	}

   get isTruePolygon(){
    return this._isTruePolygon;
   }

	remove() {
		this._map.removeLayer(this._vector);
		
		if (this._checkPoint) {
		  this._map.removeOverlay(this._checkPoint.getMarker());
		}
		
		if (this._checkPointArea) {
		  this._map.removeOverlay(this._checkPointArea.getMarker());
		}
		this._checkPointArea=null;
		this._checkPoint=null;
		this._vector = null;
	}

}

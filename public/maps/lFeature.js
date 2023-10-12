import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';

import {
  Vector as VectorSource
} from 'ol/source';

import Point from 'ol/geom/Point';

export default class FeaturePolygon {

  constructor() {
    this._source = null;
    this._features = [];
  }

  createPolygon(coordinates, id) {
    const polygonFeature = new Feature(new Point(coordinates));
    if (id) {
      polygonFeature.setId(id);
    }
    this._features.push(polygonFeature);
  }

  getVectorSource(arr) {
    arr.forEach(val => {
      this.createPolygon(val.coordinates, val.id);
    });
    return new VectorSource({
      features: this._features,
    });
  }

}


export class FeaturePolygonModel {
   constructor(coordinates,id) {
       this.id=id;
       this.coordinates=coordinates;
   }
}

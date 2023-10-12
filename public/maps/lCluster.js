import {
  Circle as CircleStyle,
  Fill,
  RegularShape,
  Stroke,
  Style,
  Text,
} from 'ol/style';

import {
  Cluster,
  Vector as VectorSource
} from 'ol/source';

import {
  Select,
  defaults as defaultInteractions,
} from 'ol/interaction';

import {
  Tile as TileLayer,
  Vector as VectorLayer
} from 'ol/layer';

import {
  createEmpty,
  extend,
  getHeight,
  getWidth
} from 'ol/extent';

export default class LCluster {
  constructor(callback, options) {
    this.maxFeatureCount = 0;
    this.vector = null;
    this.vectorSource = null;
    this.currentResolution = 0;
    this.callback = callback;
    this._text = options.text;
    this.textFill = null;
    this.aggregationCallback = options.aggregationCallback;
    this.removeAggregationCallback = options.removeAggregationCallback;
    this.clearfeatureMap = new Map();
    this.featureMap = new Map();
    this._init();
    this.styleFunction = (feature, resolution) => {
      const size = feature.get('features').length;

      if (resolution != this.currentResolution) {
        this.calculateClusterInfo(resolution, size);
        this.currentResolution = resolution;
      }

      let style;
      let _feature = null;

      if (size > 1) {
        style = new Style({
          text: new Text({
            text: `${size.toString()}${this._text}`,
            fill: this.textFill,
          }),
        });
      } else {
        const originalFeature = feature.get('features')[0];
        style = null;
        // if (this.callback) {
        //   this.callback(originalFeature, resolution, true);
        // }

      }

      return style;
    }
  }

  _init() {
    this.textFill = new Fill({
      color: '#fff',
    });
  }


  calculateClusterInfo(resolution, size) {
    this.maxFeatureCount = 0;
    const features = this.vector.getSource().getFeatures();
    let feature, radius;

    for (let i = features.length - 1; i >= 0; --i) {
      feature = features[i];
      const originalFeatures = feature.get('features');
      const extent = createEmpty();
      let j, jj;
      let k = 0;
      let featureArr= [];
      for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
        if (this.callback) {
          featureArr.push(originalFeatures[j]);
          this.callback(originalFeatures[j], resolution, originalFeatures.length==1?true:false);
        }
        extend(extent, originalFeatures[j].getGeometry().getExtent());
      }
      if(this.aggregationCallback) {
         if(originalFeatures.length > 1  ) {
             this.aggregationCallback([...featureArr]);
         } else {
           if(this.removeAggregationCallback){
             this.removeAggregationCallback(featureArr[0]);
           }
         }
      }
      featureArr = [];
      // if(originalFeatures.length > 1){
      // console.log(`数组长度 ===${originalFeatures.length}`);
      // console.log(originalFeatures);
      //    this.aggregationCallback()
      // }

      this.maxFeatureCount = Math.max(this.maxFeatureCount, jj);
    }
  }

  getVectorLayer(vectorSource, distance = 30) {
    this.vector = new VectorLayer({
      zIndex:999,
      source: new Cluster({
        distance,
        source: vectorSource,
      }),
      style: this.styleFunction,
    });
    return this.vector;
  }

}

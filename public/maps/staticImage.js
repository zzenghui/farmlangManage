import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';


export default class StaticImage {

  constructor(options,map) {
    this._imageExtent = options.imageExtent;
    this._url = options.url;
    this._map = map;
    this._id = options.id;
    this._imageLayer = null;
    this._createImageLayer();
    // this.bingEvent();
  }

  _createImageLayer() {

    const imageLayer = new ImageLayer({
      source: new Static({
        url: this._url,
        projection: 'EPSG:4326',
        imageExtent: this._imageExtent,
      }),
      zIndex: 9,
    });

    this._imageLayer = imageLayer;

    if (this._id) {
      imageLayer.set('id', this._id);
    }

    this._map.addLayer(this._imageLayer);

  }

  removeImageLayer() {
    this._map.removeLayer(this._imageLayer);
    this._imageLayer = null;
  }

  createPolygonGeojsonNew(data, colors = ['rgba(255,201,14, 0.4)', 'rgba(255,201,14, 1)']) {
    this.lMap.createPolygonGeojsonNew(JSON.parse(data.geoJsonStr), colors[0], colors[1], data.id, true);
    const geo = JSON.parse(data.geoJsonStr);
    this.geoJson = geo;
    const [x, y] = geo.properties.center;
    if (x > 0 && y > 0) {
      this.x = x.toFixed(2);
      this.y = y.toFixed(2);
    }
  }

  get Id() {
    return this._Id;
  }

  bingEvent(){
    // this._createImageLayer('');
  //  this._imageLayer.on('click',(e) => {

  //  });
  }

  clear() {

  }

}

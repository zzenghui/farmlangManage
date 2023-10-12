import Map from 'ol/Map';
import BingMaps from 'ol/source/BingMaps';
import TileLayer from 'ol/layer/Tile';
import {
  ScaleLine
} from 'ol/control';

export default class {

  constructor(mapOptians) {
    this._ele = null;
    this._styles = [
      'Aerial',
      'AerialWithLabelsOnDemand',
    ];
    this._mapOptians = mapOptians;
  }
  async onLoad(el) {
    this._ele = el;
    const layers = this._init();
    return await new Promise((res, rej) => {
      const map = new Map(Object.assign({
        target: el,
        layers
      }, this._mapOptians));
      if (map) {
        map.addControl(new ScaleLine());
        res(map);
        return;
      }
      rej(null);
    });
  }

  _init() {
    const layers = [];
    for (let i = 0; i < this._styles.length; ++i) {
      layers.push(
        new TileLayer({
          visible: true,
          preload: Infinity,
          source: new BingMaps({
            key: 'Ah3ZzfSuKz6soXbxKk0Wm6GkK8T4hXi7qXkEE669fO1rZu69XE5hqe9Sgr8O2JxG',
            imagerySet: this._styles[i],
            culture: 'zh-cn',
          }),
        })
      );
    }
    return layers;
  }
}

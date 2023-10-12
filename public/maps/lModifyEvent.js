import {
  Modify,
  Select,
  Snap
} from 'ol/interaction';




export default class LModifyEvent {
  constructor(vectorLayer, map) {

    this._vector=vectorLayer.Vector;
    this._vectorLayer = vectorLayer.Vector;

    this._select = null;
    this._modify = null;
    this._snap = null;
    this._map = map;
    // this._createSelect();
    this._createModify();
    this._createSnap();
  }
  _createSelect() {

    this._select = new Select();
    this._map.addInteraction(this._select);
  }
  _createModify() {
    // this._modify = new Modify({
    //   features: this._select.getFeatures(),
    // });
   this._modify = new Modify({
    source: this._vectorLayer.getSource(),
   });
    this._map.addInteraction(this._modify);
  }

  _createSnap() {
    this._snap = new Snap({
      source: this._vectorLayer.getSource()
    });
    this._map.addInteraction(this._snap);
  }

  setActive(active = true) {
    // this._select.setActive(active);
    this._modify.setActive(active);
  }

  remove() {
    this._map.removeInteraction(this._modify);
    this._map.removeInteraction(this._snap);
  }
}

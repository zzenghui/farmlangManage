import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {
  defaults as Defaults
} from 'ol/control';
import {
  ScaleLine
} from 'ol/control';
import {
  defaults as interactionDefaults
} from 'ol/interaction';
// const scaleLine = new ScaleLine();

// const defa = new Defaults({
//   attribution: false,
//   rotate: false,
//   zoom: false
// });

// const interactionsDeft = new interactionDefaults({
//   altShiftDragRotate: false,
//   keyboard: false,
//   mouseWheelZoom: false,
//   doubleClickZoom: false,
//   pinchZoom: false,
//   shiftDragZoom: false,
//   dragPan: false
// });

// const view = new View({
//   projection: 'EPSG:4326',
//   center: [120.17550675, 30.189238500000002],
//   zoom: 10,
//   minZoom: 1,
//   maxZoom: 28,
// });

// const tmapNormal = new TileLayer({
//   source: new XYZ({
//     url: 'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=f079d151125a6fad4b5c379b147dcfda'
//   }),
//   zIndex: -10
// });


const imageURL = 'https://t7.tianditu.gov.cn/img_w/wmts?' +
  'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles' +
  '&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=f079d151125a6fad4b5c379b147dcfda';


// const tmapSatellite = new TileLayer({
//   source: new XYZ({
//     url: imageURL
//   }),
//   zIndex: -10
// });


// const tmapAnnotation = new TileLayer({
//   source: new XYZ({
//     url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=8b00225817f9180eefe7661501017e74'
//   }),
//   zIndex: -10
// });

// const tMapLayerArr = [
//   [tmapNormal, tmapAnnotation],
//   [tmapSatellite],
//   [tmapSatellite, tmapAnnotation],
// ];

// const view2 = new View({
//   zoom: 1,
//   minZoom: 1,
//   maxZoom: 28,
//   center: [0, 0],
// });

export default class {
  // static _tMapLayerArr = tMapLayerArr;
  // static _view = view;
  // static _defaults = defa;
  // static _scaleLine = scaleLine;
  // static _interactionsDeft = interactionsDeft;
  constructor() {

  }


  static get TmapNormal() {
    return new TileLayer({
      source: new XYZ({
         url: 'https://t7.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=f079d151125a6fad4b5c379b147dcfda'
      }),
      zIndex: -10
    });
  }

  static get TmapSatellite() {
    return new TileLayer({
      source: new XYZ({
        url: imageURL
      }),
      zIndex: -10
    });
  }


  static get TmapAnnotation() {
   // https://t7.tianditu.gov.cn/DataServer?T=cva_w&x=3416&y=1680&l=12&tk=8b00225817f9180eefe7661501017e74
    return new TileLayer({
      source: new XYZ({
        url: 'https://t7.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=f079d151125a6fad4b5c379b147dcfda'
      }),
      zIndex: -10
    })
  }

  static get TMapLayerArr() {
    return [
      [this.TmapNormal, this.tmapAnnotation],
      [this.TmapSatellite],
      [this.TmapSatellite, this.TmapAnnotation],
    ];
  }

  static get View() {
    return new View({
      projection: 'EPSG:4326',
      center: [120.17550675, 30.189238500000002],
      zoom: 10,
      minZoom: 1,
      maxZoom: 21,
    });
  }
  static get Defaults() {
    return new Defaults({
      attribution: false,
      rotate: false,
      zoom: false
    });
  }
  static get ScaleLine() {
    return new ScaleLine();
  }
  static get InteractionsDeft() {
    return new interactionDefaults({
      altShiftDragRotate: false,
      keyboard: false,
      mouseWheelZoom: false,
      doubleClickZoom: false,
      pinchZoom: false,
      shiftDragZoom: false,
      dragPan: false
    });
  }
  static get getVectorLayerView() {
    return new View({
      zoom: 1,
      minZoom: 1,
      maxZoom: 28,
      center: [0, 0],
    });
  }
}

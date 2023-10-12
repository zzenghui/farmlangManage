
import { getArea, getLength } from "ol/sphere";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import Draw from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import * as olSphere from "ol/sphere";
import Polygon from "ol/geom/Polygon";
import Feature from "ol/Feature";


export function formatLength(line) {
  const length = getLength(line, {
    projection: "EPSG:4326"
  });
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(length * 100) / 100 + " " + "m";
  }
  return output;
}

export function formatArea(polygon) {
  const area = getArea(polygon, {
    projection: "EPSG:4326"
  });
 const num =(area / 666.67) * 100;
 return `${Math.floor(num)/ 100}亩`;
}

export const _arr = new Array();

_arr["LineString"] = formatLength;

_arr["Polygon"] = formatArea;

export function createSpan(deaw) {
  const span = document.createElement("sapn");
  span.innerHTML = " X ";
  span.style.position = "absolute";
  span.style.width = "14px";
  span.style.height = "14px";
  span.style.right = "4px";
  span.style.top = "4px";
  span.style.cursor = "pointer";
  span.style.backgroundColor = "#fff";
  span.style.color = "red";
  span.style.lineHeight = "14px";
  span.style.textAlign = "center";
  span.addEventListener(
    "click",
    e => {
      deaw._clear();
      e.stopPropagation();
    },
    false
  );
  return span;
}

export function getVector(source) {
  return new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.4)"
      }),
      stroke: new Stroke({
        color: "#ffcc33",
        width: 2
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: "#ffcc33"
        })
      })
    })
  });
}

export function addInteraction(
  darwType,
  source,
  fillColor = "rgba(255, 255, 255, 0.4)",
  strokeColor = "rgba(255, 204, 51, 0.5)"
) {
  const draw = new Draw({
    source: source,
    type: darwType,
    style: new Style({
      fill: new Fill({
        color: fillColor
      }),
      stroke: new Stroke({
        color: strokeColor,
        lineDash: [10, 10],
        width: 2
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: "rgba(255, 255, 255, 1)"
        }),
        fill: new Fill({
          color: "rgba(200, 200, 200, 0.6)"
        })
      })
    })
  });
  return draw;
}

export function addInteraction1(
  darwType,
  source,
  fillColor = "rgba(184, 233, 134, 0.56)",
  strokeColor = "rgba(23, 168, 162, 0.56)"
) {
  const draw = new Draw({
    source: source,
    type: darwType,
    style: new Style({
      fill: new Fill({
        color: fillColor
      }),
      stroke: new Stroke({
        color: strokeColor,
        lineDash: [10, 10],
        width: 2
      })
    })
  });
  return draw;
}

export function getCoordinates(pointArr) {
  const arr = new Array();
  for (let i = 0; i < pointArr.length; i += 2) {
    arr.push([pointArr[i], pointArr[i + 1]]);
  }
  return [arr];
}

export function createGeoJson(coordinates, properties = {}, type = "Polygon") {
  return {
    type: "Feature",
    // properties: properties,
    bbox: getLngAndLatMaxMin(coordinates),
    geometry: {
      type: type,
      coordinates: coordinates
    }
  };
}

export function getLngAndLatMaxMin(coordinates) {
  let xMax = 0;
  let xMin = 400;
  let yMax = 0;
  let yMin = 400;
  for (let i = 0; i < coordinates.length; i++) {
    for (let j = 0; j < coordinates[i].length; j++) {
      if (coordinates[i][j][0] > xMax) {
        xMax = coordinates[i][j][0];
      }
      if (coordinates[i][j][1] > yMax) {
        yMax = coordinates[i][j][1];
      }
      if (coordinates[i][j][0] < xMin) {
        xMin = coordinates[i][j][0];
      }
      if (coordinates[i][j][1] < yMin) {
        yMin = coordinates[i][j][1];
      }
    }
  }

  return [xMax, yMax, xMin === 400 ? 0 : xMin, yMin === 400 ? 0 : yMin];
}

export function rayCasting(p, poly) {
  const px = p.x;
  const py = p.y;
  let flag = false;

  for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
    const sx = poly[i].X,
      sy = poly[i].Y,
      tx = poly[j].X,
      ty = poly[j].Y;

    // 点与多边形顶点重合
    if ((sx === px && sy === py) || (tx === px && ty === py)) {
      return true;
    }

    // 判断线段两端点是否在射线两侧
    if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
      // 线段上与射线 Y 坐标相同的点的 X 坐标
      const x = sx + ((py - sy) * (tx - sx)) / (ty - sy);

      // 点在多边形的边上
      if (x === px) {
        return true;
      }

      // 射线穿过多边形的边界
      if (x > px) {
        flag = !flag;
      }
    }
  }

  // 射线穿过多边形边界的次数为奇数时点在多边形内
  return flag ? true : false;
}

export function createPolygonGeojson(
  geoJsonObj,
  fillColor = "rgba(41, 212, 178, 0.4)",
  stroke = "rgba(23, 168, 162, 1)",
  id,
  isSetId = false,
  lineDash = []
) {
  const styles = {
    Polygon: new Style({
      fill: new Fill({
        color: fillColor
      }),
      stroke: new Stroke({
        color: stroke,
        width: 2,
        lineDash
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: "#ffcc33"
        })
      })
    })
  };
  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(geoJsonObj)
  });

  return new VectorLayer({
    source: vectorSource,
    style: function(feature) {
      if (isSetId) {
        feature.setId(id);
      }
      return styles[feature.getGeometry().getType()];
    }
  });
}

export function zoomIn(map) {
  const view = map.getView();
  view.animate({
    zoom: view.getZoom() + 1,
    duration: 200
  });
}

export function zoomOut(map) {
  const view = map.getView();
  view.animate({
    zoom: view.getZoom() - 1,
    duration: 200
  });
}

export function getCenterPoint(path) {
  let x = 0.0;
  let y = 0.0;
  for (let i = 0; i < path.length; i++) {
    for (let j = 0; j < path[i].length; j++) {
      x = x + parseFloat(path[i][j][0]);
      y = y + parseFloat(path[i][j][1]);
    }
  }
  x = x / path[0].length;
  y = y / path[0].length;
  return [x, y];
}

export function createGPSPoints(
  gpscoordinatelist,
  isGCJ02Point = false,
  am = null
) {
  const gpspoints = [];
  for (let i = 0; i < gpscoordinatelist.length; i++) {
    const item = gpscoordinatelist[i];
    const lng = item.X;
    const lat = item.Y;
    if (
      lng != null &&
      lng != "" &&
      lng != 0 &&
      lat != null &&
      lat != "" &&
      lat != 0
    ) {
      if (am != null) {
        am.getLngAndLatMaxMin(item);
      }
      if (isGCJ02Point) {
        const obj = GPS.gcj_encrypt(lat, lng);
        gpspoints.push([obj.lon, obj.lat]);
      } else {
        gpspoints.push([lng, lat]);
      }
    }
  }
  return gpspoints;
}

export function createPolylinePoints(
  amworkdatalist,
  isGCJ02Point = false,
  callback = null
) {
  const PolylinePoints = {
    gpsPoints: [],
    optRtDephts: [],
    isNJOpt: [],
    IsInFence: [],
    IsOverSpeed: []
  };
  PolylinePoints.gpsPoints = createGPSPoints(amworkdatalist, isGCJ02Point);
  for (let i = 0; i < amworkdatalist.length; i++) {
    if (amworkdatalist[i].OptRtDepth) {
      PolylinePoints.optRtDephts.push(amworkdatalist[i].OptRtDepth);
    }

    if (amworkdatalist[i].isNJOpt == true) {
      PolylinePoints.isNJOpt.push(amworkdatalist[i].isNJOpt);
    } else {
      if (amworkdatalist[i].isNJOpt == false) {
        PolylinePoints.isNJOpt.push(amworkdatalist[i].isNJOpt);
      }
    }

    if (amworkdatalist[i].IsInFence == true) {
      PolylinePoints.isNJOpt.push(amworkdatalist[i].IsInFence);
    } else if (amworkdatalist[i].IsInFence == false) {
      PolylinePoints.isNJOpt.push(amworkdatalist[i].IsInFence);
    }

    if (amworkdatalist[i].IsOverSpeed == true) {
      PolylinePoints.isNJOpt.push(amworkdatalist[i].IsOverSpeed);
    } else if (amworkdatalist[i].IsOverSpeed == false) {
      PolylinePoints.isNJOpt.push(amworkdatalist[i].IsOverSpeed);
    }

    if (callback) {
      if (parseInt(amworkdatalist[i].PId) > 0) {
        const x = parseFloat(amworkdatalist[i].X);
        const y = parseFloat(amworkdatalist[i].Y);
        if (x && y) {
          callback.call(this, amworkdatalist[i].PId, [x, y]);
        }
      }
    }
  }
  return PolylinePoints;
}

export function fit(map, points, opts) {
  const len = points.length;
  if (len <= 0) {
    return;
  }
  opts = opts || {};

  let way = opts.way;
  if (way === undefined) {
    way = 1;
  }
  const padding = opts.padding || [50, 50, 50, 50];
  let minLng = 180,
    maxLng = -180,
    minLat = 180,
    maxLat = -180,
    sumLng = 0,
    sumLat = 0;
  for (let i = 0; i < len; i++) {
    const lng = points[i][0];
    const lat = points[i][1];
    sumLng += lng;
    sumLat += lat;
    if (lng > maxLng) {
      maxLng = lng;
    }
    if (lng < minLng) {
      minLng = lng;
    }
    if (lat > maxLat) {
      maxLat = lat;
    }
    if (lat < minLat) {
      minLat = lat;
    }
  }
  const view = map.getView();

  switch (way) {
    case 1: {
      view.fit([minLng, minLat, maxLng, maxLat], {
        padding: padding
      });
      break;
    }
    case 2: {
      const center = [sumLng / len, sumLat / len];
      const length = new olSphere(6378137).haversineDistance(
        [minLng, minLat],
        [maxLng, maxLat]
      );
      const zoom = 18 - Math.floor(length / 3000);
      view.setCenter(center);
      view.setZoom(zoom);
      break;
    }
  }
}

export function createRectangle(
  coordinates,
  strokeColor = "transparent",
  fillColor = "transparent"
) {
  let polygon = null;
  let polygonFeature = null;
  let layer = null;
  const minPixel = coordinates.pointmaxs;
  const maxPixel = coordinates.pointmins;
  const style = new Style({
    stroke: new Stroke({
      width: 1,
      color: strokeColor
    }),
    fill: new Fill({
      color: fillColor
    })
  });

  if (!layer) {
    layer = new VectorLayer({
      source: new VectorSource(),
      style: style
    });
  }
  if (!polygon) {
    polygon = new Polygon([
      [
        minPixel,
        [maxPixel[0], minPixel[1]],
        maxPixel,
        [minPixel[0], maxPixel[1]],
        minPixel
      ]
    ]);
    // polygon.setCoordinates([[minPixel, [maxPixel[0], minPixel[1]], maxPixel, [minPixel[0], maxPixel[1]], minPixel]]);
  }
  if (!polygonFeature) {
    polygonFeature = new Feature(polygon);
    layer.getSource().addFeature(polygonFeature);
  }
  return layer;
}

export function getColorStyle(feature, colorData) {
  const color = colorData[feature.get("code")];

  if (!color) {
    return "#62e4c7";
  }
  return color;
}

export let colorArr = ["#62e4c7", "#44cfbb", "#28baaf", "#13aba6", "#0e9b95"];

export function createFill(feature) {
  return new Fill({
    color: getColorStyle.apply(this, [feature, colorArr])
  });
}

export function polygonStyle(feature, color) {
  return new Style({
    stroke: new Stroke({
      color: "transparent",
      width: 1
    }),
    fill: createFill.apply(this, [feature])
  });
}

export function getLayer(
  geoJSNO,
  fillColor = "#62e4c7",
  stroke = "transparent"
  // fillColor = "red",
  // stroke = "red"
) {
  const styles = {
    Polygon: new Style({
      fill: new Fill({
        color: fillColor
      }),
      stroke: new Stroke({
        color: stroke,
        width: 2
      })
    })
  };

  const la = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(geoJSNO)
    }),
    style: feature => {

      return styles[feature.getGeometry().getType()];
    }
  });
  return la;
}

export function getLayerNew(
  geoJSNO,
  fillColor = "red",
  stroke = "transparent"
) {
  const styles = {
    Polygon: new Style({
      fill: new Fill({
        color: fillColor
      }),
      stroke: new Stroke({
        color: stroke,
        width: 2
      })
    })
  };

  const la = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(geoJSNO)
    }),
    style: feature => {
      return styles[feature.getGeometry().getType()];
    },
    zIndex: 99
  });

  return la;
}

export function flyTo(
  location,
  view,
  options = {
    done,
    duration: 3000,
    parts: 2,
    called: false
  }
) {
  const duration = options.duration;
  const zoom = view.getZoom();

  const parts = options.parts;
  const called = options.called;
  const done = options.done;
  const callback = complete => {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
      if (done) {
        done(complete);
      }
    }
  };
  view.animate(
    {
      center: location,
      duration: duration
    },
    callback
  );
  view.animate(
    {
      zoom: zoom - 1,
      duration: duration / 2
    },
    {
      zoom: zoom,
      duration: duration / 2
    },
    callback
  );
}

export function tour(pointsArr, callback) {
  var london = fromLonLat([-0.12755, 51.507222]);
  var moscow = fromLonLat([37.6178, 55.7517]);
  var istanbul = fromLonLat([28.9744, 41.0128]);
  var rome = fromLonLat([12.5, 41.9]);
  var bern = fromLonLat([7.4458, 46.95]);

  var locations = [london, bern, rome, moscow, istanbul];
  var index = -1;

  const next = more => {
    if (more) {
      ++index;
      if (index < locations.length) {
        var delay = index === 0 ? 0 : 750;
        setTimeout(() => {
          flyTo(locations[index], this.view, {
            done: next,
            duration: 3000,
            parts: 2,
            called: false
          });
        }, delay);
      } else {
        if (callback) {
          callback(true);
        }
      }
    } else {
      if (callback) {
        callback(false);
      }
    }
  };
  next(true);
}

export class PolygonModel {
  constructor(
    options = {
      id: "",
      fillColor: "rgba(41, 212, 178, 0.4)",
      stroke: "rgba(23, 168, 162, 1)",
      strokeWidth: 2,
      isSetId: false,
      lineDash: new Array()
    }
  ) {
    this.fillColor = options.fillColor;
    this.stroke = options.stroke;
    this.id = options.id;
    this.isSetId = options.isSetId;
    this.lineDash = options.lineDash;
    this.strokeWidth = options.strokeWidth;
  }
}

export function createPolygonBoundary(
  geoJsonObj,
  polygonModel = new PolygonModel()
) {

  const polygonStyle = new Style({
    fill: new Fill({
      color: polygonModel.fillColor
    }),
    stroke: new Stroke({
      color: polygonModel.stroke,
      width: polygonModel.strokeWidth,
      lineDash: polygonModel.lineDash
    })
  });
  // const styles = {
  //   Polygon: polygonStyle,
  //   MultiPolygon: polygonStyle
  // };
  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(geoJsonObj)
  });

  return new VectorLayer({
    source: vectorSource,
    style: function(feature) {
      if (polygonModel.isSetId) {
        feature.setId(polygonModel.id);
      }
      // return styles[feature.getGeometry().getType()];
      return polygonStyle
    }
  });
}


/**
 * 计算2点之间的距离 单位m
 */
export function caculateLL(lat1, lng1, lat2, lng2) {
let radLat1 = lat1 * Math.PI / 180.0;
let  radLat2 = lat2 * Math.PI / 180.0;
let  a = radLat1 - radLat2;
let  b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
let  s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
s = s * 6378.137;
s = Math.round(s * 10000) / 10;
return s;
}

export class SvgModel {
  constructor(
    size = [42, 42],
    padding = [0, 0, 0, 0],
    fill = '#0091FF',
    fillOpacity = 0.3,
    stroke = '#0091FF',
    strokeWidth = 1,
    background = 'transparent',
    precision = 3,
    output = 'string',
    radius = 5
  ) {
      this.size  = size,
      this.padding = padding;
      this.fill = fill;
      this.fillOpacity = fillOpacity;
      this.stroke = stroke;
      this.strokeWidth = strokeWidth;
      this.background = background;
      this.precision = precision;
      this.output = output;
      this.radius = radius;
  }
}

const _slicedToArray = function() {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

const svg = {};

svg.style = function(svgStr, option) {
  const fill = option.fill;
  const fillOpacity = option.fillOpacity;
  const stroke = option.stroke;
  const strokeWidth = option.strokeWidth;

  const styles = [svgStr.split('/>')[0]];
  styles.push('fill="' + fill + '"');
  styles.push('fill-opacity="' + fillOpacity + '"');
  styles.push('stroke="' + stroke + '"');
  styles.push('stroke-width="' + strokeWidth + '"');
  return styles.join(' ') + ' />';
};

svg.createCircle = function(point, option) {
  const _point = _slicedToArray(point, 2);

  const x = _point[0];
  const y = _point[1];
  const radius = option.radius;
  const precision = option.precision;

  const svgStr = '<circle cx="' + x.toFixed(precision) + '" cy="' + y.toFixed(precision) + '" r="' + radius.toFixed(
    precision) + '" />';
  return svg.style(svgStr, option);
};

svg.createPath = function(points, option) {
  const p = option.precision;
  // firefox cannot use common as splitor, so use space
  const pathd = points.map(function(pt, index) {
    return '' + (index === 0 ? 'M' : 'L') + pt[0].toFixed(p) + ' ' + pt[1].toFixed(p);
  }).join(' ');
  const svgStr = '<path d="' + pathd + '" />';
  return svg.style(svgStr, option);
};

// parse svg string to svg element
svg.parseSVG = function(s) {
  const div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
  div.innerHTML = s;
  const frag = document.createDocumentFragment();
  while (div.firstChild) {
    frag.appendChild(div.firstChild);
  }
  return frag;
};

function getExtent(points) {
  const extent = [Infinity, Infinity, -Infinity, -Infinity];
  points.forEach(function(pt) {
    const _pt = _slicedToArray(pt, 2);

    const x = _pt[0];
    const y = _pt[1];

    if (x < extent[0]) extent[0] = x;
    if (x > extent[2]) extent[2] = x;
    if (y < extent[1]) extent[1] = y;
    if (y > extent[3]) extent[3] = y;
  });
  return extent;
}

// get all points from geojson object
function getAllPoints(geojson) {
  // get all points from geojson object
  switch (geojson.type) {
    case 'Point': {
      return [geojson.coordinates];
    }
    case 'MultiPoint':
    case 'LineString': {
      return geojson.coordinates;
    }
    case 'MultiLineString':
    case 'Polygon': {
      const pointsArr = geojson.coordinates;
      return pointsArr.reduce(function(prev, item) {
        return prev.concat(item);
      }, pointsArr[0]);
    }
    case 'MultiPolygon': {
      const multiArr = geojson.coordinates;
      const arr = multiArr.reduce(function(prev, item) {
        return prev.concat(item);
      }, multiArr[0]);
      return arr.reduce(function(prev, item) {
        return prev.concat(item);
      }, arr[0]);
    }
    case 'GeometryCollection': {
      const geometries = geojson.geometries;
      const _pointsArr = geometries.map(function(geom) {
        return getAllPoints(geom);
      });
      return _pointsArr.reduce(function(prev, item) {
        return prev.concat(item);
      }, _pointsArr[0]);
    }
    case 'Feature': {
      return getAllPoints(geojson.geometry);
    }
    case 'FeatureCollection': {
      const features = geojson.features;
      const _pointsArr2 = features.map(function(feature) {
        return getAllPoints(feature);
      });
      return _pointsArr2.reduce(function(prev, item) {
        return prev.concat(item);
      }, _pointsArr2[0]);
    }
  }
}

function geoPointToPixelPoint(pt, geometrySize, xRes, yRes, res, extent, origin, padding) {
  const paddingLeft = padding[3];
  const paddingTop = padding[0];

  const _geometrySize = _slicedToArray(geometrySize, 2);

  const geometryWidth = _geometrySize[0];
  const geometryHeight = _geometrySize[1];

  let x = (pt[0] - origin[0]) / res + paddingLeft;
  let y = geometryHeight - (pt[1] - origin[1]) / res + paddingTop;
  if (xRes > yRes) {
    const dy = (geometryHeight - (extent[3] - extent[1]) / res) / 2;
    y = y - dy;
  } else {
    const dx = (geometryWidth - (extent[2] - extent[0]) / res) / 2;
    x = x + dx;
  }
  return [x, y];
}

// converter
const converter = {};

converter.convertBasicGeometry = function(points, basicGeometryType, option) {
  switch (basicGeometryType) {
    case 'Point': {
      return svg.createCircle(points[0], option);
    }
    case 'LineString': {
      return svg.createPath(points, option);
    }
    case 'Polygon': {
      return svg.createPath(points, option);
    }
  }
};

converter.getCommonOpt = function(geojson, option) {
  const _option$size = _slicedToArray(option.size, 2);

  const svgWidth = _option$size[0];
  const svgHeight = _option$size[1];

  const _option$padding = _slicedToArray(option.padding, 4);

  const paddingTop = _option$padding[0];
  const paddingRight = _option$padding[1];
  const paddingBottom = _option$padding[2];
  const paddingLeft = _option$padding[3];

  const geometryWidth = svgWidth - paddingLeft - paddingRight;
  const geometryHeight = svgHeight - paddingTop - paddingBottom;
  // get the extent
  const extent = getExtent(getAllPoints(geojson));
  // calculate resolution
  const xRes = (extent[2] - extent[0]) / geometryWidth; // x resolution
  const yRes = (extent[3] - extent[1]) / geometryHeight; // y resolution
  const res = xRes > yRes ? xRes : yRes; // max resolution

  const commonOpt = {
    xRes: xRes,
    yRes: yRes,
    res: res,
    extent: extent,
    origin: [extent[0], extent[1]],
    geometrySize: [geometryWidth, geometryHeight]
  };
  return commonOpt;
};

converter.convertPoint = function(geojson, option, commonOpt) {
  const xRes = commonOpt.xRes;
  const yRes = commonOpt.yRes;
  const res = commonOpt.res;
  const extent = commonOpt.extent;
  const origin = commonOpt.origin;
  const geometrySize = commonOpt.geometrySize;

  const center = geoPointToPixelPoint(geojson.coordinates, geometrySize, xRes, yRes, res, extent, origin, option
    .padding);
  return svg.createCircle(center, option);
};

converter.convertMultiPoint = function(geojson, option, commonOpt) {
  const xRes = commonOpt.xRes;
  const yRes = commonOpt.yRes;
  const res = commonOpt.res;
  const extent = commonOpt.extent;
  const origin = commonOpt.origin;
  const geometrySize = commonOpt.geometrySize;

  const svgStr = geojson.coordinates
    .map(function(pt) {
      return geoPointToPixelPoint(pt, geometrySize, xRes, yRes, res, extent, origin, option.padding);
    })
    .map(function(pt) {
      return svg.createCircle(pt, option);
    }).join('');
  return svgStr;
};

converter.convertLineString = function(geojson, option, commonOpt) {
  const xRes = commonOpt.xRes;
  const yRes = commonOpt.yRes;
  const res = commonOpt.res;
  const extent = commonOpt.extent;
  const origin = commonOpt.origin;
  const geometrySize = commonOpt.geometrySize;

  const coords = Array.isArray(geojson) ? geojson : geojson.coordinates;
  const pixelPoints = coords.map(function(pt) {
    return geoPointToPixelPoint(pt, geometrySize, xRes, yRes, res, extent, origin, option.padding);
  });
  const optionForLineString = {};
  Object.assign(optionForLineString, option);
  optionForLineString.fillOpacity = 0;
  return svg.createPath(pixelPoints, optionForLineString);
};

converter.convertMultiLineString = function(geojson, option, commonOpt) {
  return geojson.coordinates.map(function(points) {
    return converter.convertLineString(points, option, commonOpt);
  }).join('');
};

converter.convertPolygon = function(geojson, option, commonOpt) {
  const xRes = commonOpt.xRes;
  const yRes = commonOpt.yRes;
  const res = commonOpt.res;
  const extent = commonOpt.extent;
  const origin = commonOpt.origin;
  const geometrySize = commonOpt.geometrySize;

  const coords = Array.isArray(geojson) ? geojson : geojson.coordinates;

  // option for inner polygon
  const optionForInner = {};
  Object.assign(optionForInner, option);
  optionForInner.fill = option.background;
  optionForInner.fillOpacity = 1;

  return coords.map(function(points, index) {
    const pixelPoints = points.map(function(pt) {
      return geoPointToPixelPoint(pt, geometrySize, xRes, yRes, res, extent, origin, option.padding);
    });
    // the first polygon is outer polygon
    if (index == 0 || Array.isArray(geojson)) {
      return svg.createPath(pixelPoints, option);
    }
    // the others are inner polygon, so change their fill style
    return svg.createPath(pixelPoints, optionForInner);
  }).join('');
};

converter.convertMultiPolygon = function(geojson, option, commonOpt) {
  return geojson.coordinates.map(function(points, index) {
    return converter.convertPolygon(points, option, commonOpt);
  }).join('');
};

converter.convertGeometryCollection = function(geojson, option, commonOpt) {
  const geoms = geojson.geometries;
  return geoms.map(function(geom) {
    const funcName = 'convert' + geom.type;
    return converter[funcName](geom, option, commonOpt);
  }).join('');
};

converter.convertFeature = function(geojson, option, commonOpt) {
  const geom = geojson.geometry;
  const funcName = 'convert' + geom.type;
  return converter[funcName](geom, option, commonOpt);
};

converter.convertFeatureCollection = function(geojson, option, commonOpt) {
  const features = geojson.features;
  return features.map(function(feature) {
    return converter.convertFeature(feature, option, commonOpt);
  }).join('');
};

export const geo2svg = function(geojson, option) {
  const type = geojson.type;
  const funcName = 'convert' + type;
  if (!converter[funcName]) {
    throw new Error('The type of input object is not supported.');
  }
  const commonOpt = converter.getCommonOpt(geojson, option);
  // init option

  let fullSvgStr = '<svg xmlns="http://www.w3.org/2000/svg" style="background:' + option.background + '" width="' +
    option.size[0] + '" height="' + option.size[1] + '" >';

  let convert = converter[funcName];

  // handle one point
  // TODO more complicated situation
  if (type === 'Point' || type === 'GeometryCollection' && geojson.geometries.length === 1 && geojson.geometries[0]
    .type === 'Point' || type === 'FeatureCollection' && geojson.features.length === 1 && geojson.features[0].geometry
    .type === 'Point') {
    convert = function(geojson, option, commonOpt) {
      const xRes = commonOpt.xRes;
      const yRes = commonOpt.yRes;
      const res = commonOpt.res;
      const extent = commonOpt.extent;
      const origin = commonOpt.origin;
      const geometrySize = commonOpt.geometrySize;

      const _option$padding2 = _slicedToArray(option.padding, 4);

      const paddingTop = _option$padding2[0];
      const paddingRight = _option$padding2[1];
      const paddingBottom = _option$padding2[2];
      const paddingLeft = _option$padding2[3];

      const center = [paddingLeft + geometrySize[0] / 2, paddingTop + geometrySize[1] / 2];
      return svg.createCircle(center, option);
    };
  }

  const svgContent = convert(geojson, option, commonOpt);
  fullSvgStr += svgContent;
  fullSvgStr += '</svg>';
  let fullSvg = fullSvgStr;
  if (option.output == 'element') {
    fullSvg = svg.parseSVG(fullSvgStr);
  }
  return fullSvg;
};

export default  {
  PI: 3.14159265358979324,
  x_pi: 3.14159265358979324 * 3000.0 / 180.0,
  delta: function (lat, lon) {

    const a = 6378245.0;
    const ee = 0.00669342162296594323;
    let dLat = this.transformLat(lon - 105.0, lat - 35.0);
    let dLon = this.transformLon(lon - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * this.PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
    return {
      'lat': dLat,
      'lon': dLon
    };
  },
  // WGS-84 to GCJ-02
  gcj_encrypt: function (wgsLon, wgsLat) {
    if (this.outOfChina(wgsLat, wgsLon)) {
      return {
        'lon': wgsLon,
        'lat': wgsLat
      };
    }
    const d = this.delta(wgsLat, wgsLon);
    return {
      'lon': wgsLon + d.lon,
      'lat': wgsLat + d.lat
    };
  },
  // GCJ-02 to WGS-84
  gcj_decrypt: function (gcjLon,gcjLat) {
    if (this.outOfChina(gcjLat, gcjLon)) {
      return {
        'lon': gcjLon,
        'lat': gcjLat
      };
    }
    const d = this.delta(gcjLat, gcjLon);
    return {
      'lon': gcjLon - d.lon,
      'lat': gcjLat - d.lat
    };
  },
  // GCJ-02 to WGS-84 exactly
  gcj_decrypt_exact: function (gcjLat, gcjLon) {
    const initDelta = 0.01;
    const threshold = 0.000000001;
    let dLat = initDelta, dLon = initDelta;
    let mLat = gcjLat - dLat,
      mLon = gcjLon - dLon;
    let pLat = gcjLat + dLat,
      pLon = gcjLon + dLon;
    let wgsLat, wgsLon, i = 0;
    const b=1;
    while (b) {
      wgsLat = (mLat + pLat) / 2;
      wgsLon = (mLon + pLon) / 2;
      const tmp = this.gcj_encrypt(wgsLat, wgsLon)
      dLat = tmp.lat - gcjLat;
      dLon = tmp.lon - gcjLon;
      if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold)) {
        break;
      }
      if (dLat > 0) {
        pLat = wgsLat;
      } else {
        mLat = wgsLat;
      }
      if (dLon > 0) {
        pLon = wgsLon;
      } else {
        mLon = wgsLon;
      }
      if (++i > 10000) {
        break;
      }
    }

    return {
      'lat': wgsLat,
      'lon': wgsLon
    };
  },
  // GCJ-02 to BD-09
  bd_encrypt: function (gcjLat, gcjLon) {
    const x = gcjLon, y = gcjLat;
    const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
    const bdLon = z * Math.cos(theta) + 0.0065;
    const bdLat = z * Math.sin(theta) + 0.006;
    return {
      'lat': bdLat,
      'lon': bdLon
    };
  },

  // BD-09 to GCJ-02
  bd_decrypt: function (bdLat, bdLon) {
    const x = bdLon - 0.0065, y = bdLat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
    const gcjLon = z * Math.cos(theta);
    const gcjLat = z * Math.sin(theta);
    return {
      'lat': gcjLat,
      'lon': gcjLon
    };
  },
  distance: function (latA, logA, latB, logB) {
    const earthR = 6371000;
    const x = Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) * Math.cos((logA - logB) * Math.PI / 180);
    const y = Math.sin(latA * Math.PI / 180) * Math.sin(latB * Math.PI / 180);
    let s = x + y;
    if (s > 1) {
      s = 1;
    }
    if (s < -1) {
      s = -1;
    }
    const alpha = Math.acos(s);
    const distance = alpha * earthR;
    return distance;
  },
  outOfChina: function (lat, lon) {
    if (lon < 72.004 || lon > 137.8347) {
      return true;
    }
    if (lat < 0.8293 || lat > 55.8271) {
      return true;
    }
    return false;
  },
  transformLat: function (x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
    return ret;
  },
  transformLon: function (x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
    return ret;
  },

  gauss: function (longitude, latitude) {
    let projNo = 0;
    let zoneWide; // 带宽
    // var output = [];
    let longitude1, latitude1, longitude0, X0, Y0, xval, yval;
    let a, f, e2, ee, NN, T, C, A, M, iPI;
    iPI = 0.0174532925199433; // //3.1415926535898/180.0;
    zoneWide = 6; // 6度带宽
    a = 6378245.0;
    f = 1.0 / 298.3; // 扁率 54年北京坐标系参数
    // //a=6378140.0; f=1/298.257; //80年西安坐标系参数

    projNo = longitude / zoneWide;
    longitude0 = projNo * zoneWide + zoneWide / 2;
    longitude0 = longitude0 * iPI;
    longitude1 = longitude * iPI; // 经度转换为弧度
    latitude1 = latitude * iPI; // 纬度转换为弧度
    e2 = 2 * f - f * f; // 第一偏心率的平方
    ee = e2 / (1.0 - e2); // 第二偏心率的平方
    NN = a /
      Math.sqrt(1.0 - e2 * Math.sin(latitude1) *
        Math.sin(latitude1)); // 此处的 NN 应该就是 N
    T = Math.tan(latitude1) * Math.tan(latitude1);
    C = ee * Math.cos(latitude1) * Math.cos(latitude1);
    A = (longitude1 - longitude0) * Math.cos(latitude1);
    M = a *
      ((1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 * e2 * e2 / 256) *
        latitude1 -
        (3 * e2 / 8 + 3 * e2 * e2 / 32 + 45 * e2 * e2 * e2 /
          1024) * Math.sin(2 * latitude1) +
        (15 * e2 * e2 / 256 + 45 * e2 * e2 * e2 / 1024) *
        Math.sin(4 * latitude1) - (35 * e2 * e2 * e2 / 3072) *
        Math.sin(6 * latitude1));
    // 因为是以赤道为Y轴的，与我们南北为Y轴是相反的，所以xy与高斯投影的标准xy正好相反;
    xval = NN *
      (A + (1 - T + C) * A * A * A / 6 + (5 - 18 * T + T * T + 14 *
        C - 58 * T * C) *
        A * A * A * A * A / 120);
    yval = M +
      NN *
      Math.tan(latitude1) *
      (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24 + (61 -
        58 * T + T * T + 270 * C - 330 * T * C) *
        A * A * A * A * A * A / 720);
    X0 = 1000000 * (projNo + 1) + 500000;
    Y0 = 0;
    xval = xval + X0;
    yval = yval + Y0;

    return {
      'xval': xval,
      'yval': yval
    };
  },
  wgsToBd: function (lon, lat) {
    const temp = this.gcj_encrypt(parseFloat(lat), parseFloat(lon));
    const result = this.bd_encrypt(temp.lat, temp.lon);
    return result;
  },
  bdToWgs: function (lon, lat) {
    const temp = this.bd_decrypt(lat, lon);
    const result = this.gcj_decrypt(temp.lat, temp.lon);
    return result;
  },
  convertGCJ02: function (geoJson)  {
    const arr1 = new Array();
    const arr2 = new Array();
    const coordinates = geoJson.geometry.coordinates;
    const bbox = geoJson.bbox;
    if (bbox) {
      for (let i = 0; i < 2; i++) {
        const obj = this.gcj_encrypt(bbox[i + 1], bbox[i + i]);
        arr1.push(obj.lon, obj.lat);
      }
    }


    for (const item of coordinates) {
      for (const arr of item) {
        const { lat, lon } = GPS.gcj_encrypt(arr[1], arr[0]);
        arr2.push([lon, lat]);
      }
}
    geoJson.bbox = arr1;
    geoJson.geometry.coordinates = [arr2];
    return geoJson;
  }


};

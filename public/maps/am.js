export default class AM {
  constructor() {
    this.xMax = 0;
    this.xMin = 400;
    this.yMax = 0;
    this.yMin = 400;
  }
  getLngAndLatMaxMin(latlnt) {
    if (latlnt.X > this.xMax) {
      this.xMax = latlnt.X;
    }
    if (latlnt.Y > this.yMax) {
      this.yMax = latlnt.Y;
    }
    if (latlnt.X < this.xMin) {
      this.xMin = latlnt.X;
    }
    if (latlnt.Y < this.yMin) {
      this.yMin = latlnt.Y;
    }
  }

  getLngLats() {
    const arr = [];
    arr.push([this.xMax], [this.yMax]);
    arr.push([this.xMin], [this.yMin]);
    return arr;
  }
}

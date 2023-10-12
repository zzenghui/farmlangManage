import {LOverlay} from './lOverlay';


  export default class LMarker extends LOverlay {

    constructor(imgSrc, width=16,  height = 16) {
      super();
      this._imgSrc=imgSrc;
      this._width  = width;
      this._height = height;
      this.ele.style.position = 'relative';
      this.ele.style.cursor = 'pointer';
      this.ele.style.width = `${this._width}px`;
      this.ele.style.height = `${this._height}px`;
      this.ele.style.backgroundPosition = 'center center';
      this.ele.style.backgroundRepeat = 'no-repeat';
      this.ele.style.backgroundImage = `url(${this._imgSrc})`;
      this.ele.style.backgroundSize = '100% 100%';
    }
    setHTMLElementStyle() {
    }
    setImgSrc(src) {
      this.ele.style.backgroundImage = `url(${src})`;
    }
  }

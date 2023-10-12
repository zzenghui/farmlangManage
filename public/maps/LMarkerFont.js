import {
  LOverlay
} from './lOverlay';


export default class LMarkerFont extends LOverlay {

  constructor(iconFontName, width = 16, height = 16, fontSize = 16, color = '#237804') {
    super();
    this._iconFontName = iconFontName;
    this._width = width;
    this._height = height;
    this._fontSize= fontSize;
    this.ele.style.position = 'relative';
    this.ele.style.cursor = 'pointer';
    this.ele.style.width = `${this._width}px`;
    this.ele.style.height = `${this._height}px`;
    this.ele.style.lineHeight = `${this._height}px`;
    this.ele.style.backgroundPosition = 'center center';
    this.ele.style.backgroundRepeat = 'no-repeat';
    this.ele.style.fontSize=`${this._fontSize}px`;
    this.ele.style.backgroundColor = color;
    this.ele.style.color = "#fff";
    this.ele.style.borderRadius = "50%";
    this.ele.style.textAlign = ' center';
    this.ele.style.overflow = 'hidden';
    this.ele.className = this._iconFontName;
  }
  setHTMLElementStyle() {}
  setColor(color = '#D46B08') {
    this.ele.style.color = color;
  }

}

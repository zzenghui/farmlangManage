import {LOverlay} from './lOverlay';
export default class MeasureTooltip extends LOverlay {
    constructor() { super(); }
    setHTMLElementStyle() {
      this.ele.style.position = 'relative';
      this.ele.style.background = 'rgb(23, 168, 162)';
      this.ele.style.borderRadius = '4px';
      this.ele.style.color = '#fff';
      this.ele.style.padding = '4px 30px 4px 8px';
      this.ele.style.whiteSpace = 'nowrap';
    }
  }
  
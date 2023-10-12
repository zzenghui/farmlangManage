import { LOverlay } from './lOverlay';

export default class HelpTooltip extends LOverlay {
    constructor() { super(); }
    setHTMLElementStyle() {
        this.ele.style.position = 'relative';
        this.ele.style.background = 'rgba(0, 0, 0, 0.5)';
        this.ele.style.borderRadius = '4px';
        this.ele.style.color = '#fff';
        this.ele.style.padding = '4px 8px';
        this.ele.style.opacity = '0.7';
        this.ele.style.whiteSpace = 'nowrap';
    }
}


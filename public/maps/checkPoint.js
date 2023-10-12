import { LOverlay } from './lOverlay';

export default class CheckPoint extends LOverlay {

    constructor(text, fontSize = 12,color='#fff') {
        super();
        this.ele.style.fontSize =`${fontSize}px`;
        this.ele.innerText = text;
        this.ele.style.position = 'relative';
        this.ele.style.width = '260px';
        this.ele.style.height = '15px';
        // this.ele.style.borderRadius = '50%';
        this.ele.style.backgroundColor = 'transparent';
        this.ele.style.cursor = 'pointer';
        this.ele.style.lineHeight = '60px';
        this.ele.style.textAlign = 'center';
        this.ele.style.color = color;
    }
    setHTMLElementStyle() { }
}

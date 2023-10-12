import {
  LOverlay
} from './lOverlay';

export default class LMessage extends LOverlay {
  constructor(options, width = 180, height = 135) {
    super();
    this._data = options.data;
    this._width = width;
    this._height = height;
    this.ele.style.position = 'relative';
    this.ele.style.width = `${this._width}px`;
    this.ele.style.height = `${this._height}px`;
    this.ele.style.backgroundColor = 'rgba(0,0,0,0.4)';
    this.ele.style.padding=`20px`;
    this.ele.style.borderRadius='4px';
    this.ele.style.boxSizing='border-box';
    this._createUl();
  }
  setHTMLElementStyle() {}
  _createUl() {
    const _ul = document.createElement('ul');
    _ul.style.listStyle='none';
    this._data.forEach((val,index) => {
      const _li = document.createElement('li');
      _li.style.fontSize='18px';
      if(index !==0){
           _li.style.marginTop='10px';
      }
      const _label = document.createElement('label');
      const _span = document.createElement('span');
      _label.innerText = val.label;
      _span.innerText = val.value;
      _span.style.color='#fff';
      _span.style.marginLeft ='5px';
      _label.style.color='#fff';

      _li.appendChild(_label);
      _li.appendChild(_span);
      _ul.appendChild(_li);
    });
    this.ele.appendChild(_ul);
  }
}

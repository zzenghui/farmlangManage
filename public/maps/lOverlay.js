import Overlay from 'ol/Overlay';

/**
 * 抽象类
 */
export class LOverlay {
    // private _overlay: ol.Overlay;
    // private _func;
    // public _dragPan;
    // private _fun;
    // protected ele: HTMLElement = document.createElement('div');
    constructor() {
        this._overlay;
        this._func;
        this._dragPan;
        this._fun;
        this.ele = document.createElement('div');

        this._overlay = new Overlay({
            positioning: 'center-center',
            element: this.ele,
            stopEvent: false,
        });
        this.setHTMLElementStyle();
    }

    setId(id) {
        this.ele.id = id;
    }
    setIndex(index=10){

    }
    setAttribute(options) {
        const data = JSON.stringify(options);
        this.ele.setAttribute('data-op', data);
    }

    setOffset([x, y]) {
        this._overlay.setOffset([x, y]);
    }

    getAttribute() {
        return JSON.parse(this.ele.dataset.op);
    }

    setPosition([x, y]) {
        this._overlay.setPosition([x, y]);
    }

    getPosition() {
        return this._overlay.getPosition();
    }

    getMarker() {
        return this._overlay;
    }

    setText(text) {
        this.ele.innerText = text;
    }

    setHtml(html) {
        this.ele.innerHTML = html;
    }

    getId() {
        return this.ele.id;
    }

    binEvent(event, fun) {
        this._fun = fun;
        this.ele.addEventListener(event, this._fun, false);
    }

    hover(fnOver, fnOut) {
        if (fnOver) {
            this.ele.addEventListener('mouseover', fnOver, false);
        }
        if (fnOut) {
            this.ele.addEventListener('mouseout', fnOut, false);
        }
    }

    getDom() {
        return this.ele;
    }

    show() {
        this.ele.style.display = 'block';
    }

    hide() {
        this.ele.style.display = 'none';
    }

    startDrag(m) {
        const _this = this;
        _this.ele.style.cursor = 'move';
        m.binDraftingEvent();
        _this._func = function () {
            m.serMarkerArr(_this, this.id);
            _this._overlay.set('dragging', true);
        };
        _this.binEvent('mousedown', _this._func);
    }

    stopDrag(m) {
        this.ele.style.cursor = 'default';
        this.ele.removeEventListener('mousedown', this._func);
        m.removDraftingEvent();
    }

    removEvent(eventType) {
        if (this._fun) { this.ele.removeEventListener(eventType, this._fun); }
    }
}

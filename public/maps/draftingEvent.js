import DragPan from 'ol/interaction/DragPan';

export class DraftingEvent {

    constructor(map, callBack) {
        this._position = [];
        this._overlayArr = new Array();
        this._overlay = null;
        this._dragPan = null;
        this._moveFun = null;
        this._poinFun = null;
        this._map = map;
        this._callBack = callBack;
    }

    serMarkerArr(overlay, id) {
        const _this = this;
        _this._overlayArr[id] = overlay;
        _this._overlay = _this._overlayArr[id]._overlay;
        this._map.getInteractions().forEach(function (interaction) {
            if (interaction instanceof DragPan) {
                _this._dragPan = interaction;
            }
        });
        _this._dragPan.setActive(false);
    }

    binDraftingEvent() {
        const _this = this;
        _this._moveFun = function (evt) {
            if (_this._overlay) {
                if (_this._overlay.get('dragging') === true) {
                    _this._overlay.setPosition(evt.coordinate);
                    _this._position = evt.coordinate;
                    if (_this._callBack) { _this._callBack.call(this, _this._position); }
                }
            }
            return false;
        };
        _this._poinFun = function () {
            if (_this._overlay) {
                if (_this._overlay.get('dragging') === true) {
                    _this._dragPan.setActive(true);
                    _this._overlay.set('dragging', false);
                }
            }
            return false;
        };
         _this._map.on('pointermove', _this._moveFun);
        _this._map.on('pointerup', _this._poinFun);
    }

    removDraftingEvent() {
        if (typeof this._moveFun === 'function' && typeof this._poinFun === 'function') {
            this._map.un('pointermove', this._moveFun);
            this._map.un('pointerup', this._poinFun);
        }
    }
}
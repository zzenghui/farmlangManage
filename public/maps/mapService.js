
import Map from 'ol/Map';

export default class  {
    constructor(mapOptians) {
        this._ele = null;
        this._mapOptians = mapOptians;
    }
    async onLoad(el) {
        this._ele = el;
        return await new Promise((res, rej) => {
            const map = new Map(Object.assign({ target: el }, this._mapOptians));
            if (map) {
                res(map);
                return;
            }
            rej(null);
        });
    }
}

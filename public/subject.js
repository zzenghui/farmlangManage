
/**
 * 单例模式
 *  getInstance 通过该属性获取实例对象
 *  Subject 观察者
 *  订阅方法  subscribe(obs 消费者)
 *  取消 订阅 ubsubscribe(obs 消费者)
 *  取消所有订阅 ubsubscribeAll(obs 消费者)
 *  执行 next(optins 自定义参数)
 */


 export default  class Subject {    static  _instance=null;    constructor() {      this["\x5f\x6f\x62\x73\x65\x72\x76\x65"] = new window["\x41\x72\x72\x61\x79"]();    }    static get getInstance() {      if (!Subject["\x5f\x69\x6e\x73\x74\x61\x6e\x63\x65"]) {        Subject["\x5f\x69\x6e\x73\x74\x61\x6e\x63\x65"] = new Subject();      }      return Subject["\x5f\x69\x6e\x73\x74\x61\x6e\x63\x65"];    }    subscribe(observer) {      if (!this["\x5f\x6f\x62\x73\x65\x72\x76\x65"]["\x69\x6e\x63\x6c\x75\x64\x65\x73"](observer)) {        this["\x5f\x6f\x62\x73\x65\x72\x76\x65"]["\x70\x75\x73\x68"](observer);      }      return this;    }    unsubscribe(observer) {      const index = this["\x5f\x6f\x62\x73\x65\x72\x76\x65"]["\x66\x69\x6e\x64\x49\x6e\x64\x65\x78"](item => item === observer);      if (index > -1) {        this["\x5f\x6f\x62\x73\x65\x72\x76\x65"]["\x73\x70\x6c\x69\x63\x65"](index, 1);        return true;      }      return false;    }      unsubscribeAll() {        this["\x5f\x6f\x62\x73\x65\x72\x76\x65"]["\x66\x6f\x72\x45\x61\x63\x68"]((val, key) => {          this["\x5f\x6f\x62\x73\x65\x72\x76\x65"]["\x73\x6c\x69\x63\x65"](key, 1);        });        this["\x5f\x6f\x62\x73\x65\x72\x76\x65"]["\x6c\x65\x6e\x67\x74\x68"] = 0;      }    next(options) {      this["\x5f\x6f\x62\x73\x65\x72\x76\x65"]["\x66\x6f\x72\x45\x61\x63\x68"](val => {        val["\x6e\x65\x78\x74"](options);      });    }  }
 

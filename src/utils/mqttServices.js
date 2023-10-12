import mqtt from 'mqtt'
import {
  getMqttSettingsApi
} from '@/api/mqtt'



export default {
  mqttConnectUrl: '',
  mqttInfo: {
    clientId: '',
    // host: '',
    password: '',
    // port: undefined,
    username: '',
    // webSocketPort: undefined
  },
  loadingState: false,
  connectState: false,
  client: null,
  isTick:false,
  async load() {
    if (this.loadingState) {
      return;
    }
    await this.getMqttSettings();
    this._initMqtt();
  },
  async getMqttSettings() {
    const {
      data
    } = await getMqttSettingsApi();
    this.mqttInfo = data;
    this.mqttConnectUrl = `ws://${data.host}:${data.webSocketPort}/mqtt`;
    console.log(this.mqttConnectUrl);
    console.log(Object.assign({
      clean: true, // true: 清除会话, false: 保留会话
      connectTimeout: 4000, // 超时时间
    }, {
      ...this.mqttInfo
    }));
  },
  _initMqtt() {
    if (!this.mqttInfo) {
      return
    }
    const client = mqtt.connect(this.mqttConnectUrl, {
      clean: true, // true: 清除会话, false: 保留会话
      connectTimeout: 4000, // 超时时间
      // 认证信息
      clientId: this.mqttInfo.clientId,
      username: this.mqttInfo.username,
      password: this.mqttInfo.password,
    });
    if (client) {
      this.client = client;
      this.loadingState = true;
      this._connect();
    }
  },
  _connect() {
    if (!this.client) {
      return;
    }
    this.client.on('connect', (e) => {
      this.connectState = true;
      console.log('连接成功！！！');
    });
  },
  tick(terminalNo='0001001170616836') {
    if(this.isTick || !this.client){ return;  }
    this.isTick=true;
    this.client.subscribe(`ryan/terminal/tick/${terminalNo}`);
  },
  getClient(){
     return this.client;
  },
  unSubscribeTick(terminalNo='0001001170616836'){
    this.isTick=false;
    this.client.unsubscribe(`ryan/terminal/tick/${terminalNo}`);
  }
  // message(callback) {
  //   // if(!this.isMessage){ this.isMessage=false; }
  //   this.client.on('message', (topic, message) => {
  //     if(callback){

  //     }
  //     console.log(JSON.parse(message.toString()));
  //   });
  // }
}

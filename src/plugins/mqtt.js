import mqtt from 'mqtt'
import {
  getMqttSettingsApi
} from '@/api/mqtt'
import store from '../store';
export default {
  data() {
    return {
      // 连接 mqtt 参数
      mqttOptions: {
        clean: true, // true: 清除会话, false: 保留会话
        connectTimeout: 4000, // 超时时间
        // 认证信息
        clientId: '',
        username: '',
        password: '',
      },
      // mqtt 连接地址
      mqttConnectUrl: '',
      // 动态 mqttApi 接口获取的配置参数
      mqttInfo: {
        clientId: "",
        host: "",
        password: "",
        port: undefined,
        username: "",
        webSocketPort: undefined
      },
    }
  },
  mounted() {
    this.getMqttSettings()
  },
  methods: {
    async getMqttSettings() {
      const {
        data
      } = await getMqttSettingsApi();
      this.mqttInfo = data;
      this.mqttConnectUrl = `ws://${data.host}:${data.webSocketPort}/mqtt`
      this.initMqtt();
    },
    initMqtt() {
      console.log('this.mqttConnectUrl', this.mqttConnectUrl)
      const client = mqtt.connect(this.mqttConnectUrl, {
        clean: true, // true: 清除会话, false: 保留会话
        connectTimeout: 4000, // 超时时间
        // 认证信息
        clientId: this.mqttInfo.clientId,
        username: this.mqttInfo.username,
        password: this.mqttInfo.password,
      });
       console.log(client);
        client.on('connect', (e) => {
        console.log('连接成功！！！');
        client.subscribe(`ryan/terminal/tick/0001001170616836`, {
          qos: 0
        })
      });
      client.on('message', (topic, message) => {
        console.log(JSON.parse(message.toString()));
        console.log('收到消息：', topic, message.toString())
      });
      client.on('error', (error) => {
        console.log('连接失败:', error)
      });

      store.commit('mqtt/SET_MQTT', client);
    }
  },
}

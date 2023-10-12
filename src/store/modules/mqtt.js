export default {
	namespaced: true,
	state: {
    mqttClient:null
	},
	mutations: {
		SET_MQTT(state,mqtt) {
      state.mqttClient = mqtt;
		}
	}
}

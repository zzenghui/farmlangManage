
export default {
	 namespaced: true,
	 state: {
		  // 订单-作业记录-当前选中下标
		  jobRecordSelectIndex:0,
	 },
	 mutations: {
		 SET: (state, obj) => {
			 console.log(state, obj);
			 state[obj.key] = obj.value;
		 },
	 },
	 actions: {
		 
	 }
 }
 
export default {
	namespaced: true,
	state: {
		// 作业记录列表form搜索参数
		indexFormWhere:{},
		// 摄像头显示隐藏
		webcamShow:false,
		// 作业详情数据
		infoData:{},
		// 当前分段作业表选中的row
		currentSegmentedTableRow:null,
		// 画线颜色
		colorArr: ['#f5222d','#eb2f96', '#722ed1','#2f54eb','#1890ff', '#13c2c2', '#52c41a','#a0d911','#fadb14','#fa8416','#fa541c'],
		// 作业记录table 数据
		tableData:[],
		// 作业记录table 参数
		tableParams:{},
	},
	mutations: {
		SET(state, obj) {
			return state[obj.key] = obj.value;
		},
		SET_INDEX_FORM_WHERE(state,indexFormWhere) {
			return state.indexFormWhere = indexFormWhere;
		},
		SET_WEBCAMSHOW(state,webcamShow) {
			return state.webcamShow = !webcamShow;
		},
		SET_INFO_DATA(state,infoData) {
			return state.infoData = infoData;
		},
		SET_CURRENT_SEGMENTED_TABLE_ITEM(state,currentSegmentedTableRow) {
			return state.currentSegmentedTableRow = currentSegmentedTableRow;
		},
	},
	actions:{
		setTableData({ commit }, tableData) {
			console.log(tableData);
			let arr = [];
			tableData.data.forEach(e => {
				arr.push(e.id);
			})
			commit('SET',{ key:'tableData' , value: arr });
			commit('SET',{ key:'tableParams' , value: tableData.meta });
		},
	}
}
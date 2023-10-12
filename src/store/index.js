/**
 * vuex状态管理
 */
import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import persistedState from 'vuex-persistedstate'
import { GetAreasDataTwo } from '@/api/areas';
import { getQuestionTypeList } from '@/api/questionType';
import { getquestionGradeList } from '@/api/questionGrade';
import { getMe } from '@/api/account';
Vue.use(Vuex);

// 持久化存储
const createPersistedState = persistedState({
  storage: window.sessionStorage,
  //指定持久化的模块
  paths: ['job']
})

// 自动化导入
const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store =  new Vuex.Store({
  state: {
    areaData:new Array(),
    questionTypeData:new Array(),
    questionGradeData:new Array(),
    infoMe:null
  },
  mutations: {
    setArea(state,data){
      state.areaData=data;
    },
    setQuestionType(state,data){
     state.questionTypeData=data.data;
    },
    setquestionGrade(state,data){
      state.questionGradeData=data.data;
    },
    setInfoMe(state,data){
     state.infoMe=data;
    }
  },
  actions: {
    async setArea(context){
      const { data, status } = await GetAreasDataTwo();
      if (status === 200) {
        context.commit('setArea',data);
      }
    },
    async setQuestionType(context){
      const { data } = await getQuestionTypeList();
      context.commit('setQuestionType',data);
    },
    async setquestionGrade(context){
      const { data } = await getquestionGradeList();
      context.commit('setquestionGrade',data);
    },
    async setInfoMe(context){
      const { data } = await getMe();
      context.commit('setInfoMe',data);
    }
  },
  modules,
  getters,
  plugins: [ createPersistedState ]
})

export default store


/**
 * axios配置
 */
import Vue from 'vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import store from '../store';
import router from '../router';
import setting from './setting';
import { MessageBox,Message } from 'element-ui';
// import { oidcLogout } from '@/plugins/oidc-client'
Vue.use(VueAxios, axios);

/* 设置统一的url 项目需要，无需配置环境变量 */
axios.defaults.baseURL = 'https://rydemo.ryaims.com:30001/mwebbff';

/* 请求拦截器 */
axios.interceptors.request.use((config) => {
  // 添加token到header
  config.headers['Content-type'] = "application/json;charset=UTF-8";
  let token = `${setting.tokenApiKey} ${setting.takeToken()}`;
  if (token) {
    config.headers[setting.tokenHeaderName] = token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

/* 响应拦截器 */
axios.interceptors.response.use((res) => {
  return res;
}, (error) => {
  const { status, data:{ detail:msg } } = error.response;
  if(status) {
    switch(status) {
      case 400:
        Message.error(msg ||'Bad Request!')
        break;
      case 401:
        MessageBox.alert('登录状态已过期, 请退出重新登录!', '系统提示', {
          showClose:false,
          confirmButtonText: '重新登录',
          callback: (action) => {
            if (action === 'confirm') {
              store.dispatch('user/removeToken').then(() => {
                // oidcLogout();
                goLogin(true);
              })
            }
          },
          beforeClose: () => {
            MessageBox.close();
          }
        });
        break;
      case 403:
        Message.error( msg || '权限不足');
        break;
      case 404:
        Message.error( msg || '请求不存在');
        break;
      case 500:
        Message.error( msg || '服务器内部错误');
        break;
    }
  }
  return Promise.reject(error);
});

/**
 * 跳转到登录页面
 */
 function goLogin(reload) {
  store.dispatch('user/removeToken').then(() => {
    if (reload) {
      // location.replace('/login');  // 这样跳转避免再次登录重复注册动态路由
      router.push('/login')
    } else {
      const path = router.currentRoute.path;
      router.push({
        path: '/login',
        query: path && path !== '/' ? {form: path} : null
      });
    }
  });
}

/**
 * 公共请求 同axios
 * @param {object} params
 * @returns
 */
const request = (params) => {
  return new Promise((resolve,reject) => {
    axios(params).then(res => {
      if(JSON.stringify(res.status).charAt(0) === '2') {
        resolve(res);
      }
    }).catch(err => {
      reject(err)
    })
  })
}

export default request;

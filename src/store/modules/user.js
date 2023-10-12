/**
 * 登录状态管理
 */
import axios from 'axios';
import { util } from 'ele-admin';
import setting from '@/config/setting';

const hasPermission = (route, roles) => {
  if(route.meta && route.meta.roles){
    return roles.some(role => route.meta.roles.includes(role))
		    // return true
  }else{
    return true
  }
}

export const filterAsyncRoutes = (routes, roles) => {
  let filterRoutes = []
  routes.forEach(route => {
    if(hasPermission(route, roles)){
      let temp = { ...route }
      if(temp.children){
        //递归过滤子路由
        temp.children = filterAsyncRoutes(temp.children, roles)
      }
      filterRoutes.push(temp)
    }
  })
  return filterRoutes
}
export default {
  namespaced: true,
  state: {
    // 当前用户信息
    user: setting.takeUser(),
    // 当前项目信息
    systemInfo:{},
    // 当前用户权限
    authorities: setting.takeAuthorities() || [],
    // 当前用户角色
    roles: setting.takeRoles() || [],
    // 当前用户的菜单
    menus: null,
    //行政区树结构
    districtsTree: [],
    // 当前行政区
    currentDistrict:{}
  },
  mutations: {
    SET: (state, obj) => {
      state[obj.key] = obj.value;
    },
    SET_TOKEN: (state, obj) => {
      setting.cacheToken(obj.token, obj.remember);
      state.token = obj.token;
      if (!obj.token) {
        state.user = {};
        state.menus = null;
        state.tabs = [];
        setting.cacheUser();
        setting.cacheRoles();
      }
    },
    TAB_PUSH(state, obj) {
      if (!state.tabs.some(r => r.path === obj.path)) {
        state.tabs.push(obj);
      }
    }
  },
  actions: {
    /**
     * 缓存用户当前行政区树结构
     * @param commit
     * @param user {Object} 用户信息
     */
     setDistrictsTree({ commit }, tree) {
      commit("SET", { key: "districtsTree", value: tree });
    },
    /**
     * 缓存用户当前行政区
     * @param commit
     * @param currentDistrict {Object} 当前行政区
     */
    setCurrentDistrict({ commit }, currentDistrict) {
      commit("SET", { key: "currentDistrict", value: currentDistrict });
    },
    /**
     * 缓存token
     * @param commit
     * @param token {String, {token: String, remember: String}}
     */
    setToken({commit}, token) {
      let remember = true;
      if (typeof token === 'object') {
        remember = token.remember;
        token = token.token;
      }
      commit('SET_TOKEN', {token: token, remember: remember});
    },
    /**
     * 移除token
     * @param commit
     */
    removeToken({commit}) {
      commit('SET_TOKEN', {});
    },
    /**
     * 缓存用户信息
     * @param commit
     * @param user {Object} 用户信息
     */
    setUser({commit}, user) {
		  console.log(user);
      setting.cacheUser(user);
      commit('SET', {key: 'user', value: user});
    },
    /**
     * 缓存项目信息
     * @param commit
     * @param user {Object} 项目信息
     */
     setSystemInfo({commit}, systemInfo) {
      commit('SET', {key: 'systemInfo', value: systemInfo});
    },
    /**
     * 设置用户权限
     * @param commit
     * @param authorities {Array<String>} 权限
     */
    setAuthorities({commit}, authorities) {
      setting.cacheAuthorities(authorities,true);
      commit('SET', {key: 'authorities', value: authorities});
    },
    /**
     * 设置用户角色
     * @param commit
     * @param roles {Array<String>} 角色
     */
    setRoles({commit}, roles) {
      setting.cacheRoles(roles,true);
      commit('SET', {key: 'roles', value: roles});
    },
    /**
     * 设置用户菜单
     * @param commit
     * @param menus {Array<Object>} 菜单
     */
    setMenus({commit}, menus) {
      commit('SET', {key: 'menus', value: menus});
    },
    /**
     * 获取用户菜单路由
     * @param commit
     * @returns {Promise<Object>} {menus: Array, home: String}
     */
    getMenus({commit}) {
      return new Promise((resolve, reject) => {
				console.log('获取用户菜单路由');
        if (!setting.menuUrl) {
          let menus = setting.menus || [];
          let roles = setting.takeRoles();
          let accessRoutes = filterAsyncRoutes(menus,roles);
          commit('SET', {key: 'menus', value: accessRoutes});
          return resolve({menus: accessRoutes});
        }
        // axios.get(setting.menuUrl).then(res => {
        //   let result = setting.parseMenu ? setting.parseMenu(res.data) : res.data;
        //   let menus = result.data, home = null;
        //   if (!menus) {
        //     return reject(new Error(result.msg));
        //   }
        //   util.eachTreeData(menus, item => {
        //     if (setting.parseMenuItem) {
        //       item = setting.parseMenuItem(item);
        //     }
        //     item.meta = Object.assign({
        //       title: item.title,
        //       icon: item.icon,
        //       hide: item.hide,
        //       active: item.active || item.uid,
        //       hideFooter: item.hideFooter
        //     }, item.meta);
        //     if (!item.children || !item.children.length) {
        //       if (!home && item.path && !(
        //         item.path.startsWith('http://') ||
        //         item.path.startsWith('https://') ||
        //         item.path.startsWith('//')
        //       )) {
        //         home = item.path;
        //         if (!setting.homeTitle) {
        //           setting.homeTitle = item.title;
        //         }
        //       }
        //     } else if (item.children[0].path) {
        //       if (!item.redirect) {
        //         item.redirect = item.children[0].path;
        //       }
        //       if (!item.path) {
        //         const cp = item.children[0].path;
        //         item.path = cp.substring(0, cp.lastIndexOf('/'));
        //       }
        //     }
        //   });
        //   commit('SET', {key: 'menus', value: menus});
        //   resolve({menus: menus, home: home});
        // }).catch(e => {
        //   reject(e);
        // });
      });
    },
  }
}

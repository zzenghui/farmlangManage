/**
 * 权限、角色控制组件
 */
import store from '@/store';
import {
  SvgModel,
  geo2svg
} from '../../public/maps/geo2svg.js';

export default {
  install(Vue) {
    // 添加全局方法
    Vue.prototype.$hasRole = this.hasRole;
    Vue.prototype.$hasAnyRole = this.hasAnyRole;
    Vue.prototype.$hasPermission = this.hasPermission;
    Vue.prototype.$hasAnyPermission = this.hasAnyPermission;

    // 添加自定义指令
    Vue.directive('role', {
      inserted: (el, binding) => {
        if (!this.hasRole(binding.value)) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    });
    Vue.directive('any-role', {
      inserted: (el, binding) => {
        if (!this.hasAnyRole(binding.value)) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    });
    Vue.directive('permission', {
      inserted: (el, binding) => {
        if (!this.hasPermission(binding.value)) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    });
    Vue.directive('any-permission', {
      inserted: (el, binding) => {
        if (!this.hasAnyPermission(binding.value)) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    });

    Vue.directive('lmap', {
      bind: function(el, binding, vnode) {
        const that = vnode.context;
        that[binding.arg](el);
      },
    });

    Vue.directive('schedule', {
      bind: function(el, binding, vnode) {
        const that = vnode.context;
        that[binding.arg](el,binding.value);
      },
    });

   Vue.directive('schedule-new', {
      bind: function(el, binding, vnode) {
        const value = binding.value;
        if(value.callback){
           value.callback(el,value.options);
        }
      },
    });

    Vue.directive('lGeoSvg', {
      inserted: function(el, binding, vnode) {
        let {
          geoJSON,
          svgModel,
          isStringConvertGeoJso = true
        } = binding.value;

          if(!svgModel){
           svgModel =  new SvgModel();
          }


        if (isStringConvertGeoJso) {
          el.innerHTML = geo2svg(JSON.parse(geoJSON), svgModel);
        } else {
          el.innerHTML = geo2svg(geoJSON, svgModel);
        }
      },
      update: function(el, binding, vnode) { //组件更新
        let {
          geoJSON,
          svgModel = new SvgModel(),
          isStringConvertGeoJso = true
        } = binding.value;
        if (isStringConvertGeoJso) {
          el.innerHTML = geo2svg(JSON.parse(geoJSON), svgModel);
        } else {
          el.innerHTML = geo2svg(geoJSON, svgModel);
        }
      },
    });
  },
  /**
   * 是否有某些角色
   * @param role {String, Array<String>} 角色字符或字符数组
   * @returns {boolean}
   */
  hasRole(role) {
    const data = store.state.user ? store.state.user.roles : null;
    return arrayHas(data, role);
  },
  /**
   * 是否有任意角色
   * @param role {String, Array<String>} 角色字符或字符数组
   * @returns {boolean}
   */
  hasAnyRole(role) {
    const data = store.state.user ? store.state.user.roles : null;
    return arrayHasAny(data, role);
  },
  /**
   * 是否有某些权限
   * @param auth {String, Array<String>} 权限字符或字符数组
   * @returns {boolean}
   */
  hasPermission(auth) {
    const data = store.state.user ? store.state.user.authorities : null;
    return arrayHas(data, auth);
  },
  /**
   * 是否有任意权限
   * @param auth {String, Array<String>} 权限字符或字符数组
   * @returns {boolean}
   */
  hasAnyPermission(auth) {
    const data = store.state.user ? store.state.user.authorities : null;
    return arrayHasAny(data, auth);
  }
}

/**
 * 数组是否有某些值
 * @param array {Array<String>} 数组
 * @param obj {String, Array<String>} 值
 * @returns {boolean}
 */
function arrayHas(array, obj) {
  if (!obj) {
    return true;
  }
  if (!array) {
    return false;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (array.indexOf(obj[i]) === -1) {
        return false;
      }
    }
    return true;
  }
  return array.indexOf(obj) !== -1;
}

/**
 * 数组是否有任意值
 * @param array {Array<String>} 数组
 * @param obj {String, Array<String>} 值
 * @returns {boolean}
 */
function arrayHasAny(array, obj) {
  if (!obj) {
    return true;
  }
  if (!array) {
    return false;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (array.indexOf(obj[i]) !== -1) {
        return true;
      }
    }
    return false;
  }
  return array.indexOf(obj) !== -1;
}

import asyncRoutes from "@/router/async-router";

/**
 * 项目统一配置
 */
export default {
  // 路由白名单(不需要登录的)
  whiteList: ["/login", "/mapDemo"],
  // 不显示全局页脚的路由地址
  hideFooters: [],
  // 不显示侧边栏的路由地址
  hideSidebars: [],
  // 可重复打开页签的路由地址
  repeatableTabs: [],
  // 菜单数据接口
  menuUrl: null,
  // 自定义解析接口菜单数据
  parseMenu: null,
  // 自定义解析接口菜单每一个数据格式
  parseMenuItem: null,
  // 直接指定菜单数据
  // Grid member job management
  menus: asyncRoutes,
  // 订单职位角色
  DEPARTMENT_ROLE: {
    ADMIN: "admin",
    DIRECTOR: "director",
    USERINSIDE: "userinside"
  }, // 用户信息接口
  userUrl: "/auth/me",
  // 自定义解析接口用户信息
  parseUser(res) {
    let result = {};
    const {
      id,
      no,
      name,
      avatar,
      phone,
      roleName,
      permissions,
      // 订单职位角色
      isAdmin,
      isDirector,
      dept_Id
    } = res;
    if (res) {
      result.user = {
        id,
        no,
        name,
        avatar,
        phone,
        roleName,
        isAdmin,
        isDirector,
        dept_Id
      };
      // 职位权限
      if (isAdmin) {
        result.departmentRole = this.DEPARTMENT_ROLE.ADMIN;
      } else if (isDirector) {
        result.departmentRole = this.DEPARTMENT_ROLE.DIRECTOR;
      } else {
        result.departmentRole = this.DEPARTMENT_ROLE.USERINSIDE;
      }
      // 下面是获取角色和权限列表，需要string数组类型
      // if (roleIds) {
      //   result.roles = roleIds;
      // }
      if (permissions) {
        // 暂时不区分角色，都先用权限代替
        const authorities = permissions.map(d => d.label);
        result.roles = authorities;
        result.authorities = authorities;
      }
    }
    return result;
  },
  // token传递的header名称
  tokenHeaderName: "Authorization",
  // token存储的名称
  tokenStoreName: "access_token",
  tokenApiKey: "Bearer",
  // 获取缓存的token
  takeToken() {
    let token = localStorage.getItem(this.tokenStoreName);
    if (!token) {
      token = sessionStorage.getItem(this.tokenStoreName);
    }
    return token;
  },
  // 缓存token
  cacheToken(token, remember) {
    localStorage.removeItem(this.tokenStoreName);
    sessionStorage.removeItem(this.tokenStoreName);
    if (token) {
      if (remember) {
        localStorage.setItem(this.tokenStoreName, token);
      } else {
        sessionStorage.setItem(this.tokenStoreName, token);
      }
    }
  },
  // 角色roles存储的名称
  rolesStoreName: "roles",
  // 获取缓存的roles
  takeRoles() {
    try {
      return JSON.parse(localStorage.getItem(this.rolesStoreName)) || [];
    } catch (e) {
      console.error(e);
    }
    return [];
  },
  // 缓存角色roles
  cacheRoles(roles) {
    if (roles) {
      localStorage.setItem(this.rolesStoreName, JSON.stringify(roles));
    } else {
      localStorage.removeItem(this.rolesStoreName);
    }
  },
  // 角色roles存储的名称
  authoritiesStoreName: "authorities",
  // 获取缓存的authorities
  takeAuthorities() {
    try {
      return JSON.parse(localStorage.getItem(this.authoritiesStoreName)) || [];
    } catch (e) {
      console.error(e);
    }
    return [];
  },
  // 缓存权限authorities
  cacheAuthorities(authorities) {
    if (authorities) {
      localStorage.setItem(
        this.authoritiesStoreName,
        JSON.stringify(authorities)
      );
    } else {
      localStorage.removeItem(this.authoritiesStoreName);
    }
  },
  // 用户信息存储的名称
  userStoreName: "user",
  // 获取缓存的用户信息
  takeUser() {
    try {
      return JSON.parse(localStorage.getItem(this.userStoreName)) || {};
    } catch (e) {
      console.error(e);
    }
    return {};
  },
  // 缓存用户信息
  cacheUser(user) {
    if (user) {
      localStorage.setItem(this.userStoreName, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.userStoreName);
    }
  },
  // 主题配置存储的名称
  themeStoreName: "theme",
  // 首页tab显示标题, null会根据菜单自动获取
  homeTitle: "主页",
  // 首页路径, null会自动获取
  homePath: "/home",
  // 顶栏是否显示主题设置按钮
  showSetting: true,
  // 开启多页签是否缓存组件
  tabKeepAlive: false,
  // 是否折叠侧边栏
  collapse: false,
  // 侧边栏风格: light(亮色), dark(暗色)
  sideStyle: "light",
  // 顶栏风格: light(亮色), dark(暗色), primary(主色)
  headStyle: "light",
  // 标签页风格: default(默认), dot(圆点), card(卡片)
  tabStyle: "default",
  // 布局风格: side(默认), top(顶栏菜单), mix(混合菜单)
  layoutStyle: "side",
  // 侧边栏菜单风格: default默认, mix双排菜单
  sideMenuStyle: "default",
  // 是否固定侧栏
  fixedSidebar: true,
  // 是否固定顶栏
  fixedHeader: false,
  // 是否固定主体
  fixedBody: true,
  // logo是否自适应宽度
  logoAutoSize: true,
  // 内容区域宽度是否铺满
  bodyFull: true,
  // 是否开启多标签
  showTabs: false,
  // 侧栏是否多彩图标
  colorfulIcon: false,
  // 侧边栏是否只保持一个子菜单展开
  sideUniqueOpen: true,
  // 是否开启页脚
  showFooter: true,
  // 是否是色弱模式
  weakMode: false,
  // 是否是暗黑模式
  darkMode: false,
  // 默认主题色
  color: "green"
};

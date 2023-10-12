/**
 * 路由配置
 */
import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import setting from "@/config/setting";
import EleLayout from "@/layout";
import { menuToRoutes } from "ele-admin";

import NProgress from "nprogress";

Vue.use(VueRouter);

// 静态路由
const routes = [
  {
    path: "/login",
    component: () => import("@/views/login/login"),
    meta: {
      title: "登录"
    }
  },
  {
    path: "/mapDemo",
    component: () => import("@/views/mapDemo/index"),
    meta: {
      title: "测试"
    }
  },
  {
    path: "*",
    component: () => import("@/views/exception/404"),
    meta: {
      title: "404"
    }
  }
];

const router = new VueRouter({
  routes
  // mode: 'history'  // 把这个删掉就是hash模式
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  updateTitle(to);
  if (setting.takeToken()) {
    // 判断是否已经注册动态路由
    if (!store.state.user.menus) {
      // 获取动态路由
      store
        .dispatch("user/getMenus")
        .then(({ menus, home }) => {
          if (menus) {
            router.addRoute({
              name: "/",
              path: "/",
              component: EleLayout,
              redirect: setting.homePath || home,
              children: menuToRoutes(menus, component =>
                import("@/views" + component)
              )
            });
          }
          next({
            ...to,
            replace: true
          });
        })
        .catch(() => {
          next();
        });
    } else {
      next();
    }
  } else if (setting.whiteList.indexOf(to.path) !== -1) {
    next(); // 在无需登录的白名单内
  } else {
    // 未登录跳转登录页面
    next({ path: "/login", query: to.path === "/" ? {} : { from: to.path } });

    //无token，也不在登录的白名单，一般跳到登录页
    // oidcClient().then(() => {
    //   let token = getToken();
    //   if(token) {
    //     next()
    //   }else {
    //     oidcLogin();
    //   }
    // })
  }
});

router.afterEach(() => {
  setTimeout(() => {
    NProgress.done(true);
  }, 300);
});

// 重复点击导航时，控制台出现报错 ，虽然不影响功能使用，但也不能视而不见。
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;

/**
 * 更新浏览器标题
 * @param route
 */
function updateTitle(route) {
  let names = [];
  if (route && route.meta && route.meta.title) {
    names.push(route.meta.title);
  }
  const appName = store.state.user.systemInfo.name;
  if (appName) {
    names.push(appName);
  }
  document.title = names.join(" - ");
}

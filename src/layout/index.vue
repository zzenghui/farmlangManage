<!-- 框架布局 -->
<template>
  <ele-pro-layout
    ref="layout"
    :i18n="i18n"
    :menus="user.menus"
    :home-title="homeTitle"
    :project-name="projectName"
    :show-content="showContent"
    :show-setting.sync="showSetting"
    :need-setting="setting.needSetting"
    :hide-footers="setting.hideFooters"
    :hide-sidebars="setting.hideSidebars"
    :repeatable-tabs="setting.repeatableTabs"
    :tabs="theme.tabs"
    :color="theme.color"
    :collapse="theme.collapse"
    :head-style="theme.headStyle"
    :side-style="theme.sideStyle"
    :layout-style="theme.layoutStyle"
    :side-menu-style="theme.sideMenuStyle"
    :fixed-body="theme.fixedBody"
    :fixed-header="theme.fixedHeader"
    :fixed-sidebar="theme.fixedSidebar"
    :body-full="theme.bodyFull"
    :show-footer="theme.showFooter"
    :colorful-icon="theme.colorfulIcon"
    :logo-auto-size="theme.logoAutoSize"
    :side-unique-open="theme.sideUniqueOpen"
    :show-tabs="theme.showTabs"
    :tab-style="theme.tabStyle"
    :dark-mode="theme.darkMode"
    :weak-mode="theme.weakMode"
    @logo-click="onLogoClick"
    @reload-page="reloadPage"
    @update-screen="updateScreen"
    @update-collapse="updateCollapse"
    @tab-add="tabAdd"
    @tab-remove="tabRemove"
    @tab-remove-all="tabRemoveAll"
    @tab-remove-left="tabRemoveLeft"
    @tab-remove-right="tabRemoveRight"
    @tab-remove-other="tabRemoveOther"
    @change-style="changeStyle"
    @change-color="changeColor"
    @change-dark-mode="changeDarkMode"
    @change-weak-mode="changeWeakMode"
    @set-home-components="setHomeComponents"
  >
    <!-- logo图标 -->
    <template slot="logo">
      <img :src="logo" alt="logo" style="width:167px;height:43px;" />
    </template>
    <!-- 顶栏右侧区域 -->
    <template slot="right">
      <ele-header-right
        :show-setting="setting.needSetting"
        @item-click="onItemClick"
        v-loading="infoLoading"
      />
    </template>
    <!-- 全局页脚 -->
    <!-- <template #footer>
      <ele-footer/>
    </template> -->
    <!-- 修改密码弹窗 -->
    <ele-password :visible.sync="showPassword" />
  </ele-pro-layout>
</template>

<script>
import { mapGetters } from "vuex";
import request from "@/config/axios-config";
import setting from "@/config/setting";
import EleHeaderRight from "./header-right";
import ElePassword from "./password";
// import { getSystemInfoApi } from '@/api/layoutApi'
// import {
//   // getCurrentDistrictsTreeApi,
//   getAllDistrictsApi,
//   getCurrentDistrictsApi
// } from "@/api/commonApi";
import EleFooter from "./footer";
import {
  reloadPageTab,
  addPageTab,
  removePageTab,
  removeAllPageTab,
  removeLeftPageTab,
  removeRightPageTab,
  removeOtherPageTab
} from "@/utils/page-tab-util";
// import mqttMixin from '@/plugins/mqtt'

export default {
  name: "EleLayout",
  components: {
    EleHeaderRight,
    ElePassword,
    EleFooter
  },
  // mixins:[ mqttMixin ],
  computed: {
    // 主页标题
    homeTitle() {
      return setting.homeTitle;
      // return this.$t('layout.home');
    },
    ...mapGetters(["theme", "user"])
  },
  data() {
    return {
      // 项目logo
      logo: require("../assets/logo.png"),
      // 项目名
      projectName: "",
      // 全局配置
      setting: setting,
      // 是否显示修改密码弹窗
      showPassword: false,
      // 是否显示主题设置抽屉
      showSetting: false,
      // 是否显示主体部分, 如果你的首页用到了权限控制指令, 把这个改成false, 避免权限控制指令可能不生效
      showContent: true,
      // header-right 个人信息加载状态
      infoLoading: false
    };
  },
  created() {
    // 获取用户信息
    this.getUserInfo();
    //获取最新区域
    this.getArea();
    //获取问题类型
    this.getQuestionType();
    //获取问题等级
    this.getQuestionLevel();
    //获取当前登陆人信息
    this.getInfoMe();
  },
  methods: {
    /* 获取当前用户信息 */
    async getUserInfo() {
      if (setting.userUrl) {
        try {
          this.infoLoading = true;
          const { data } = await request({
            url: setting.userUrl,
            method: "get"
          });
          let result;
          if (setting.parseUser) {
            result = setting.parseUser(data);
          } else {
            result = data;
          }
          const user = result;
          this.$store.dispatch("user/setUser", user);
          this.$store.dispatch("user/setRoles", user.roles);
          this.$store.dispatch("user/setAuthorities", user.authorities);
          this.showContent = true;
          this.infoLoading = false;
        } catch (err) {
          this.showContent = true;
          this.infoLoading = false;
          this.$message.error("获取信息失败");
        }
      }
    },
    // 获取地区区域
    getArea() {
      this.$store.dispatch("setArea");
    },
    getQuestionType() {
      this.$store.dispatch("setQuestionType");
    },
    getQuestionLevel() {
      this.$store.dispatch("setquestionGrade");
    },
    getInfoMe() {
      this.$store.dispatch("setInfoMe");
    },
    /* 顶栏右侧点击 */
    onItemClick(key) {
      if (key === "password") {
        this.showPassword = true;
      } else if (key === "setting") {
        this.showSetting = true;
      }
    },
    /* 刷新页签 */
    reloadPage() {
      reloadPageTab();
    },
    /* logo点击事件 */
    onLogoClick(isHome) {
      if (!isHome) {
        this.$router.push("/");
      }
    },
    /* 更新collapse */
    updateCollapse(value) {
      this.$store.dispatch("theme/set", {
        key: "collapse",
        value: value
      });
    },
    /* 更新屏幕尺寸 */
    updateScreen() {
      this.$store.dispatch("theme/updateScreen");
    },
    /* 切换主题风格 */
    changeStyle(value) {
      this.$store.dispatch("theme/set", value);
    },
    /* 切换主题色 */
    changeColor(value) {
      const loading = this.$loading({ lock: true, background: "transparent" });
      this.$store
        .dispatch("theme/setColor", value)
        .then(() => {
          loading.close();
        })
        .catch(e => {
          loading.close();
          console.error(e);
          this.$message.error("主题加载失败");
        });
    },
    changeDarkMode(value) {
      this.$store.dispatch("theme/setDarkMode", value);
    },
    changeWeakMode(value) {
      this.$store.dispatch("theme/setWeakMode", value);
    },
    setHomeComponents(components) {
      this.$store.dispatch("theme/setHomeComponents", components);
    },
    /* 添加tab */
    tabAdd(value) {
      addPageTab(value);
    },
    /* 移除tab */
    tabRemove(obj) {
      removePageTab(obj.name).then(({ lastPath }) => {
        if (obj.active === obj.name) {
          this.$router.push(lastPath || "/");
        }
      });
    },
    /* 移除全部tab */
    tabRemoveAll(active) {
      removeAllPageTab();
      if (active !== "/") {
        this.$router.push("/");
      }
    },
    /* 移除左边tab */
    tabRemoveLeft(value) {
      removeLeftPageTab(value);
    },
    /* 移除右边tab */
    tabRemoveRight(value) {
      removeRightPageTab(value);
    },
    /* 移除其它tab */
    tabRemoveOther(value) {
      removeOtherPageTab(value);
    },
    /* 菜单路由国际化对应的名称 */
    i18n(path, key /*, menu*/) {
      // 参数menu即原始菜单数据, 如果需要菜单标题多语言数据从接口返回可用此参数获取对应的多语言标题
      // 例如下面这样写, 接口的菜单数据为{path: '/system/user', titles: {zh: '用户管理', en: 'User'}}
      // return menu ? menu.titles[this.$i18n.locale] : null;
      const k = "route." + key + "._name",
        title = this.$t(k);
      return title === k ? null : title;
    },
    /* 切换语言 */
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      this.$refs.layout.changeLanguage();
      localStorage.setItem("i18n-lang", lang);
    }
  }
};
</script>

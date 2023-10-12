### 智能流媒体服务 Swagger文档地址 ： http://rtmp.ryaims.com/swagger/index.html
### 凯瑞设备媒体接口 Swagger文档地址 ： http://ftposs.krzhibo.com/swagger-ui.html#/
---
### 睿耘后台管理webvue框架升级_1.2至1.5
> 2021年7月22日

#### 升级指南
1. package.json 依赖升级
   - @amap/amap-jsapi-loader - "~1.0.1"
   - ele-admin - "~1.5.0"
   - vue-i18n - "~8.24.4"
2. vue.config.js - transpileDependencies 增加vue-i18n不然不兼容IE10
3. src/lang/index.js 文件替换 - 增加换肤侧边栏国际化文字
4. src/store/modules/theme.js. 文件替换 - 切换主题方式优化, 改简单了
5. src/style/index.scss  文件替换——-使用新提供的dynamic.scss实现切换主题
---
### 睿耘后台管理webvue框架升级_1.5至1.6 
> 2021年7月23日

#### 升级指南
1. package.json依赖升级
   - npm i ele-admin@1.6.0 -S
   - 运行命令npm i element-ui@2.15.3 -S升级element-ui
2. 增加侧边栏样式（侧栏双排菜单）
   - Src/layout/index  替换了ele-pro-layout组件
3. 对国际化进行了改进优化
4. src/config/setting.js - 增加tabKeepAlive移除keepAliveList配置
5. src/utils/page-tab-util.js - 新增的文件, 操作页签方法的封装
6. src/layout/index.vue - 改动较大, 支持页签缓存, 代码优化
7. src/store/modules/theme.js - 改动较大, 支持页签缓存, 代码优化
8. src/store/modules/user.js - 页签tabs相关移到theme.js中, 便于实现页签缓存
9. src/router/index.js - 菜单转路由使用封装的menuToRoutes方法




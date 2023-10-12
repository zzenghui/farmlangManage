const customer = {
  path: "/customer",
  redirect: "/customer/information",
  meta: {
    title: "客户管理",
    icon: "el-icon--kehuguanli",
    roles: ["usercustomer_list"]
  },
  children: [
    {
      path: "/customer/information",
      component: "/customer/information",
      meta: {
        title: "客户信息",
        hide: false
      }
    },
    {
      path: "/customer/information/details",
      component: "/customer/information/details",
      meta: {
        title: "详情",
        icon: "el-icon-_user-group",
        hide: true
      }
    },
    {
      path: "/customer/information/farmland-details",
      component: "/customer/information/farmland-details",
      meta: {
        title: "农田详情",
        icon: "el-icon-_user-group",
        hide: true,
        roles: ["field_list"]
      }
    },
    {
      path: "/customer/information/add-the-farmland",
      component: "/customer/information/add-the-farmland",
      meta: {
        title: "添加农田",
        icon: "el-icon-_user-group",
        hide: true,
        roles: ["field_add"]
      }
    },
    {
      path: "/customer/information/tour-field",
      component: "/customer/information/tour-field",
      meta: {
        title: "添加巡田日志",
        icon: "el-icon-_user-group",
        hide: true,
        roles: ["archive_add"]
      }
    },
    {
      path: "/customer/information/tour-field/detail",
      component: "/customer/information/tour-field/detail",
      meta: {
        title: "巡田记录",
        icon: "el-icon-_user-group",
        hide: true,
        roles: ["archive_list"]
      }
    }
  ]
};

export default customer;

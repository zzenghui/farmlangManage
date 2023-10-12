const farmland = {
  path: "/farmland",
  redirect: "/farmland/list",
  meta: {
    title: "农田管理",
    icon: "el-icon--nongtianguanlitubiao",
    roles: ["field_list"]
  },
  children: [
    {
      path: "/farmland/list",
      component: "/farmland/list",
      meta: {
        title: "农田列表",
        hide: false
      }
    },
    {
      path: "/farmland/list/list-detail",
      component: "/farmland/list/list-detail",
      meta: {
        title: "农田详情",
        hide: true
      }
    },
    {
      path: "/farmland/list/edit-fields",
      component: "/farmland/list/edit-fields",
      meta: {
        title: "编辑农田",
        hide: true,
        roles: ["field_up"]
      }
    }
  ]
};

export default farmland;

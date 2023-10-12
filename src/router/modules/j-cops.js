const solution = {
  path: "/crops",
  redirect: "/crops-list",
  meta: {
    title: "作物管理",
    icon: "el-icon--dingdan",
    roles: [
      "crop_type_list",
      "crop_varietie_list",
      "crop_list"
    ]
  },
  children: [
    {
      path: "/crops/list",
      component: "/crops/list",
      meta: {
        title: "作物列表",
        hide: false,
        roles: ["crop_list"]
      }
    },
    {
      path: "/crops/types",
      component: "/crops/types",
      meta: {
        title: "作物类型",
        hide: false,
        roles: ["crop_type_list"]
      }
    },
    {
      path: "/crops/varieties",
      component: "/crops/varieties",
      meta: {
        title: "作物品种",
        hide: false,
        roles: ["crop_varietie_list"]
      }
    },

  ]
};

export default solution;

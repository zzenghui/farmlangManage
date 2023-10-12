const solution = {
  path: "/solution",
  redirect: "/solution-m",
  meta: {
    title: "方案库管理",
    icon: "el-icon--dingdan",
    roles: [
      "solution_list"
    ]
  },
  children: [
    {
      path: "/solution-m",
      component: "/solution",
      meta: {
        title: "方案库列表",
        hide: false,
        roles: ["solution_list"]
      }
    },
    {
      path: "/solution/add",
      component: "/solution/add",
      meta: {
        title: "添加方案库",
        hide: true
      }
    },
    {
      path: "/solution/detail",
      component: "/solution/detail",
      meta: {
        title: "方案库详情",
        hide: true
      }
    },
  ]
};

export default solution;

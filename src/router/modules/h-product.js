const product = {
  path: "/product-management",
  redirect: "/product-management/list",
  meta: {
    title: "产品管理",
    icon: "el-icon--dingdan",
    roles: [
      "product_type_list",
      "product_list",
    ]
  },
  children: [
    {
      path: "/product-management/list",
      component: "/product-management/list",
      meta: {
        title: "产品列表",
        hide: false,
        roles: ["product_list"]
      }
    },
    {
      path: "/product-management/type",
      component: "/product-management/type",
      meta: {
        title: "产品类型",
        hide: false,
        roles: ["product_type_list"]
      }
    },
    {
      path: "/product-management/list/detail",
      component: "/product-management/list/detail",
      meta: {
        title: "产品详情",
        hide: true
      }
    },
  ]
};

export default product;

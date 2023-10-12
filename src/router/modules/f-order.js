const order = {
  path: "/order",
  redirect: "/order/indent",
  meta: {
    title: "预约/订单",
    icon: "el-icon--dingdan",
    roles: ["order_list"]
  },
  children: [
    {
      path: "/order/indent",
      component: "/order",
      meta: {
        title: "预约/订单列表",
        hide: false,
        roles: ["order_list"]
      }
    },
    {
      path: "/order/add-subscribe",
      component: "/order/add-subscribe",
      meta: {
        title: "添加预约服务",
        hide: true,
        roles: ["order_add"]
      }
    },
    {
      path: "/order/detail-page",
      component: "/order/detail-page",
      meta: {
        title: "预约/订单详情",
        hide: true
      }
    }
  ]
};

export default order;

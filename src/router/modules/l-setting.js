const Setting = {
  path: "/setting",
  // redirect: "/setting/employees",
  meta: {
    title: "系统设置",
    icon: "el-icon--a-shezhi",
    roles: [
      "userinside_list",
      "area_list",
      "solution_list",
      "crop_type_list",
      "crop_varietie_list",
      "crop_list"
    ]
  },
  children: [
    {
      path: "/setting/employees",
      component: "/setting/employees",
      meta: {
        title: "员工管理",
        hide: false,
        roles: ["userinside_list"]
      }
    },
    {
      path: "/setting/area",
      component: "/setting/area",
      meta: {
        title: "区域管理",
        hide: false,
        roles: ["area_list"]
      }
    },
    // {
    //   path: "/setting/agricultural-equipment",
    //   component: "/setting/agricultural-equipment",
    //   meta: {
    //     title: "农机设备",
    //
    //     hide: false,
    //   }
    // },



    {
      path: "/setting/service-type",
      component: "/setting/service-type",
      meta: {
        title: "服务类型",
        hide: false,
        roles: ["service_type_list"]
      }
    },

    // {
    //   path: "/setting/job-type",
    //   component: "/setting/job-type",
    //   meta: {
    //     title: "作业类型管理",
    //
    //     hide: false
    //   }
    // },


  ]
};

export default Setting;

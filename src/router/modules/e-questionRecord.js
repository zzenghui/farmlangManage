const questionRecord = {
  path: "/question",
  redirect: "/question/record",
  meta: {
    title: "问题记录",
    icon: "el-icon--wentijilu",
    roles: ["question_list"]
  },
  children: [
    {
      path: "/question/record",
      component: "/question-record",
      meta: {
        title: "问题列表",
        hide: false,
        roles: ["question_list"]
      }
    },
    {
      path: "/question/add-record",
      component: "/question-record/add-record",
      meta: {
        title: "添加问题记录",
        hide: true,
        roles: ["question_add"]
      }
    },
    {
      path: "/question/update-record",
      component: "/question-record/update-record",
      meta: {
        title: "修改问题记录",
        hide: true,
        roles: ["question_up"]
      }
    },
    {
      path: "/question/detail",
      component: "/question-record/detail",
      meta: {
        title: "问题记录详情",
        hide: true
      }
    }
  ]
};
export default questionRecord;

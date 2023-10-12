const question = {
  path: "/problem-management",
  redirect: "/problem-management/questionType",
  meta: {
    title: "问题管理",
    icon: "el-icon--dingdan",
    roles: [
      "question_type_list",
      "question_level_list",
    ]
  },
  children: [
    {
      path: "/problem-management/questionType",
      component: "/problem-management/questionType",
      meta: {
        title: "问题类型",
        hide: false,
        roles: ["question_type_list"]
      }
    },
    {
      path: "/problem-management/questionLevel",
      component: "/problem-management/questionLevel",
      meta: {
        title: "问题等级",
        hide: false,
        roles: ["question_level_list"]
      }
    },
  ]
};

export default question;

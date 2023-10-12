const tourArchive = {
  path: "/tour-archive",
  redirect: "/tour-archive/calendar",
  meta: {
    title: "巡田日志",
    icon: "el-icon--xuntianrizhi",
    roles: ["archive_list"]
  },
  children: [
    {
      path: "/tour-archive/calendar",
      component: "/tour-archive/calendar",
      meta: {
        title: "巡田日历",
        hide: false
      }
    }
  ]
};

export default tourArchive;

export default{
  // 定义请求参数，可以理解为参数拦截器
  parseParam(res) {
    // if (res.districtId) {
    //   return {
    //     ...res,
    //     districtId: res.districtId[res.districtId.length - 1],
    //     pageIndex: res.pageIndex - 1
    //   };
    // }


    this.pageIndex=res.pageIndex;
    return {
      ...res,
      pageIndex: res.pageIndex - 1
    };
  },
  /* 调整数据格式 */
  parseData(res) {
    // 后端接口需要返回的数据格式为：{"code": 0, "data": [{},{}], "count": 10, "msg": ""}
    this.datas = res.data;
    return {
      code: 0,
      data: res.data,
      count: res.meta.totalItemsCount,
      msg: res.message ? res.message : ""
    };
  },
  /* 刷新表格 */
  reload() {
    this.$nextTick(() => {
      this.$refs.table.reload();
    });
  },
}

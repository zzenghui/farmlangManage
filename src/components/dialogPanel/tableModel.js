

export default class {
  constructor(opt) {
    this.where = {};
    this.selection = [];
    this.tableLoading = true;
    this.columns=opt.columns;
    this.url= opt.url;
    this.datas=[];
    this.pageIndex=1;
    this.tableRequestParams = {
      pageName: 'pageIndex',
      limitName: 'pageSize',
    };
  }
}

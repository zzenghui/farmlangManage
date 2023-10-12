const selection = {
  columnKey: 'selection',
  type: 'selection',
  width: 40,
  align: 'center'
};

const code = {
  columnKey: "index",
  label: "序号",
  type: "index",
  width: 50,
  align: "center"
};
const currencys = [
  selection,
  code,
];

const radio = {
  prop: "action",
  label: "操作",
  width: 60,
  align: "center",
  slot: "action"
};

const orderColumns = [
  ...currencys,
  {
    prop: "no",
    label: "订单ID",
    align: "center",
    minWidth: 80
  },
  {
    prop: "clientNo",
    label: "客户ID",
    align: "center",
    minWidth: 80
  },
  {
    prop: "userPhone",
    label: "联系方式",
    align: "center",
    minWidth: 130
  },
  {
    prop: "userNo",
    label: "发单人ID",
    align: "center",
    minWidth: 80
  },
  {
    prop: "userName",
    label: "发单人姓名",
    align: "center",
    minWidth: 110
  },
  {
    prop: "createDate",
    label: "发布日期",
    align: "center",
    minWidth: 160
  },
  {
    prop: "auditStatus",
    label: "状态",
    align: "center",
    minWidth: 110,
    slot: "state"
  },
];


const questionColumns = [
  ...currencys,
  {
    prop: "no",
    label: "问题记录ID",
    align: "center",
    minWidth: 100
  },
  {
    prop: "questionType.name",
    label: "问题类型",
    align: "center",
    minWidth: 80
  },
  {
    prop: "questionLevel.name",
    label: "问题等级",
    align: "center",
    minWidth: 100
  },
  {
    prop: "field.no",
    label: "农田ID",
    align: "center",
    minWidth: 80
  },
  {
    prop: "userInside.no",
    label: "创建人ID",
    align: "center",
    minWidth: 80,
  },
  {
    prop: "userInside.name",
    label: "创建人姓名",
    align: "center",
    minWidth: 120,
  },
  {
    prop: "createAt",
    label: "创建时间",
    minWidth: 160,
    align: "center",
  },
  {
    prop: "stateName",
    label: "审核状态",
    align: "center",
    minWidth: 110,
    slot: "state"
  }
];



const userColumns = [
  code,
  {
    prop: "no",
    label: "员工ID",
    minWidth: 110,
    align: "center"
  },
  {
    prop: "name",
    label: "员工姓名",
    minWidth: 110,
    align: "center"
  },
  {
    prop: "phone",
    label: "联系方式",
    minWidth: 110,
    align: "center"
  },
  {
    prop: "deptName",
    label: "所属部门",
    minWidth: 110,
    align: "center"
  },
  {
    prop: "roleName",
    label: "职位",
    minWidth: 110,
    align: "center"
  },
  {
    prop: "isEnabled",
    label: "禁用启用",
    minWidth: 110,
    align: "center",
    slot: "allowOnline",
    showOverflowTooltip: true
  },
  radio,
];

const solution = [
  code,
  {
    prop: "no",
    label: "方案ID",
    minWidth: 80,
    align: "center"
  },
  {
    prop: "name",
    label: "方案名称",
    minWidth: 110,
    align: "center"
  },
  {
    prop: "cropName",
    label: "适用作物",
    minWidth: 150,
    align: "center"
  },
  {
    prop: "createUserNo",
    label: "创建人ID",
    minWidth: 80,
    align: "center"
  },
  {
    prop: "createAt",
    label: "创建时间",
    minWidth: 150,
    align: "center"
  },
  {
    prop: "approveUserNo",
    label: "审核人ID",
    minWidth: 120,
    align: "center"
  },
  {
    prop: "state",
    label: "状态",
    minWidth: 80,
    align: "center",
    slot: "state"
  },
  radio,
];

export default [orderColumns, questionColumns, userColumns,solution];

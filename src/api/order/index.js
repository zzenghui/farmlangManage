import request from "@/config/axios-config";

/**
 * 获取订单列表
 * @returns
 */
export const getOrderList= () => {
  return request({
    url: '/api/Order',
    method: "get",
  });
};
/**
 * 创建订单
 * @param { Object } data 创建数据
 * @returns
 */
export const postOrderSave= (data) => {
  return request({
    url: `/api/Order`,
    method: "post",
    data
  });
};
/**
 * 获取订单详情
 * @param { Number } ID 唯一
 * @returns
 */
export const getOrderDetail= (ID) => {
  return request({
    url: `/api/Order/${ID}`,
    method: "get",
  });
};
/**
 * 修改订单
 * @param { Object } data 修改数据
 * @param { Number } ID 唯一
 * @returns
 */
export const putOrderUpdate= (ID,data) => {
  return request({
    url: `/api/Order/${ID}`,
    method: "put",
    data
  });
};
/**
 * 删除订单
 * @param { Number } ID 唯一
 * @returns
 */
export const deleteOrder= (ID) => {
  return request({
    url: `/api/Order/${ID}`,
    method: "delete",
  });
};

/**
 * 通过业务Id获取状态记录列表
 * @returns
 */
export const getActivityList= relateId => {
  return request({
    url: `/api/Order/GetActivityList/${relateId}`,
    method: "get",
  });
};

/**
 * 通过业务Id获取最新状态记录
 * @returns
 */
export const getActivity = relateId => {
  return request({
    url: `/api/Order/GetActivity/${relateId}`,
    method: "get",
  });
};


/**
 * 设置订单状态
 */
 export const setOrderState = (no,data)  => {
  return request({
    url: `/api/Order/State/${no}`,
    method: "put",
    data
  });
}

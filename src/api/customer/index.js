import request from "@/config/axios-config";

/**
 * 创建客户信息
 * @param { Object } data  创建客户
 * @returns
 */
export const PostCustomerSave = data => {
  return request({
    url: `/UserCustomer`,
    method: "post",
    data
  });
};
/**
 * 获取客户详情
 * @param { Number } ID  获取客户ID
 * @returns
 */
export const GetCustomerDetail = ID => {
  return request({
    url: `/UserCustomer/${ID}`,
    method: "get",
  });
};

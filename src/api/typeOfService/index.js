import request from "@/config/axios-config";

/**
 * 获取服务类型列表
 * @returns
 */
export const getTypeOfServiceList= () => {
  return request({
    url: '/api/ServiceType',
    method: "get",
  });
};
/**
 * 创建服务类型
 * @param { Object } data 创建数据
 * @returns
 */
export const postTypeOfServiceSeve= (data) => {
  return request({
    url: '/api/ServiceType',
    method: "post",
    data
  });
};
/**
 * 获取服务类型详情
 * @param { Number } ID 唯一
 * @returns
 */
export const getTypeOfServiceDetail= (ID) => {
  return request({
    url: `/api/ServiceType/${ID}`,
    method: "get",
  });
};
/**
 * 修改服务类型
 * @param { Object } data 修改数据
 * @param { Number } ID 唯一
 * @returns
 */
export const putTypeOfServiceUpdate= (ID,data) => {
  return request({
    url: `/api/ServiceType/${ID}`,
    method: "put",
    data
  });
};
/**
 * 删除服务类型
 * @param { Number } ID 唯一
 * @returns
 */
export const deleteTypeOfService= (ID) => {
  return request({
    url: `/api/ServiceType/${ID}`,
    method: "delete",
  });
};

import request from "@/config/axios-config";

/**
 *  分页获取地块记录列表
 * @returns
 */
export const getFieldRecordList = (params) => {
  return request({
    url: `/api/fieldRecord`,
    method: "get",
    params
  });
};

/**
 * 增加地块记录
 * @param { Object } data  添加作地块记录
 * @returns
 */
export const createFieldRecord = data => {
  return request({
    url: `api/fieldRecord`,
    method: "post",
    data
  });
};
/**
 * 通过id获取获取地块记录详情信息
 * @param { Number } id  唯一ID
 * @returns
 */
export const getFieldRecord = id => {
  return request({
    url: `api/fieldRecord/${id}`,
    method: "get",
  });
};
/**
 * 修改地块记录
 * @param { Number } ID  唯一ID
 * @param { Object } data 修改地块记录数据
 * @returns
 */
export const updateFieldRecord = (id,data) => {
  return request({
    url: `/api/fieldRecord/${id}`,
    method: "PUT",
    data
  });
};

/**
 * 删除地块记录
 * @param { Number } ID  唯一ID
 * @returns
 */
export const deleteFieldRecord = id => {
  return request({
    url: `/api/fieldRecord/${ID}`,
    method: "DELETE",
  });
};

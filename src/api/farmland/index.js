import request from "@/config/axios-config";
/**
 * 获取地块
 * @param { Object } params  获取地块列表
 * @returns
 */
export const GetFarmlandList = params => {
  return request({
    url: `/api/Field`,
    method: "get",
    params
  });
};
/**
 * 创建地块
 * @param { Object } data  创建地块数据
 * @returns
 */
export const PostFarmlandSave = data => {
  return request({
    url: `/api/Field`,
    method: "post",
    data
  });
};
/**
 * 地块详情
 * @param { Number } ID  地块详情数据
 * @returns
 */
export const GetFarmlandDetail = ID => {
  return request({
    url: `/api/Field/${ID}`,
    method: "get",
  });
};
/**
 * 修改地块
 * @param { Number } ID  唯一ID
 * @param { Object } data 修改地块数据
 * @returns
 */
export const PutFarmlandUpdate = (ID,data) => {
  return request({
    url: `/api/Field/${ID}`,
    method: "PUT",
    data
  });
};
/**
 * 删除地块
 * @param { Number } ID  唯一ID
 * @returns
 */
export const DeleteFarmland = ID => {
  return request({
    url: `/api/Field/${ID}`,
    method: "DELETE",
  });
};
/**
 * 获取默认中心点
 * @param { String } name 传入区域数据
 * @returns
 */
export const GetFarmlandCaptureCenterPoint = name => {
  return request({
    url: `/api/Field/areaCenter/${name}`,
    method: "get",
  });
};
/**
 * 获取默认中心点周围的地块
 * @param { Object } params 传入数据
 * @returns
 */
export const GetFarmlandCaptureSurrounding = params => {
  return request({
    url: `/api/Field/NearByPoint`,
    method: "get",
    params
  });
};

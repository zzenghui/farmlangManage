import request from "@/config/axios-config";

/**
 * 获取区域
 * @param { String } code  行政区code（可为空）
 * @param { Boolean } allChildren 是否迭代查询所有下级
 * @returns
 */
export const GetAreasDataOne = (code,allChildren) => {
  return request({
    url: `/api/Areas/ByCode/Cascader`,
    method: "get",
    params:{code,allChildren}
  });
};
/**
 * 获取区域管理树
 * @returns
 */
export const GetAreasDataTwo = () => {
  return request({
    url: `/api/Areas/GetCurrentAdminAreaTree`,
    method: "get",
  });
};
/**
 * 通过区域名获取区域列表
 * @param { String } name 参数
 * @returns
 */
export const GetAreasDataNameList = (name) => {
  return request({
    url: `/api/Areas/GetAreaList/${name}`,
    method: "get",
  });
};
/**
 * 设置区域
 * @param { Number } ID 参数
 * @returns
 */
export const PutSetingAreasData = (ID) => {
  return request({
    url: `/api/Areas/SetAdminArea/${ID}`,
    method: "put",
  });
};
/**
 * 删除区域
 * @param { Number } ID 参数
 * @returns
 */
export const PutDeleteAreasData = (ID) => {
  return request({
    url: `/api/Areas/ResetAdminArea/${ID}`,
    method: "put",
  });
};

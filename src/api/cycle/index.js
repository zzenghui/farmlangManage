import request from "@/config/axios-config";

/**
 * 获取种植季
 */
export const getCycle = (fieldId, params) => {
  return request({
    url: `/api/Cycle/${fieldId}`,
    method: "get",
    params
  });
};

/**
 * 根据种植季获取活动
 */
export const getCycleActivity = (fieldId, params) => {
  return request({
    url: `/api/Cycle/${fieldId}/Activity`,
    method: "get",
    params
  });
};

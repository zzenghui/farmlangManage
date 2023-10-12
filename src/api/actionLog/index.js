import request from "@/config/axios-config";

/**
 * 获取操作记录
 * @returns
 */
export const getActionLog = params => {
  return request({
    url: `/api/ActionLog`,
    method: "get",
    params
  });
};

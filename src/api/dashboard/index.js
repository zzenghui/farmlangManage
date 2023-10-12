import request from "@/config/axios-config";

/**
 * 获取统计数据
 */
export const getStatistics = () => {
  return request({
    url: `/api/Dashboard/Statistics`,
    method: "get"
  });
};

/**
 * 获取日志统计
 */
export const getArchiveChart = params => {
  return request({
    url: `/api/Dashboard/ArchiveChart`,
    method: "get",
    params
  });
};

/**
 * 获取服务统计
 */
export const getOrderChart = params => {
  return request({
    url: `/api/Dashboard/OrderChart`,
    method: "get",
    params
  });
};

/**
 * 获取服务统计
 */
export const getQuestionChart = params => {
  return request({
    url: `/api/Dashboard/QuestionChart`,
    method: "get",
    params
  });
};

/**
 * 获取待处理事项
 */
export const getTodoTask = params => {
  return request({
    url: `/api/Dashboard/TodoTask`,
    method: "get",
    params
  });
};

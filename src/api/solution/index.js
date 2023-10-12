import request from "@/config/axios-config";

/**
 * 获取方案库列表
 */
export const getSolutionList = params => {
  return request({
    url: `/api/Solution`,
    method: "get",
    params
  });
};

/**
 * 获取方案库
 */
export const getSolution = id => {
  return request({
    url: `/api/Solution/${id}`,
    method: "get"
  });
};

/**
 * 添加方案库
 */
export const addSolution = data => {
  return request({
    url: `/api/Solution`,
    method: "post",
    data
  });
};

/**
 * 修改方案库
 */
export const updateSolution = (id, data) => {
  return request({
    url: `/api/Solution/${id}`,
    method: "put",
    data
  });
};

/**
 * 删除方案库
 */
export const deleteSolution = id => {
  return request({
    url: `/api/Solution/${id}`,
    method: "delete"
  });
};

/**
 * 审核方案库
 */
export const approveSolution = id => {
  return request({
    url: `/api/Solution/${id}/Approve`,
    method: "put"
  });
};

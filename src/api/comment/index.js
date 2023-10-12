import request from "@/config/axios-config";

/**
 * 新增评论
 * @param { Object } data 添加评论数据
 * @returns
 */
export const postCommentSave = data => {
  return request({
    url: `/api/Comment`,
    method: "post",
    data
  });
};
/**
 * 删除评论
 * @param { Number } id 唯一
 * @returns
 */
export const deleteComment = id => {
  return request({
    url: `/api/Comment/${id}`,
    method: "delete",
  });
};
/**
 * 获取评论列表
 * @param { String } relateId 唯一
 * @returns
 */
export const getCommentList = (relateId) => {
  return request({
    url: `/api/Comment/${relateId}`,
    method: "get",
  });
};

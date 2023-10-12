import request from "@/config/axios-config";

/**
 * 获取问题记录列表
 * @returns
 */
export const getQuestionRecordList = () => {
  return request({
    url: `/Question`,
    method: "get",
  });
};

/**
 * 增加问题记录
 * @param { Object } data 增加数据
 * @returns
 */
export const postQuestionRecordSave = (data) => {
  return request({
    url: `/Question`,
    method: "post",
    data
  });
};

/**
 * 编辑问题记录
 * @param { Object } data 编辑数据
 * @param { Number } id 唯一
 * @returns
 */
export const putQuestionRecordUpdate = (id,data) => {
  return request({
    url: `/Question/${id}`,
    method: "put",
    data
  });
};

/**
 * 获取问题记录详情
 * @param { Number } id 唯一
 * @returns
 */
export const getQuestionRecordDetail = (id) => {
    return request({
      url: `/Question/${id}`,
      method: "get",
    });
};

/**
 * 删除问题记录
 * @param { Number } id 唯一
 * @returns
 */
export const deleteQuestionRecord = (id) => {
  return request({
    url: `/Question/${id}`,
    method: "delete",
  });
};

/**
 * 问题记录(处理 & 完成)
 * @param { Object } data 现在的状态
 * @param { Number } id 唯一
 * @returns
 */
export const patchQuestionRecordProcess = (id,data) => {
  return request({
    url: `/Question/${id}/Activity`,
    method: "put",
    data
  });
};

/**
 * 设定实际方案
 * @param { Number } id 唯一
 * @param { Object } data 数据
 * @returns
 */
export const settingQuestionRecordSolution = (id,data) => {
  return request({
    url: `/Question/${id}/Solution`,
    method: "post",
    data
  });
};

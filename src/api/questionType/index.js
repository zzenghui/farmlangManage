import request from "@/config/axios-config";

/**
 * 获取问题类型列表
 * @returns
 */
export const getQuestionTypeList = () => {
  return request({
    url: `/api/QuestionType`,
    method: "get",
  });
};
/**
 * 新整问题类型
 * @param { Object } data 新增数据
 * @returns
 */
export const postQuestionTypeSave = (data) => {
  return request({
    url: `/api/QuestionType`,
    method: "post",
    data
  });
};
/**
 * 编辑问题类型
 * @param { Object } data 编辑数据
 * @param { Number } id 唯一
 * @returns
 */
export const putQuestionTypeUpdate = (id,data) => {
  return request({
    url: `/api/QuestionType/${id}`,
    method: "put",
    data
  });
};
/**
 * 删除问题类型
 * @param { Number } id 唯一
 * @returns
 */
export const deleteQuestionType = (id) => {
  return request({
    url: `/api/QuestionType/${id}`,
    method: "delete",
  });
};
/**
 * 获取单个问题类型
 * @param { Number } id 唯一
 * @returns
 */
export const getQuestionTypeDetail = (id) => {
  return request({
    url: `/api/QuestionType/${id}`,
    method: "get",
  });
};

import request from "@/config/axios-config";

/**
 * 获取问题等级列表
 * @returns
 */
export const getquestionGradeList = () => {
  return request({
    url: `/api/QuestionLevel`,
    method: "get",
  });
};
/**
 * 新增问题等级
 * @param { Object } data 新增数据
 * @returns
 */
export const postquestionGradeSave = (data) => {
  return request({
    url: `/api/QuestionLevel`,
    method: "post",
    data
  });
};
/**
 * 编辑问题等级
 * @param { Object } data 编辑数据
 * @param { Number } id 唯一
 * @returns
 */
export const putquestionGradeUpdate = (id,data) => {
  return request({
    url: `/api/QuestionLevel/${id}`,
    method: "put",
    data
  });
};
/**
 * 删除问题等级
 * @param { Number } id 唯一
 * @returns
 */
export const deletequestionGrade = (id) => {
  return request({
    url: `/api/QuestionLevel/${id}`,
    method: "delete",
  });
};
/**
 * 获取单个问题等级
 * @param { Number } id 唯一
 * @returns
 */
export const getquestionGradeDetail = (id) => {
  return request({
    url: `/api/QuestionLevel/${id}`,
    method: "get",
  });
};

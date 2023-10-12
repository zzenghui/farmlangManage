import request from "@/config/axios-config";

/**
 * 作物类型列表
 * @returns
 */
export const GetCropTypesList = () => {
  return request({
    url: `/api/CropTypes`,
    method: "get",
  });
};
/**
 * 增加作物类型
 * @param { Object } data  添加作物数据
 * @returns
 */
export const PostCropTypesSave = data => {
  return request({
    url: `/api/CropTypes`,
    method: "post",
    data
  });
};
/**
 * 作物详情
 * @param { Number } ID  唯一ID
 * @returns
 */
export const GetCropTypesDetail= ID => {
  return request({
    url: `/api/CropTypes/${ID}`,
    method: "get",
  });
};
/**
 * 修改作物类型
 * @param { Number } ID  唯一ID
 * @param { Object } data 修改作物数据
 * @returns
 */
export const PutCropTypesUpdate = (ID,data) => {
  return request({
    url: `/api/CropTypes/${ID}`,
    method: "PUT",
    data
  });
};
/**
 * 删除作物类型
 * @param { Number } ID  唯一ID
 * @returns
 */
export const DeleteCropTypes = ID => {
  return request({
    url: `/api/CropTypes/${ID}`,
    method: "DELETE",
  });
};

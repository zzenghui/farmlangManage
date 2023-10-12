import request from "@/config/axios-config";

/**
 * 增加作业类型
 * @param { Object } data  添加作业数据
 * @returns
 */
export const PostCropsWorkTypesSave = data => {
  return request({
    url: `/api/CropWorkTypes`,
    method: "post",
    data
  });
};
/**
 * 通过id获取获取作业类型信息
 * @param { Number } ID  唯一ID
 * @returns
 */
export const GetCropsWorkTypesDetail = ID => {
  return request({
    url: `/api/CropWorkTypes/${ID}`,
    method: "get",
  });
};
/**
 * 修改作业类型
 * @param { Number } ID  唯一ID
 * @param { Object } data 修改作物数据
 * @returns
 */
export const PutCropsWorkTypesUpdate = (ID,data) => {
  return request({
    url: `/api/CropWorkTypes/${ID}`,
    method: "PUT",
    data
  });
};
/**
 * 删除作业类型
 * @param { Number } ID  唯一ID
 * @returns
 */
export const DeleteCropsWorkTypes = ID => {
  return request({
    url: `/api/CropWorkTypes/${ID}`,
    method: "DELETE",
  });
};


/**
 * 获取地块
 * @param { Object } params  获取地块列表
 * @returns
 */
export const getCropWorkTypeList = params => {
  return request({
    url: `/api/CropWorkTypes/`,
    method: 'get',
    params
  });
};

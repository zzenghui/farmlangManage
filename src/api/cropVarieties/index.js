import request from "@/config/axios-config";
/**
 * 增加作物品种列表
 * @returns
 */
export const getCropVarietiesListData = (params) => {
  return request({
    url: `/api/CropVarieties`,
    method: "get",
    params
  });
};

/**
 * 增加作物品种
 * @param { Object } data  添加作物品种数据
 * @returns
 */
export const PostCropVarietiesSave = data => {
  return request({
    url: `/api/CropVarieties`,
    method: "post",
    data
  });
};
/**
 * 通过id获取获取作物品种详情信息
 * @param { Number } ID  唯一ID
 * @returns
 */
export const GetCropVarietiesDetail = ID => {
  return request({
    url: `/api/CropVarieties/${ID}`,
    method: "get",
  });
};
/**
 * 修改作物品种
 * @param { Number } ID  唯一ID
 * @param { Object } data 修改作物品种数据
 * @returns
 */
export const PutCropVarietiesUpdate = (ID,data) => {
  return request({
    url: `/api/CropVarieties/${ID}`,
    method: "PUT",
    data
  });
};
/**
 * 删除作物品种
 * @param { Number } ID  唯一ID
 * @returns
 */
export const DeleteCropVarieties = ID => {
  return request({
    url: `/api/CropVarieties/${ID}`,
    method: "DELETE",
  });
};
/**
 * 作物品种列表
 * @param { Number } ID  唯一ID
 * @returns
 */
export const GetCropVarietiesList = ID => {
  return request({
    url: `/api/CropVarieties/GetList/${ID}`,
    method: "get",
  });
};

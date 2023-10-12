import request from "@/config/axios-config";
/**
 * 增加作物列表
 * @returns
 */
export const getCropsListData = params => {
  return request({
    url: `/api/Crops`,
    method: "get",
    params
  });
};

/**
 * 增加作物
 * @param { Object } data  添加作物数据
 * @returns
 */
export const PostCropsSave = data => {
  return request({
    url: `/api/Crops`,
    method: "post",
    data
  });
};
/**
 * 通过id获取获取作物详情信息
 * @param { Number } ID  唯一ID
 * @returns
 */
export const GetCropsDetail = ID => {
  return request({
    url: `/api/Crops/${ID}`,
    method: "get"
  });
};
/**
 * 修改作物
 * @param { Number } ID  唯一ID
 * @param { Object } data 修改作物数据
 * @returns
 */
export const PutCropsUpdate = (ID, data) => {
  return request({
    url: `/api/Crops/${ID}`,
    method: "PUT",
    data
  });
};
/**
 * 删除作物
 * @param { Number } ID  唯一ID
 * @returns
 */
export const DeleteCrops = ID => {
  return request({
    url: `/api/Crops/${ID}`,
    method: "DELETE"
  });
};
/**
 * 作物列表
 * @param { Number } ID  唯一ID
 * @returns
 */
export const GetCropsList = ID => {
  return request({
    url: `/api/Crops/GetList/${ID}`,
    method: "get"
  });
};
/**
 * 作物树
 * @returns
 */
export const getCropsTree = () => {
  return request({
    url: `/api/Crops/TreeView`,
    method: "get"
  });
};

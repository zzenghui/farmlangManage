import request from "@/config/axios-config";
/**
 * 产品类型列表
 * @returns
 */
export const GetProductTypeList= () => {
  return request({
    url: `/api/ProductType`,
    method: "get",
  });
};
/**
 * 增加产品类型
 * @param { Object } data  添加产品类型数据
 * @returns
 */
export const PostProductTypeSave = data => {
  return request({
    url: `/api/ProductType`,
    method: "post",
    data
  });
};
/**
 * 产品类型详情
 * @param { Number } ID  唯一ID
 * @returns
 */
export const GetProductTypeDetail= ID => {
  return request({
    url: `/api/ProductType/${ID}`,
    method: "get",
  });
};
/**
 * 修改产品类型
 * @param { Number } ID  唯一ID
 * @param { Object } data 修改产品类型数据
 * @returns
 */
export const PutProductTypeUpdate = (ID,data) => {
  return request({
    url: `/api/ProductType/${ID}`,
    method: "PUT",
    data
  });
};
/**
 * 删除产品类型
 * @param { Number } ID  唯一ID
 * @returns
 */
export const DeleteProductType = ID => {
  return request({
    url: `/api/ProductType/${ID}`,
    method: "DELETE",
  });
};

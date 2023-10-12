import request from "@/config/axios-config";

/**
 * 产品列表
 * @param { Object } params
 * @returns
 */
export const getProductList = params => {
  return request({
    url: `/api/Product`,
    method: "get",
    params
  });
};

/**
 * 增加产品
 * @param { Object } data  添加产品数据
 * @returns
 */
export const PostProductSave = data => {
  return request({
    url: `/api/Product`,
    method: "post",
    data
  });
};
/**
 * 产品详情
 * @param { Number } ID  唯一ID
 * @returns
 */
export const GetProductDetail = ID => {
  return request({
    url: `/api/Product/${ID}`,
    method: "get"
  });
};
/**
 * 修改产品
 * @param { Number } ID  唯一ID
 * @param { Object } data 修改产品数据
 * @returns
 */
export const PutProductUpdate = (ID, data) => {
  return request({
    url: `/api/Product/${ID}`,
    method: "PUT",
    data
  });
};
/**
 * 删除产品
 * @param { Number } ID  唯一ID
 * @returns
 */
export const DeleteProduct = ID => {
  return request({
    url: `/api/Product/${ID}`,
    method: "DELETE"
  });
};

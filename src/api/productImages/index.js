import request from "@/config/axios-config";
/**
 * 上传图片
 * @param { Object } data  上传图片数据file
 * @returns
 */
export const PostProductImageUpload = data => {
  return request({
    url: '/api/File?hasThumbImage=true',
    method: "post",
    data
  });
};
/**
 * 增加产品图片
 * @param { Object } data  添加产品图片数据
 * @returns
 */
export const PostProductImagesSave = data => {
  return request({
    url: `/api/ProductImages`,
    method: "post",
    data
  });
};
/**
 * 产品图片详情
 * @param { Number } ID  唯一ID
 * @returns
 */
export const GetProductImagesDetail= ID => {
  return request({
    url: `/api/ProductImages/${ID}`,
    method: "get",
  });
};
/**
 * 修改产品图片
 * @param { Number } ID  唯一ID
 * @param { Object } data 修改产品图片数据
 * @returns
 */
export const PutProductImagesUpdate = (ID,data) => {
  return request({
    url: `/api/ProductImages/${ID}`,
    method: "PUT",
    data
  });
};
/**
 * 删除产品图片
 * @param { Number } ID  唯一ID
 * @returns
 */
export const DeleteProductImages = ID => {
  return request({
    url: `/api/ProductImages/${ID}`,
    method: "DELETE",
  });
};
/**
 * 产品图片分页列表
 * @param { Number } ID  唯一ID
 * @returns
 */
export const GetProductImagesList = ID => {
  return request({
    url: `/api/ProductImages/GetList/${ID}`,
    method: "get",
  });
};
/**
 * 产品图片设置封面
 * @param { Number } ID  唯一ID
 * @returns
 */
export const PutProductImageCover = ID => {
  return request({
    url: `/api/ProductImages/SetCover/${ID}`,
    method: "PUT",
  });
};

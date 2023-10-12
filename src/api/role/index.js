import request from "@/config/axios-config";

/**
 * 获取角色列表
 * @param { Object } params  添加作业数据
 * @returns
 */
export const GetRoleList = params => {
  return request({
    url: `/Role`,
    method: "get",
    params
  });
};
/**
 * 增加角色
 * @param { Object } data  添加作业数据
 * @returns
 */
export const PostRoleSave = data => {
  return request({
    url: `/Role`,
    method: "post",
    data
  });
};
/**
 * 修改角色
 * @param { Number } ID  唯一ID
 * @param { Object } data 修改角色数据
 * @returns
 */
export const PutRoleUpdate = (ID,data) => {
  return request({
    url: `/Role/${ID}`,
    method: "PUT",
    data
  });
};
/**
 * 删除角色
 * @param { Number } ID  唯一ID
 * @returns
 */
export const DeleteRole = ID => {
  return request({
    url: `/Role/${ID}`,
    method: "DELETE",
  });
};

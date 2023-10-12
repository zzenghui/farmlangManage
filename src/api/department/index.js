import request from "@/config/axios-config";

/**
 * 获取部门列表
 * @returns
 */
export const GetDepartmentList = () => {
  return request({
    url: `/Department`,
    method: "get"
  });
};

/**
 * 根据部门获取员工
 */
export const getDepartmentUserList = params => {
  return request({
    url: `/Department/Users`,
    method: "get",
    params
  });
};

/**
 * 增加部门
 * @param { Object } data  添加作业数据
 * @returns
 */
export const PostDepartmentSave = data => {
  return request({
    url: `/Department`,
    method: "post",
    data
  });
};
/**
 * 修改部门
 * @param { Number } ID  唯一ID
 * @param { Object } data 修改作物数据
 * @returns
 */
export const PutDepartmentUpdate = (ID, data) => {
  return request({
    url: `/Department/${ID}`,
    method: "PUT",
    data
  });
};
/**
 * 删除部门
 * @param { Number } ID  唯一ID
 * @returns
 */
export const DeleteDepartment = ID => {
  return request({
    url: `/Department/${ID}`,
    method: "DELETE"
  });
};

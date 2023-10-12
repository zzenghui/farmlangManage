import request from "@/config/axios-config";

/**
 * 获取用户
 * @param { Number } ID  获取用户ID
 * @returns
 */
export const GetEmployeesDetail = ID => {
  return request({
    url: `/UserInside/${ID}`,
    method: "get",
  });
};
/**
 * 创建用户
 * @param { Object } data 创建用户数据
 * @returns
 * */
export const PostEmployeesSave = data =>{
  return request({
    url: `/UserInside`,
    method: "post",
    data
  });
}
/**
 * 编辑用户
 * @param { Number } ID 当前编辑ID
 * @param { Object } data 创建用户数据
 * @returns
 * */
export const PutEmployeesUpdate = (ID,data) =>{
  return request({
    url: `/UserInside/${ID}`,
    method: "PUT",
    data
  });
}
/**
 * 删除用户
 * @param { Number } ID 当前删除ID
 * @returns
 */
export const DeleteEmployees = ID =>{
  return request({
    url: `/UserInside/${ID}`,
    method: "DELETE",
  });
}
/**
 * 启用禁用用户
 * @param { Number } ID 当前启用禁用ID
 * @param { Object } data 对象当前状态
 * @returns
 */
export const PatchEmployeesEnableDisable = (ID,data) =>{
  return request({
    url: `/UserInside/${ID}/Enabled`,
    method: "put",
    data
  });
}




/**
 * 获取员工列表
 * @param {*} id 
 * @returns
 */
export const getUserList = params => {
  return request({
    url: `/UserInside`,
    method: "get",
    params
  });
};
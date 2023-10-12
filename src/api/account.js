import request from "@/config/axios-config";
import setting from "@/config/setting";

/**
 * 登录
 */
export const login = data => {
  return request({
    url: "/auth/login",
    method: "post",
    data
  });
};

/**
 * 获取用户信息
 */
export const getMe = () => {
  return request({
    url: `/auth/me`,
    method: "get"
  });
};

/**
 * 获取验证码
 */
export const verifyCode = () => {
  return request({
    url: `/auth/VerifyCode`,
    method: "get"
  });
};

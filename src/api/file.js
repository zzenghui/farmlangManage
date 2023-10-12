import request from "@/config/axios-config";

/**
 * 上传
 */
export const upload = data => {
  return request({
    url: "/api/File?hasThumbImage=true",
    method: "post",
    data
  });
};

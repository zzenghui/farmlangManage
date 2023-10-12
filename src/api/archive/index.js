import request from "@/config/axios-config";

/**
 * 获取日记模板列表
 */
export const getArchiveList = () => {
  return request({
    url: `/api/Archive`,
    method: "get"
  });
};

/**
 * 获取日记模板
 */
export const getArchive = id => {
  return request({
    url: `/api/Archive/${id}`,
    method: "get"
  });
};

/**
 * 获取日记记录列表
 */
export const getArchiveRecordList = field => {
  return request({
    url: `/api/Archive/Record/${field}`,
    method: "get"
  });
};

/**
 * 获取日记记录
 */
export const getArchiveRecord = id => {
  return request({
    url: `/api/Archive/Record/${id}`,
    method: "get"
  });
};

/**
 * 添加日记记录
 */
export const addArchiveRecord = (fieldId, archiveId, data) => {
  return request({
    url: `/api/Archive/Record/${fieldId}/${archiveId}`,
    method: "post",
    data
  });
};

/**
 * 修改日记记录
 */
export const updateArchiveRecord = (fieldId, archiveId, recordId, data) => {
  return request({
    url: `/api/Archive/Record/${fieldId}/${archiveId}/${recordId}`,
    method: "put",
    data
  });
};

/**
 * 删除日记记录
 */
export const deleteArchiveRecord = recordId => {
  return request({
    url: `/api/Archive/Record/${recordId}`,
    method: "delete"
  });
};

/**
 * 审核日记记录
 */
export const approveArchiveRecord = recordNo => {
  return request({
    url: `/api/Archive/Record/${recordNo}/Approve`,
    method: "put"
  });
};

/**
 * 发布日记记录
 */
export const publishArchiveRecord = recordNo => {
  return request({
    url: `/api/Archive/Record/${recordNo}/Publish`,
    method: "put"
  });
};

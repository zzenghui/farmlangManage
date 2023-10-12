import request from "@/config/axios-config";

/**
 * 获取巡田日历数量
 */
export const getArchiveCalendarCount = () => {
  return request({
    url: `/api/ArchiveCalendar/Count`,
    method: "get"
  });
};

/**
 * 获取巡田日历列表
 */
export const getArchiveCalendarItems = params => {
  return request({
    url: `/api/ArchiveCalendar/Items`,
    method: "get",
    params
  });
};

/**
 * 获取当月每日巡田情况
 */
export const getArchiveCalendarTotalByMonth = date => {
  return request({
    url: `/api/ArchiveCalendar/TotalByMonth`,
    method: "get",
    params:{yearMonth:date}
  });
};

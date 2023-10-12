/**
 * 给定一个参数值，名称，返回值名称， 过滤对应返回名称的值
 * 示例  0 | filterBaseParams('value','type', data)
 * @param {*} currentParams 当前参数值
 * @param {string} currentParamsName 当前参数名称
 * @param {string} ReturnParams 返回参数值名称
 * @param {Array} appendData 引用数据
 * @returns 返回参数值名称对应的值
 */
export const filterBaseParams = (
  currentParams,
  currentParamsName,
  returnParamsName,
  appendData
) => {
  if (currentParams === undefined) return currentParams;
  return appendData.find(item => {
    return item[currentParamsName] === currentParams;
  })[returnParamsName];
};

/**
 * 数字万分化
 * @param {*} num 当前数字
 * @param {*} language 格式化语言
 * @returns 返回万分化之后的数字
 */
export const formatNumberW = (num, language = "us") => {
  if (!isNumber(num)) return;
  num = parseFloat(num);
  const unit = language == "us" ? "W" : "万";
  return num > 1e4 ? (num / 1e4).toFixed(2) + unit : formatNumberFixed(num);
};

/**
 * 数字保留小数点位数
 * @param {*} 保留位数
 * @returns 返回数字保留小数点位数之后的数字
 */
export const formatNumberFixed = (num, digit = 2) => {
  if (!isNumber(num)) return;
  num = parseFloat(num);
  return num != 0 ? num.toFixed(digit) : num;
};

/**
 * 验证数据是否为数字
 * @param {*} 当前数
 * @returns 返回验证结果
 */
function isNumber(num) {
  if (parseFloat(num).toString() == "NaN") {
    return false;
  } else {
    return true;
  }
}

/**
 * 时间格式化
 * @param {*} 当前时间
 * @param {*} 类型
 * @returns 返回格式化时间
 */
import dayjs from "dayjs";
export const formatTime = (time, type = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs(time).format(type);
};

/**
 * 时间格式化
 * @param {*} 当前时间
 * @param {*} 类型
 * @returns 返回格式化时间
 */
export const countdown = time => {
  // const hours = dayjs().diff(dayjs(time), "hours");
  // const minutes = dayjs().diff(dayjs(time), "minutes");
  const seconds = dayjs().diff(dayjs(time), "seconds");
  // .format("HH:mm:ss");
  // console.log(seconds);
  return seconds;
};

/**
 * 性别格式化
 * @param {*} 性别
 * @returns 返回格式化性别
 */
export const filterGender = gender => {
  return gender === 1 ? "男" : gender === 2 ? "女" : "未知";
};


export default {
  // 转换时间格式
  renderTime(date) {
    var dateee = new Date(date).toJSON()
    return new Date(+new Date(dateee) + 8 * 3600 * 1000)
      .toISOString()
      .replace(/T/g, ' ')
      .replace(/\.[\d]{3}Z/, '')
  }
}
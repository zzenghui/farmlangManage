

/**
 * roles - 权限（ 1为管理员， 2是运维人员 )
 */

// 自动化导入
const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  modules.push(value.default)
  return modules
}, [])

export default modules

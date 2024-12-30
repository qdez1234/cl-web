import request from '@/utils/request'

// 查询参数列表
export function listConfig(query) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  })
}

// 查询参数详细
export function getConfig(configId) {
  return request({
    url: '/system/config/' + configId,
    method: 'get'
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: '/system/config/configKey/' + configKey,
    method: 'get'
  })
}

// 新增参数配置
export function addConfig(data) {
  return request({
    url: '/system/config',
    method: 'post',
    data: data
  })
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: '/system/config',
    method: 'put',
    data: data
  })
}

// 删除参数配置
export function delConfig(configId) {
  return request({
    url: '/system/config/' + configId,
    method: 'delete'
  })
}

// 刷新参数缓存
export function refreshCache() {
  return request({
    url: '/system/config/refreshCache',
    method: 'delete'
  })
}

// 数据表配置 --获取数据表详情
export function getDataBaseCode(id) {
  return request({
    url: '/api/businessModel/'+id,
    method: 'get',
  })
}

// 数据表配置 --通过模型id获取模型详情
export function getModel(name) {
  return request({
    url: `/system/model/getModel/${name}`,
    method: 'get',
  })
}
// 数据表配置 --新增模型，生成ID，然后关联给菜单id对应的modelId数据字段
export function addModel(data) {
  return request({
    url: '/system/model/add',
    method: 'post',
    data: data
  })
}
// 数据表配置 --修改模型id数据
export function updateModel(data) {
  return request({
    url: '/system/model/update',
    method: 'post',
    data: data
  })
}
// 数据表配置 --获取数据表详情
export function getBIData() {
  return request({
    url: '/system/dashboard/getAllDashboard',
    method: 'get',
  })
}

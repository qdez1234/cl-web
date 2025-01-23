import useDictStore from '@/store/modules/dict'
import { getDicts } from '@/api/system/dict/data'

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        getDicts(dictType).then(resp => {
          res.value[dictType] = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass }))
          useDictStore().setDict(dictType, res.value[dictType]);
        })
      }
    })
    return toRefs(res.value);
  })()
}
/**
 * 获取字典数据值,直接结构出来
 */

const pendingRequests = {};

export async function getDictValue(dictType) {
  // 先检查是否已经有该字典类型的请求正在进行
  if (pendingRequests[dictType]) {
    return pendingRequests[dictType];
  }

  const dicts = useDictStore().getDict(dictType);
  if (dicts) return dicts;

  // 如果字典为空，开始异步请求
  const request = (async () => {
    try {
      const resp = await getDicts(dictType);
      const data = resp.data.map(p => ({
        label: p.dictLabel,
        value: p.dictValue,
        elTagType: p.listClass,
        elTagClass: p.cssClass,
        raw: p
      }));
      // 将数据存储到字典中
      useDictStore().setDict(dictType, data);
      return data;
    } finally {
      // 请求完成后，移除缓存
      delete pendingRequests[dictType];
    }
  })();

  // 缓存请求
  pendingRequests[dictType] = request;

  // 返回请求的结果
  return request;
}
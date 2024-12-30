<template>
  <el-card shadow="never" ref="queryRef" style="margin-bottom: 12px;" class="search_card" v-show="showSearch">
    <div class="filter-container">
      <div class="search_box">
        <el-form :model="queryParams" ref="queryForm">
          <el-row :gutter="16">
            <el-col :md="4"  v-for="field in normalFields" :key="field.propId">
              <el-form-item :label="field.propName">
                <query-field v-model="queryParams[field.javaField.split('.').slice(-1)]" :column="field" @query="handleQuery" v-if="field.htmlType!='datetime'"/>
                <query-field v-model="dateRange" :column="field" v-else/>
              </el-form-item>
            </el-col>
            <el-col :md="4"  v-for="field in advancedFields" :key="field.propId">
              <el-form-item :label="field.propName">
                <query-field v-model="queryParams[field.javaField.split('.').slice(-1)]" :column="field" @query="handleQuery" v-if="field.htmlType!='datetime'"/>
                <query-field v-model="dateRange" :column="field" v-else/>
              </el-form-item>
            </el-col>
            <el-col :md="6" align="right" style="margin-left: auto;">
              <el-form-item class="search_btn_box">
                <el-button class="filter-item" type="primary" @click="handleQuery">搜索</el-button>
                <el-button class="filter-item" style="margin-left: 8px;" @click="resetQuery">重置</el-button>
                <a @click="toggleAdvanced" style="margin:0 4px 0 8px ;vertical-align: middle;" v-if="queryFields.length>4">
                  {{ advanced ? '收起' : '展开' }}
                  <el-icon v-if="!advanced"><ArrowDown /></el-icon>
                  <el-icon v-if="advanced"><ArrowUp /></el-icon>
                </a>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script setup name="QueryForm">
import QueryField from "./queryField.vue"
import { getQueryDefaultValue } from '@/utils/erp.js'
import { computed } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
  queryParams: {
    type: Object,
    default: undefined
  },
  formOptions: {
    type: Object,
    default: undefined
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  advanced: {
    type: Boolean,
    default: false
  }
})

//是否全屏
const dateRange = computed({
  get() {
    let result = []
    let search = props.queryParams
    if (typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params)) {
      result = result.concat([search.params['beginTime'], search.params['endTime']])
    }
    return result
  },
  set(value) {
    proxy.addDateRange(props.queryParams, value)
  }
});

const emit = defineEmits(['toggleAdvanced','query'])

// const dateRange = ref([])

// watch(dateRange, (value)=>{
//   proxy.addDateRange(props.queryParams, value)
// }, {deep:true, immediate:true})

const queryFields = computed(()=>{
  let result = []
  if (props.formOptions.formModelList.find(model=>{return model.modelType==='main'})) {
    result = result.concat(props.formOptions.formModelList.find(model=>{return model.modelType==='main'}).model.modelPropertiesList.filter(i=>{return i.isQuery === '1'}).sort((a,b)=>{return a.sort-b.sort}))
  }
  if (props.formOptions.formModelList.filter(model=>{return model.modelType==='sub'}).length>0) {
    props.formOptions.formModelList.filter(model=>{return model.modelType==='sub'}).forEach(item=>{
      result = result.concat(item.model.modelPropertiesList.filter(i=>{return i.isQuery === '1'}).sort((a,b)=>{return a.sort-b.sort}))
    })
  }
  return result
})

const normalFields = computed(()=>{
  return queryFields.value.slice(0,4)
})

const advancedFields = computed(()=>{
  return props.advanced?queryFields.value.slice(4):[]
})

/** 展开按钮操作 */
function toggleAdvanced() {
  emit('toggleAdvanced')
}

function handleQuery() {
  props.queryParams['pageNum'] = 1
  emit('query')
}

function resetQuery() {
  const queryDefaultValue = getQueryDefaultValue({}, props.formOptions.formModelList)

  dateRange.value = []
  queryDefaultValue["pageNum"] = 1
  queryDefaultValue["pageSize"] = props.queryParams.pageSize
  Object.keys(props.queryParams).forEach(item=>{
    props.queryParams[item] = queryDefaultValue[item]
  })
  // Object.assign(props.queryParams, queryDefaultValue)
  emit('query')
}
</script>

<style lang="scss" scoped>

</style>
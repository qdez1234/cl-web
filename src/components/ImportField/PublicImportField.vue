<template>
  <el-autocomplete
    popper-class="import-field"
    v-model="state"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    :trigger-on-focus="triggerOnFocus"
    @select="handleSelect"
    @clear="handleClear"
    clearable
    v-bind="$attrs"
    >
    <template #default="{ item }">
      <span v-for="(column, index) in columns" :key="index" :class="index%2==0?'code':'name'">{{ item[column.prop] }}</span>
    </template>
  </el-autocomplete>
</template>

<script setup name="PublicImportField">
import request from '@/utils/request'


const { proxy } = getCurrentInstance()
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {}
  },
  options: {
    type: Object,
    default: {}
  }
})

const placeholder = computed(() => {
  return props.options?.placeholder || "请选择"
})

const triggerOnFocus = computed(() => {
  return props.options?.triggerOnFocus || true
})

const columns = computed(() => {
  return props.options?.columns || []
})

const label = computed(() => {
  return props.options?.label || "label"
})

const api = computed(() => {
  return props.options?.api || ""
})

const queryParams = computed(() => {
  return props.options?.queryParams || {}
})

const emit = defineEmits([ 'update:modelValue', 'import' ])

const state = ref("")

watch(() => props.modelValue, (val) => {
  state.value = val?val[label.value] : ''
}, { immediate: true });

// 后台查询数据
const querySearch = (queryString, cb) => {
  let query = Object.assign({searchValue: queryString}, queryParams.value)
  if (api.value) {
    request({ url: api.value, method: 'get', params: query }).then(response => {
      cb(response.rows)
    })
  } else {
    cb([])
  }
}

// 选中后处理事件
const handleSelect = (item) => {
  emit('update:modelValue', item)
  emit('import', item)
}

// 处理清除事件
const handleClear = () => {
  emit('update:modelValue', {})
  emit('import', {})
}

</script>

<style lang="scss" scoped>
.import-field {
  li {
    line-height: normal;
    padding: 7px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
      margin: 0px 8px 0px 8px;
      float: right; 
      font-size: 12px;
    }
    .code {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      float: left
    }
    .highlighted .code {
      color: #ddd;
    }
  }
}
.el-form-item__content .import-field {
  width: 100%;
}
</style>

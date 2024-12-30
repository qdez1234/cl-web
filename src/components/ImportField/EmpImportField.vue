<template>
  <PublicImportField
    v-bind="$attrs"
    v-model="state"
    :options="options" 
    @import="handleImport"
  />
</template>

<script setup name="EmpImportField">

import PublicImportField from "./PublicImportField"

const { proxy } = getCurrentInstance()
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {}
  },
  queryParams: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits([ 'update:modelValue', 'import', ])

const state = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const options = ref({
  columns: [
    {prop:'empCode', label: '工号'},
    {prop:'empName', label: '姓名'},
  ],
  label: 'empName',
  api: "/base/emp/publicImportQuery",
  queryParams: props.queryParams,
})


const handleImport = (item) => {
  emit('import', item)
  emit('update:modelValue', item)
}
</script>

<style lang="scss" scoped>

</style>

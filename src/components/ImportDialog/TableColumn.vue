<template>
  <!-- 单选框、下拉框（radio、select） -->
  <el-table-column :label="column.propName" :prop="column.javaField" :width="column.width || 80" v-if="(column.htmlType==='radio' || column.htmlType==='select' || column.htmlType==='checkbox')">
    <template #default="scope">
      <dict-tag :options="dictOptions" :value="scope.row[column.javaField]" />
    </template>
  </el-table-column>
  <el-table-column :label="column.propName" :prop="column.javaField" :width="column.width || 180" v-else />
</template>

<script setup name="TableColumn">

const { proxy } = getCurrentInstance();

const props = defineProps({
  column: {
    type: Object,
    default() {
      return {}
    }
  },
})
const dictOptions = computed(()=>{
  if(props.column.dictType && props.column.dictType!='') {
    return proxy.useDict(props.column.dictType)[props.column.dictType].value
  }
})
</script>

<style>
</style>

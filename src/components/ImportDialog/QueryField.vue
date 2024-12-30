<template>
  <!-- 单选框（radio） -->
  <el-radio-group size="small" @change="handleQuery" v-model="state" v-if="column.htmlType==='radio'">
    <el-radio-button v-for="dict in dictOptions"
      :key="dict.dictValue"
      :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue" 
    >{{dict.dictLabel}}</el-radio-button>
    <el-radio-button label="">所有</el-radio-button>
  </el-radio-group>
  <!-- 下拉框（select） -->
  <el-select size="small" @change="handleQuery" v-model="state" :placeholder="`请选择${column.propName}`" v-else-if="column.htmlType==='select'">
    <el-option v-for="(dict, index) in dictOptions" :key="index" :label="dict.label" :value="dict.value" />
  </el-select>
  <!-- 复选框（已配置字典） checkbox -->
  <el-checkbox-group size="small" v-model="state" v-else-if="column.htmlType==='checkbox'">
    <el-checkbox
      v-for="dict in dictOptions"
      :key="dict.dictValue"
      :label="dict.dictValue">
      {{dict.dictLabel}}
    </el-checkbox>
  </el-checkbox-group>
  <!-- 日期控件 datetime -->
  <el-date-picker v-else-if="column.htmlType==='datetime'"
    v-model="state"
    size="small"
    value-format="YYYY-MM-DD"
    type="daterange"
    range-separator="~"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
  ></el-date-picker>
  <!--默认 input-->
  <el-input v-model="state" size="small" :placeholder="`请输入${column.propName}`" @keyup.enter="handleQuery" v-else></el-input>
</template>

<script setup name="QueryField">

const { proxy } = getCurrentInstance();

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object, Date],
    default: () => undefined,
  },
  column: {
    type: Object,
    default() {
      return {}
    }
  },
})
const emits = defineEmits(['update:modelValue', 'query'])

const dictOptions = computed(()=>{
  if(props.column.dictType && props.column.dictType!='') {
    return proxy.useDict(props.column.dictType)[props.column.dictType].value.map(item=>{return { dictValue:item.value, dictLabel:item.label, label:item.label, value: item.value }})
  }
})

const state = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})

const handleQuery = () => {
  emits('query')
}

</script>

<style>
  .el-date-editor {
    width:100% !important;
  }
</style>

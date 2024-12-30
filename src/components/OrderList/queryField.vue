<template>
  <!-- 文本框 input-->
  <el-input v-model="state" v-if="column.htmlType==='input'"></el-input>
  <!-- 文本域 textarea-->
  <el-input v-model="state" type="textarea" v-else-if="column.htmlType==='textarea'"></el-input>
  <!-- 单选框（已配置字典） radio -->
  <el-radio-group @change="handleRadioChange" v-model="state" v-else-if="(column.htmlType==='radio' || column.htmlType==='select') && column.dictType != ''">
    <el-radio-button v-for="dict in dictOptions"
      :key="dict.dictValue"
      :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue" 
    >{{dict.dictLabel}}</el-radio-button>
    <el-radio-button label="">所有数据</el-radio-button>
  </el-radio-group>
  <!-- 单选框（未配置字典） radio -->
  <el-radio-group v-model="state" v-else-if="(column.htmlType==='radio' || column.htmlType==='select') && column.dictType === ''">
    <el-radio-button>请选择字典生成</el-radio-button>
  </el-radio-group>
  <!-- 复选框（已配置字典） checkbox -->
  <el-checkbox-group v-model="state" v-else-if="column.htmlType==='checkbox' && column.dictType != ''">
    <el-checkbox-button
      v-for="dict in dictOptions"
      :key="dict.dictValue"
      :label="dict.dictValue">
      {{dict.dictLabel}}
    </el-checkbox-button>
  </el-checkbox-group>
  <!-- 复选框（未配置字典） checkbox -->
  <el-checkbox-group v-model="state" v-else-if="column.htmlType==='checkbox' && column.dictType === ''">
    <el-checkbox-button label="请选择字典生成"></el-checkbox-button>
  </el-checkbox-group>
  <!-- 日期范围datetime -->
  <el-date-picker v-else-if="column.htmlType==='datetime'"
    v-model="state"
    value-format="YYYY-MM-DD"
    type="daterange"
    range-separator="~"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
  ></el-date-picker>

  <!--默认 input-->
  <el-input v-model="state" clearable v-else></el-input>
</template>

<script setup name="QueryField">
import { computed } from "vue";
// import { getDicts } from '@/api/system/dict/data'
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
const emit = defineEmits(['update:modelValue','query'])

const dictOptions = computed(()=>{
  if(props.column.dictType && props.column.dictType!='') {
    return proxy.useDict(props.column.dictType)[props.column.dictType].value.map(item=>{return { dictValue:item.value, dictLabel:item.label }})
  }
})

const state = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

function handleRadioChange(value) {
  emit('update:modelValue', value)
  emit('query')
}

// if(props.column.dictType && props.column.dictType!='') {
//   getDicts(props.column.dictType).then(response => {
//     response.data.forEach(item => {
//       let temp = item;
//       temp.label = item.dictLabel;
//       temp.value = item.dictValue;
//       temp.raw = item;
//       dictOptions.value.push(temp);
//     });
//   });
// }
</script>

<style lang="scss" scoped>
  :deep(.el-select, .el-date-editor) {
    width:100% !important;
  }
</style>
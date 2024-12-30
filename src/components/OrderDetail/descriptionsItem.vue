<template>
  <!-- 文本域 textarea-->
  <span v-if="column.htmlType==='textarea' && hasSecurityPermission">{{ state }}</span>
  <!-- 下拉框（已配置字典） select -->
  <dict-tag :options="dictOptions" :value="state" v-else-if="column.htmlType==='select' && column.dictType != '' && hasSecurityPermission"/>
  <!-- 下拉框（未配置字典） select -->
  <span v-else-if="column.htmlType==='select' && column.dictType === '' && hasSecurityPermission">{{ state }}</span>
  <!-- 单选框（已配置字典） radio -->
  <el-radio-group v-model="state" disable v-else-if="column.htmlType==='radio' && column.dictType != '' && hasSecurityPermission">
    <el-radio v-for="dict in dictOptions"
      :key="dict.dictValue"
      :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue" 
    >{{dict.label}}</el-radio>
  </el-radio-group>
  <!-- 单选框（未配置字典） radio -->
  <el-radio-group v-model="state" disable v-else-if="column.htmlType==='radio' && column.dictType === '' && hasSecurityPermission">
    <el-radio>请选择字典生成</el-radio>
  </el-radio-group>
  <!-- 复选框（已配置字典） checkbox -->
  <el-checkbox-group v-model="state" disabled v-else-if="column.htmlType==='checkbox' && column.dictType != '' && hasSecurityPermission">
    <el-checkbox
      v-for="dict in dictOptions"
      :key="dict.dictValue"
      :label="dict.dictValue">
      {{dict.dictLabel}}
    </el-checkbox>
  </el-checkbox-group>
  <!-- 复选框（未配置字典） checkbox -->
  <el-checkbox-group v-model="state" disabled v-else-if="column.htmlType==='checkbox' && column.dictType === '' && hasSecurityPermission">
    <el-checkbox label="请选择字典生成"></el-checkbox>
  </el-checkbox-group>
  <!-- 日期控件 datetime -->
  <span v-else-if="column.htmlType==='datetime' && hasSecurityPermission" >{{ state }}</span>
  <!-- 图片上传 imageUpload -->
  <image-upload v-model="state" disabled v-else-if="column.htmlType==='imageUpload' && hasSecurityPermission"/>
  <!-- 文件上传 fileUpload -->
  <file-upload v-model="state" disabled v-else-if="column.htmlType==='fileUpload' && hasSecurityPermission"/>
  <!-- 富文本控件 -->
  <span v-else-if="column.htmlType==='editor' && hasSecurityPermission" >{{ state }}</span>
  <!--默认 input-->
  <span v-else-if="hasSecurityPermission">{{ state }}</span>

  <!-- 无权限 -->
  <span v-else>***</span>

</template>

<script setup name="DescriptionsItem">
import { checkPermi } from "@/utils/permission.js"
import { computed } from "vue";

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

const dictOptions = computed(()=>{
  if(props.column.dictType && props.column.dictType!='') {
    return proxy.useDict(props.column.dictType)[props.column.dictType].value.map(item=>{return { dictValue:item.value, dictLabel:item.label, label:item.label, value: item.value }})
  }
})

const hasSecurityPermission = computed(()=>{
  return (props.column.securePermission&&props.column.securePermission!=null&&props.column.securePermission!='')?checkPermi(props.column.securePermission.split(',').map(item=>{ return item.trim() })):true;
})

const state = computed({
  get() {
    return props.modelValue
  },
})

</script>

<style>
  .el-select, .el-date-editor {
    width:100% !important;
  }
</style>

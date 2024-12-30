<template>
  <!-- 文本域 textarea-->
  <el-input v-model="state" :placeholder="isRequire?`请输入${column.propName}`:''" type="textarea" v-if="column.htmlType==='textarea' && isEdit"></el-input>
  <el-input v-model="state" readonly backgroundColor="disable" v-else-if="column.htmlType==='textarea' && !isEdit && hasSecurityPermission"></el-input>
  <!-- 下拉框（已配置字典） select -->
  <el-select 
    v-model="state" 
    clearable
    :placeholder="isRequire?`请选择${column.propName}`:''"
    v-else-if="column.htmlType==='select' && column.dictType != '' && isEdit">
    <el-option v-for="dict in dictOptions"
      :key="dict.dictValue"
      :label="dict.dictLabel"
      :value="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue" 
      >
    </el-option>
  </el-select>
  <el-input :value="selectDictLabel(dictOptions, state)" v-else-if="column.htmlType==='select' && column.dictType != '' && !isEdit && hasSecurityPermission" readonly backgroundColor="disable"/>
  <!-- 下拉框（未配置字典） select -->
  <el-select v-model="state" :placeholder="isRequire?`请选择${column.propName}`:''" v-else-if="column.htmlType==='select' && column.dictType === '' && isEdit">
    <el-option label="请选择字典生成" value="" ></el-option>
  </el-select>
  <el-input value="" v-else-if="column.htmlType==='select' && column.dictType == '' && !isEdit && hasSecurityPermission" readonly backgroundColor="disable"/>
  <!-- 单选框（已配置字典） radio -->
  <el-radio-group v-model="state" v-else-if="column.htmlType==='radio' && column.dictType != '' && isEdit">
    <el-radio v-for="dict in dictOptions"
      :key="dict.dictValue"
      :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue" 
    >{{dict.label}}</el-radio>
  </el-radio-group>
  <el-radio-group v-model="state" disable v-else-if="column.htmlType==='radio' && column.dictType != '' && !isEdit && hasSecurityPermission">
    <el-radio v-for="dict in dictOptions"
      :key="dict.dictValue"
      :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue" 
    >{{dict.label}}</el-radio>
  </el-radio-group>
  <!-- 单选框（未配置字典） radio -->
  <el-radio-group v-model="state" v-else-if="column.htmlType==='radio' && column.dictType === ''  && isEdit">
    <el-radio>请选择字典生成</el-radio>
  </el-radio-group>
  <el-radio-group v-model="state" disable v-else-if="column.htmlType==='radio' && column.dictType === ''  && !isEdit && hasSecurityPermission">
    <el-radio>请选择字典生成</el-radio>
  </el-radio-group>
  <!-- 复选框（已配置字典） checkbox -->
  <el-checkbox-group v-model="state" v-else-if="column.htmlType==='checkbox' && column.dictType != '' && isEdit">
    <el-checkbox
      v-for="dict in dictOptions"
      :key="dict.dictValue"
      :label="dict.dictValue">
      {{dict.dictLabel}}
    </el-checkbox>
  </el-checkbox-group>
  <el-checkbox-group v-model="state" disabled v-else-if="column.htmlType==='checkbox' && column.dictType != '' && !isEdit && hasSecurityPermission">
    <el-checkbox
      v-for="dict in dictOptions"
      :key="dict.dictValue"
      :label="dict.dictValue">
      {{dict.dictLabel}}
    </el-checkbox>
  </el-checkbox-group>
  <!-- 复选框（未配置字典） checkbox -->
  <el-checkbox-group v-model="state" v-else-if="column.htmlType==='checkbox' && column.dictType === '' && isEdit">
    <el-checkbox label="请选择字典生成"></el-checkbox>
  </el-checkbox-group>
  <el-checkbox-group v-model="state" disabled v-else-if="column.htmlType==='checkbox' && column.dictType === '' && !isEdit && hasSecurityPermission">
    <el-checkbox label="请选择字典生成"></el-checkbox>
  </el-checkbox-group>
  <!-- 日期控件 datetime -->
  <el-date-picker clearable v-model="state" :type="column.dateOnly==='1'?'date':'datetime'" :value-format="column.dateOnly==='1'?'YYYY-MM-DD':'YYYY-MM-DD hh:mm:ss'" :format="column.dateOnly==='1'?'YYYY-MM-DD':'YYYY-MM-DD hh:mm:ss'" :placeholder="isRequire?`请选择${column.propName}`:''" v-else-if="column.htmlType==='datetime' && isEdit && hasSecurityPermission"></el-date-picker>
  <el-input v-model="state" v-else-if="column.htmlType==='datetime' && !isEdit" readonly backgroundColor="disable" />
  <!-- 图片上传 imageUpload -->
  <image-upload v-model="state" v-else-if="column.htmlType==='imageUpload' && isEdit"/>
  <image-upload v-model="state" disabled v-else-if="column.htmlType==='imageUpload' && !isEdit && hasSecurityPermission"/>
  <!-- 文件上传 fileUpload -->
  <file-upload v-model="state" v-else-if="column.htmlType==='fileUpload' && isEdit"/>
  <file-upload v-model="state" disabled v-else-if="column.htmlType==='fileUpload' && !isEdit && hasSecurityPermission"/>
  <!-- 富文本控件 -->
  <editor v-model="state" :min-height="192" :placeholder="`请输入${column.label}`" v-else-if="column.htmlType==='editor' && isEdit"/>
  <editor v-model="state" :min-height="192" readOnly v-else-if="column.htmlType==='editor' && !isEdit && hasSecurityPermission"/>
  <!--默认 input-->
  <el-input v-model="state" :placeholder="isRequire?`请输入${column.propName}`:''" v-else-if="isEdit"></el-input>
  <el-input v-model="state" readonly backgroundColor="disable" v-else-if="!isEdit && hasSecurityPermission"></el-input>

  <!-- 无权限 -->
  <el-input value="***" readonly backgroundColor="disable" v-else></el-input>

</template>

<script setup name="Field">
import { checkPermi } from "@/utils/permission.js"
// import { getDicts } from '@/api/system/dict/data'
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
const emit = defineEmits(['update:modelValue'])

const dictOptions = computed(()=>{
  if(props.column.dictType && props.column.dictType!='') {
    return proxy.useDict(props.column.dictType)[props.column.dictType].value.map(item=>{return { dictValue:item.value, dictLabel:item.label, label:item.label, value: item.value }})
  }
})

const isRequire = computed(()=>{
  return props.column.isRequired === '1' || false;
})
const hasSecurityPermission = computed(()=>{
  return (props.column.securePermission&&props.column.securePermission!=null&&props.column.securePermission!='')?checkPermi(props.column.securePermission.split(',').map(item=>{ return item.trim() })):true;
})
const isEdit = computed(()=>{
  return !(props.column.isReadonly === '1');
})
const state = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// if(props.column.dictType && props.column.dictType!='') {
//   getDicts(props.column.dictType).then(response => {
//     response.data.forEach(item => {
//       let temp = item
//       temp.label = item.dictLabel
//       temp.value = item.dictValue
//       temp.elTagType = item.listClass
//       temp.elTagClass = item.cssClass
//       temp.raw = item
//       dictOptions.value.push(temp)
//     });
//   });
// }
</script>

<style>
  .el-select, .el-date-editor {
    width:100% !important;
  }
  .el-input__inner[backgroundColor="disable"] {
    background-color: #f4f4f5;
  }
</style>

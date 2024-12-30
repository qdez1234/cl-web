<template>
  <!-- 超链接 -->
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-if="column.htmlType==='input' && column.isDescription==='1' && isReadonly">
    <template #default="scope">
      <a href="#" @click="handleDetail(scope.row)" class="link-type">{{ scope.row[column.javaField] }}</a>
    </template>
  </el-table-column>
  <!-- 文本域 textarea-->
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='textarea' && isReadonly && hasSecurityPermission"></el-table-column>
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='textarea' && !isReadonly && hasSecurityPermission">
    <template #default="{ row, $index }">
      <el-form-item label-width="0px" 
        :prop="`${detailField}.${$index}.${column.javaField}`"
        :rules="rules?rules.concat([{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]):[{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]"
        >
        <el-input v-model="row[column.javaField]" type="textarea" autosize/>
      </el-form-item>
    </template>
  </el-table-column>
  <!-- 下拉框（已配置字典） select -->
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='select' && column.dictType && column.dictType != null && column.dictType != '' && isReadonly && hasSecurityPermission">
    <template #default="scope">
      <dict-tag :options="dictOptions" :value="scope.row[javaFields.slice(0,1)]" v-if="javaFields.length===1"/>
      <dict-tag :options="dictOptions" :value="scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)]" v-if="javaFields.length===2"/>
      <dict-tag :options="dictOptions" :value="scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)][javaFields.slice(2,3)]" v-if="javaFields.length===3"/>
      <dict-tag :options="dictOptions" :value="scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)][javaFields.slice(2,3)][javaFields.slice(3,4)]" v-if="javaFields.length===4"/>
    </template>
  </el-table-column>
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='select' && column.dictType !== '' && column.dictType && !isReadonly && hasSecurityPermission">
    <template #default="{ row, $index }">
      <el-form-item label-width="0px" 
        :prop="`${detailField}.${$index}.${column.javaField}`"
        :rules="rules?rules.concat([{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]):[{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]"
        >
        <el-select v-model="row[column.javaField]">
          <el-option
            v-for="item in dictOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </template>
  </el-table-column>
  <!-- 下拉框（未配置字典） select -->
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='select' && (!column.dictType || column.dictType === null || column.dictType === '') && isReadonly && hasSecurityPermission"></el-table-column>
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='select' && (!column.dictType || column.dictType === null || column.dictType === '') && !isReadonly && hasSecurityPermission">
    <template #default="{ row, $index }">
      <el-form-item label-width="0px" 
        :prop="`${detailField}.${$index}.${column.javaField}`"
        :rules="rules?rules.concat([{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]):[{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]"
        >
        <el-input v-model="row[column.javaField]"/>
      </el-form-item>
    </template>
  </el-table-column>
  <!-- 单选框（已配置字典） radio -->
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='radio' && column.dictType && column.dictType != null && column.dictType != '' && isReadonly && hasSecurityPermission">
    <template #default="scope">
      <el-radio-group disable v-model="scope.row[javaFields.slice(0,1)]" v-if="javaFields.length===1">
        <el-radio v-for="dict in dictOptions" :key="dict.dictValue" :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue">{{dict.label}}</el-radio>
      </el-radio-group>
      <el-radio-group disable v-model="scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)]" v-else-if="javaFields.length===2">
        <el-radio v-for="dict in dictOptions" :key="dict.dictValue" :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue">{{dict.label}}</el-radio>
      </el-radio-group>
      <el-radio-group disable v-model="scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)][javaFields.slice(2,3)]" v-else-if="javaFields.length===3">
        <el-radio v-for="dict in dictOptions" :key="dict.dictValue" :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue">{{dict.label}}</el-radio>
      </el-radio-group>
      <el-radio-group disable v-model="scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)][javaFields.slice(2,3)][javaFields.slice(3,4)]" v-else-if="javaFields.length===4">
        <el-radio v-for="dict in dictOptions" :key="dict.dictValue" :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue">{{dict.label}}</el-radio>
      </el-radio-group>
    </template>
  </el-table-column>
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='radio' && column.dictType && column.dictType != null && column.dictType != '' && !isReadonly && hasSecurityPermission">
    <template #default="{ row, $index }">
      <el-form-item label-width="0px" 
        :prop="`${detailField}.${$index}.${column.javaField}`"
        :rules="rules?rules.concat([{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]):[{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]"
        >
        <el-radio-group v-model="row[column.javaField]">
          <el-radio v-for="dict in dictOptions" :key="dict.dictValue" :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue">{{dict.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </template>
  </el-table-column>
  <!-- 单选框（未配置字典） radio -->
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='radio' && (!column.dictType || column.dictType === null || column.dictType === '' && isReadonly) && hasSecurityPermission">
    <template #default="">
      <el-radio-group disable v-model="undefined">
        <el-radio>请选择字典生成</el-radio>
      </el-radio-group>
    </template>
  </el-table-column>
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='radio' && (!column.dictType || column.dictType === null || column.dictType === '') && !isReadonly && hasSecurityPermission">
    <template #default="{ $index }">
      <el-form-item label-width="0px" 
        :prop="`${detailField}.${$index}.${column.javaField}`"
        :rules="rules?rules.concat([{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]):[{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]"
        >
        <el-radio-group v-model="undefined">
          <el-radio>请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
    </template>
  </el-table-column>
  <!-- 复选框（已配置字典） checkbox -->
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='checkbox' && column.dictType && column.dictType != null && column.dictType != '' && isReadonly && hasSecurityPermission">
    <template #default="scope">
      <el-checkbox-group disable v-model="scope.row[javaFields.slice(0,1)]" v-if="javaFields.length===1">
        <el-checkbox v-for="dict in dictOptions" :key="dict.dictValue" :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue">{{dict.label}}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group disable v-model="scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)]" v-else-if="javaFields.length===2">
        <el-checkbox v-for="dict in dictOptions" :key="dict.dictValue" :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue">{{dict.label}}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group disable v-model="scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)][javaFields.slice(2,3)]" v-else-if="javaFields.length===3">
        <el-checkbox v-for="dict in dictOptions" :key="dict.dictValue" :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue">{{dict.label}}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group disable v-model="scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)][javaFields.slice(2,3)][javaFields.slice(3,4)]" v-else-if="javaFields.length===4">
        <el-checkbox v-for="dict in dictOptions" :key="dict.dictValue" :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue">{{dict.label}}</el-checkbox>
      </el-checkbox-group>
    </template>
  </el-table-column>
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='checkbox' && column.dictType && column.dictType != null && column.dictType != '' && !isReadonly && hasSecurityPermission">
    <template #default="scope">
      <el-form-item label-width="0px" 
        :prop="`${detailField}.${$index}.${column.javaField}`"
        :rules="rules?rules.concat([{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]):[{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]"
        >
        <el-checkbox-group v-model="scope.row[column.javaField]">
          <el-checkbox v-for="dict in dictOptions" :key="dict.dictValue" :label="column.javaType=='Integer'||column.javaType=='Long'?parseInt(dict.value):dict.dictValue">{{dict.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </template>
  </el-table-column>
  <!-- 复选框（未配置字典） checkbox -->
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='checkbox' && (!column.dictType || column.dictType === null || column.dictType === '' && isReadonly) && hasSecurityPermission">
    <template #default="">
      <el-checkbox-group disable v-model="undefined">
        <el-checkbox>请选择字典生成</el-checkbox>
      </el-checkbox-group>
    </template>
  </el-table-column>
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='checkbox' && (!column.dictType || column.dictType === null || column.dictType === '') && !isReadonly && hasSecurityPermission">
    <template #default="{ $index }">
      <el-form-item label-width="0px" 
        :prop="`${detailField}.${$index}.${column.javaField}`"
        :rules="rules?rules.concat([{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]):[{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]"
        >
        <el-checkbox-group v-model="undefined">
          <el-checkbox>请选择字典生成</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </template>
  </el-table-column>
  <!-- 日期控件 datetime -->
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='datetime' && isReadonly && hasSecurityPermission">
    <template #default="scope">
      <span v-if="javaFields.length===1">{{ parseTime(scope.row[javaFields.slice(0,1)], column.dateOnly==='1'?'{y}-{m}-{d}':'{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      <span v-else-if="javaFields.length===2">{{ parseTime(scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)], column.dateOnly==='1'?'{y}-{m}-{d}':'{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      <span v-else-if="javaFields.length===3">{{ parseTime(scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)][javaFields.slice(2,3)], column.dateOnly==='1'?'{y}-{m}-{d}':'{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      <span v-else-if="javaFields.length===4">{{ parseTime(scope.row[javaFields.slice(0,1)][javaFields.slice(1,2)][javaFields.slice(2,3)][javaFields.slice(3,4)], column.dateOnly==='1'?'{y}-{m}-{d}':'{y}-{m}-{d} {h}:{i}:{s}') }}</span>
    </template>
  </el-table-column>
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="column.htmlType==='datetime' && !isReadonly && hasSecurityPermission">
    <template #default="{ row, $index }">
      <el-form-item label-width="0px" 
        :prop="`${detailField}.${$index}.${column.javaField}`"
        :rules="rules?rules.concat([{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]):[{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]"
        >
        <el-date-picker clearable v-model="row[column.javaField]" :type="column.dateOnly==='1'?'date':'datetime'" :value-format="column.dateOnly==='1'?'YYYY-MM-DD':'YYYY-MM-DD hh:mm:ss'" :format="column.dateOnly==='1'?'YYYY-MM-DD':'YYYY-MM-DD hh:mm:ss'" :placeholder="isRequire?`请选择${column.propName}`:''"></el-date-picker>
      </el-form-item>
    </template>
  </el-table-column>
  <!--默认 input-->
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="isReadonly && hasSecurityPermission" :formatter="formatter"></el-table-column>
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else-if="!isReadonly && hasSecurityPermission">
    <template #default="{ row, $index }">
      <el-form-item label-width="0px" 
        :prop="`${detailField}.${$index}.${column.javaField}`"
        :rules="rules?rules.concat([{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]):[{ required: isRequire, message: `${column.propName}不能为空`, trigger: 'blur' },]"
        >
        <el-input v-model="row[column.javaField]" />
      </el-form-item>
    </template>
  </el-table-column>
  <!-- 无权限 -->
  <el-table-column :label="column.propName" :sortable="column.sortable==='1'?'custom':false" align="center" :prop="column.javaField" :width="column.width" v-else>
    <template #default="">
      ***
    </template>
  </el-table-column>
</template>

<script setup name="TableColumn">
import { toFixedDecimal } from '@/utils/erp.js'
import { checkPermi } from "@/utils/permission.js"
// import { getDicts } from '@/api/system/dict/data'
import { computed } from "vue";


const { proxy } = getCurrentInstance()

const props = defineProps({
  column: {
    type: Object,
    default: ()=>{},
  },
  detailField: {
    type: String,
    default: () => ''
  },
  rules: {
    type: Array,
    default: ()=>[],
  },
  isEdit: {
    type: Boolean,
    default: false,
  }
})
const emit = defineEmits(['handleDetail'])

const dictOptions = computed(()=>{
  if(props.column.dictType && props.column.dictType!='') {
    return proxy.useDict(props.column.dictType)[props.column.dictType].value
  }
})

const isReadonly = computed(()=>{
  return props.isEdit?(props.column.isReadonly==='0'?false:true):true;
})

const javaFields = computed(()=>{
  return props.column.javaField.split('.')
})
const isRequire = computed(()=>{
  return props.column.isRequired === '1' || false;
})
const hasSecurityPermission = computed(()=>{
  return props.column.securePermission?checkPermi(props.column.securePermission):true;
})
  
function handleDetail(row) {
  emit('handleDetail', row)
}

function formatter(row, col, cellValue, index) {
  let result = cellValue;
  if (!isNaN(Number(props.column.decimalPlaces)) && Number(props.column.decimalPlaces)>0 && !isNaN(Number(cellValue))) {
    result = toFixedDecimal(result, props.column.decimalPlaces);
  }
  return result;
}

// if(props.column.dictType && props.column.dictType!='') {
//   // getDicts(props.column.dictType).then(response => {
//   //   dictOptions.value = response.data.map(p => ({ 
//   //     label: p.dictLabel,
//   //     value: p.dictValue,
//   //     elTagType: p.listClass,
//   //     elTagClass: p.cssClass,
//   //     raw: p
//   //   }))
//   // });
// }
</script>

<style lang="scss" scoped>
  .el-select, .el-date-editor {
    width:100% !important;
  }
</style>
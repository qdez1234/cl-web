<template>
  <el-tabs v-model="orderActive" class="main-form">
    <el-tab-pane v-for="tabName in Object.keys(formFields)" :label="tabName" :name="tabName" :key="tabName">
      <el-row :gutter="5">
        <el-col v-for="field in formFields[tabName]" :key="field.propId"
          :xs="field.xs===0?1.5:field.xs"
          :sm="field.sm===0?1.5:field.sm"
          :md="field.md===0?1.5:field.md"
          :lg="field.lg===0?1.5:field.lg"
          :lx="field.xl===0?1.5:field.xl"
          :offset="field.offset"
          >
          <el-form-item :label="field.propName" :prop="field.javaField"              
            :rules="rules[field.javaField]?rules[field.javaField].concat([{ required: field.isRequired === '1' || false, message: `${field.propName}不能为空`, trigger: 'change' },]):[{ required: field.isRequired === '1' || false, message: `${field.propName}不能为空`, trigger: 'change' },]">
            <template v-if="field.htmlType!='autocomplete'">
              <Field v-model="form[field.javaField]" :column="field" v-if="field.javaField.split('.').length===1"/>
              <Field v-model="form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1)]" :column="field" v-else-if="field.javaField.split('.').length===2 && form[field.javaField.split('.').slice(0,1)]"/>
              <Field v-model="obj" :column="field" v-else-if="field.javaField.split('.').length===2 && !form[field.javaField.split('.').slice(0,1)]"/>
              <Field v-model="form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1,2)][field.javaField.split('.').slice(2)]" :column="field" v-else-if="field.javaField.split('.').length===3 && form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1,2)]"/>
              <Field v-model="obj" :column="field" v-else-if="field.javaField.split('.').length===3 && !form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1,2)]"/>
              <Field v-model="form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1,2)][field.javaField.split('.').slice(2,3)][field.javaField.split('.').slice(3)]" :column="field" v-else-if="field.javaField.split('.').length===4 && form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1,2)][field.javaField.split('.').slice(2,3)]"/>
              <Field v-model="obj" :column="field" v-else-if="field.javaField.split('.').length===4 && !form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1,2)][field.javaField.split('.').slice(2,3)]"/>
              <Field v-model="form[field.javaField]" :column="field" v-else/>
            </template>
            <template v-else>
              <ImportField
                v-if="isEdit"
                v-model="form[field.javaField]"
                :config="field.importConfig"
                :target="form"
                @import="handleImport"
              ></ImportField>
              <el-input :value="form[field.javaField][field.importDisplayField]" v-else-if="!isEdit && form[field.javaField]" readonly backgroundColor="disable" />
              <el-input value="" v-else readonly backgroundColor="disable" />
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup name="MainForm">
import ImportField from "@/components/ImportField"
import Field from "@/components/Field"
import { deepCopy } from "@/utils/erp.js"
import { computed } from "vue"

const props = defineProps({
  form: {
    type: Object,
    default: ()=>{}
  },
  formOptions: {
    type: Object,
    default: ()=>{}
  },
  isEdit: {
    type: Boolean,
    default: true
  },
  rules: {
    type: Object,
    default: ()=>{},
  }
})


const isFormFields = computed(()=>{
  let result = props.formOptions.formModelList.find(item=>{return item.modelType==='main'}).model.modelPropertiesList.filter(i=>{return i.isForm === '1'}).sort(function(a, b){ return a.sort-b.sort })
  return result
})

const categoryList = computed(()=>{
  let result = props.formOptions.formModelList.find(item=>{return item.modelType==='main'}).model.modelCategoryList.sort(function(a,b){return a.sort-b.sort})
  return result
})

const formFields = computed(()=>{
  let result = {}
  if (isFormFields.value) {
    categoryList.value.forEach(item=>{result[item.label] = []})
    isFormFields.value.forEach(field => {
      let label = '未分组'
      let category = categoryList.value.find(item=>{return item.categoryId===field.categoryId})
      if (category) {
        label = category.label
      }
      let temp = deepCopy(field)
      temp['id'] = field.propId
      temp['propName'] = field.propName
      temp['isReadonly'] = props.isEdit?field.isReadonly:'1'
      if (result[label]) {
        result[label].push(temp)
      } else {
        result[label] = [temp]
      }
    })
  }
  return result
})

const orderActive = ref("")
const obj = ref(undefined)

    
// 处理字段导入操作
function handleImport(item) {
  Object.keys(item).forEach(property => {
    props.form[property] = item[property]
  })
}

orderActive.value = categoryList.value[0].label
</script>

<style>

</style>
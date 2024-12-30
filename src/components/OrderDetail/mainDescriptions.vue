<template>
  <div class="main-descriptions">
    <el-descriptions v-for="tabName in Object.keys(formFields)" :key="tabName" class="margin-top" :title="tabName" :column="6" border>
      <el-descriptions-item v-for="field in formFields[tabName]" :key="field.propId">
        <template #label>
          <div class="cell-item">
            {{field.propName}}
          </div>
        </template>
        <template v-if="field.htmlType!='autocomplete'">
          <DescriptionsItem v-if="field.javaField.split('.').length===1" v-model="form[field.javaField]" :column="field" />
          <DescriptionsItem v-else-if="field.javaField.split('.').length===2 && form[field.javaField.split('.').slice(0,1)]" v-model="form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1)]" :column="field" />
          <DescriptionsItem v-else-if="field.javaField.split('.').length===3 && form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1,2)]" v-model="form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1,2)][field.javaField.split('.').slice(2)]" :column="field"/> 
          <DescriptionsItem v-else-if="field.javaField.split('.').length===4 && form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1,2)][field.javaField.split('.').slice(2,3)]" v-model="form[field.javaField.split('.').slice(0,1)][field.javaField.split('.').slice(1,2)][field.javaField.split('.').slice(2,3)][field.javaField.split('.').slice(3)]" :column="field"/> 
          <DescriptionsItem v-else v-model="form[field.javaField]" :column="field" />
        </template>
        <template v-else>
          obj
        </template>
      </el-descriptions-item>
      
    </el-descriptions>
  </div>
</template>

<script setup name="MainDescriptions">
import { deepCopy } from "@/utils/erp.js"
import { computed } from "vue"
import DescriptionsItem from "./descriptionsItem.vue"

const props = defineProps({
  form: {
    type: Object,
    default: ()=>{}
  },
  formOptions: {
    type: Object,
    default: ()=>{}
  },
})

const dictOptions = computed(()=>{
  if(props.column.dictType && props.column.dictType!='') {
    return proxy.useDict(props.column.dictType)[props.column.dictType].value
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

const orderActive = ref(categoryList.value[0].label)

</script>

<style lang="scss" scoped>
.main-descriptions {

  :deep(.el-descriptions__header) {
    margin-top: 8px;
    margin-bottom: 0px;
  }
}

</style>


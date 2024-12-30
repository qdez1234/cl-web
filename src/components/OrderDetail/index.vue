<template>
  <el-card shadow="never" ref="detailRef" style="margin-bottom: 12px;" class="detail-card">
    <el-form ref="orderForm" :model="form"  :inline="false" label-width="100px" label-position="right" class="">
      <!-- 标题区 -->
      <HeaderButton
        :buttons="buttons.header"
        :isEdit="isEdit"
        :title="title"
        v-model:showOrder="showOrder"
        :loading="loading"
        @onClickSubmit="handleSubmit"
        @onClickSubmitAdd="handleSubmitAdd"
        @onClickCopy="handleCopy">
        <template #headerButton>
          <slot name="headerButton"></slot>
        </template>
      </HeaderButton>
      <!-- 描述 -->
      <MainDescriptions :form="form" :formOptions="formOptions" v-if="!isEdit"></MainDescriptions>
      <!-- 表单区 -->
      <MainForm :form="form" :formOptions="formOptions" :isEdit="isEdit" :rules="rules" v-if="isEdit"></MainForm>
      <!-- 明细区 -->
      <el-tabs v-model="orderLineActive" class="detail-tabs" v-if="subModel.length>0">
        <el-tab-pane class="detail-tab-pane" v-for="formModel in subModel" :label="formModel.model.modelName" :name="formModel.model.className" :key="formModel.model.modelId">
          <DetailButton :buttons="buttons.detail[formModel.model.className]" :formModel="formModel" :importLine="importLine" :columns="columns[formModel.model.className]" :isEdit="isEdit" :loading="loading" @onClickAddLine="handleAddLine(formModel)" @onClickDeleteLine="handleDeleteLine(formModel)" @onClickFinishLine="handleFinishLine(formModel)" @onClickUnfinishLine="handleUnfinishLine(formModel)" @command="handleImportLine" @saveTableSetting="saveTableSetting(formModel)" @resetTableSetting="resetTableSetting(formModel)">
            <template #detailButton>
              <slot name="detailButton"></slot>
            </template>
          </DetailButton>
          <!-- 明细表 -->
          <div class="detail-table">
            <el-table
              v-loading="loading"
              class="detail-el-table"
              :data="form[formModel.javaField]"
              :row-class-name="rowOrderLineIndex"
              @selection-change="handleLineSelectionChange(formModel, $event)"
              @header-dragend="handleTableHeaderDragend"
              @sort-change="handleTableSort(formModel, $event)"
              :ref="formModel.model.className"
              height="100%"
              :show-summary="true"
              :summary-method="getSummaries"
              highlight-current-row
              @current-change="handleCurrentChange(formModel, $event)"
              border>
              <el-table-column type="selection" align="center" width="45" fixed="left"/>
              <el-table-column label="序号" align="center" prop="index" width="48"/>
              <TableColumn 
                v-for="column in visibleColumn[formModel.model.className]"
                :column="column"
                :detailField="formModel.javaField"
                :rules="rules[formModel.javaField]?rules[formModel.javaField][column.javaField]:{}"
                :key="column.key"
                :isEdit="isEdit" />
            </el-table>
          </div>
          
        </el-tab-pane>
      </el-tabs>
      <!-- 导入对话框 -->
    </el-form>
  </el-card>
  <ImportDialog v-if="importDailogVisible" v-model="importDailogVisible" :config="lineImportConfigKey" @handleLineImport="handleLineImport"></ImportDialog>
</template>

<script setup name="OrderDetail">
import TableColumn from "@/components/TableColumn"
import ImportDialog from "@/components/ImportDialog"
import DetailButton from "./detailButton.vue"
import HeaderButton from "./headerButton.vue"
import MainForm from "./mainForm.vue"
import MainDescriptions from "./mainDescriptions.vue"
import { genTableColumns, getTableSummary, getDefaultValue } from '@/utils/erp.js'
import { ElMessageBox } from 'element-plus'
import { computed } from "vue"
import cache from '@/plugins/cache.js'

const { proxy } = getCurrentInstance()

const props = defineProps({
  isShowDetail: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  formOptions: {
    type: Object,
    default: ()=>{},
  },
  buttons: {
    type: Object,
    default: ()=>{},
  },
  form: {
    type: Object,
    default: ()=>{},
  },
  operationType: {
    type: String,
    default: 'view',
  },
  rules: {
    type: Object,
    default: ()=>{},
  }
})

const emit = defineEmits(['update:isShowDetail', 'handleSubmit', 'handleSubmitAdd', 'handleCopy', 'handleFinishLine', 'handleUnfinishLine'])
const importDailogVisible = ref(false)
const orderLineActive = ref("")
const lineImportConfigKey = ref(undefined)
// 单选
const single = ref({})
// 多选
const multiple = ref({})
const columns = ref({})
const showOrder = computed({
  get() {
    return props.isShowDetail
  },
  set(value) {
    proxy.resetForm("orderForm")
    emit("update:isShowDetail", value)
  }
})
// 勾选的行
const checkedLines = ref({})

const isEdit = computed(()=>{
  return props.operationType === 'update' || props.operationType === 'add'
})
      
const billNoJavaField = computed(()=>{
  return props.formOptions.billNoJavaField
})
const formName = computed(()=>{
  return props.formOptions.formName
})
const title = computed(()=>{
  let tmp = ''
  if (props.formOptions && props.formOptions!=null && props.formOptions!={}) {
    switch (props.operationType) {
      case 'update': tmp="修改"+formName.value+"[" + props.form[billNoJavaField.value] + ']'
      break
      case 'add': tmp="新建"+formName.value
      break
      default: tmp="查看"+formName.value+"[" + props.form[billNoJavaField.value] + ']'
    }
  }
  return tmp
})

const visibleColumn = computed(()=>{
  let result = {}
  Object.keys(columns.value).forEach(i=>{
    result[i] = columns.value[i].filter((item) => item.visible)
  })
  return result
})

const mainModel = computed(()=>{
  if (props.formOptions.formModelList) {
    return props.formOptions.formModelList.find(item=>{return item.modelType==='main'})
  }
})

const mainModelPkJavaField = computed(()=>{
  let result = undefined
  if(mainModel.value.model.modelPropertiesList.find((item) => item.isPk==='1')) {
    result = mainModel.value.model.modelPropertiesList.find((item) => item.isPk==='1').javaField
  }
  return result
})


const subModel = computed(()=>{
  if (props.formOptions.formModelList) {
    return props.formOptions.formModelList.filter(item=>{return item.modelType==='sub'})
  }
})

const importLine = computed(()=>{
  if (props.formOptions.formImportList) {
    return props.formOptions.formImportList
  }
})

// watch(props.formOptions, value=>{
//   if (value.formModelList) {
//     console.log('@@@@@@@@@@ watch props.formOptions', value.formModelList.filter(item=>{return item.modelType==='sub'})[0].model.className)
//     orderLineActive.value = value.formModelList.filter(item=>{return item.modelType==='sub'})[0].model.className
//     subModel.value.forEach(({ model }) => {
//       if (!checkedLines.value[model.className]) {
//         checkedLines.value[model.className] = []
//       }
//       if (!single.value[model.className]) {
//         single.value[model.className] = true
//       }
//       if (!multiple.value[model.className]) {
//         multiple.value[model.className] = true
//       }
//       const localColumn = cache.local.getJSON('table-setting:'+proxy.$parent.$options.name+':'+model.className) || []
//       columns.value[model.className] = genTableColumns(localColumn, model.modelPropertiesList.filter(i=>{return i.isList === '1'}), isEdit.value)
//     })
//   }
// }, {deep: true, immediate: true})

watch(columns, value=>{
  if (value && subModel.value) {
    subModel.value.forEach(({ model }) => {
      cache.local.setJSON('table-setting:'+proxy.$parent.$options.name+':'+model.className, value[model.className])
    })
  }
}, {deep: true, immediate: true})
   
/** 重置页面 */
function reset() {
  checkedLines.value = {}
}
/** 保存按钮 */
function handleSubmit() {
  proxy.$refs["orderForm"].validate(valid => {
    if (valid) {
      emit('handleSubmit', props.form)
    }
  })
}
/** 保存并新增按钮 */
function handleSubmitAdd() {
  proxy.$refs["orderForm"].validate(valid => {
    if (valid) {
      emit('handleSubmitAdd', props.form)
    }
  })
}
/** 处理复制按键事件 */
function handleCopy() {
  proxy.$modal.confirm('确认复制当前单据？').then(() => {
    emit('handleCopy', props.form[mainModelPkJavaField.value])
  }).catch(()=>{})
}
/** 明细排序 */
function handleTableSort(formModel, column) {
  
}
/** 明细序号 */
function rowOrderLineIndex({ row, rowIndex }) {
  row.index = rowIndex + 1
  if(row.finishStatus && row.finishStatus != '0'){
    return 'finish_class'
  }
}
/** 明细复选框选中数据 */
function handleLineSelectionChange(formModel, selection) {
  let {model, javaField} = formModel
  checkedLines.value[model.className] = selection.map(item => item.index)
  single.value[model.className] = selection.length!==1
  multiple.value[model.className] = !selection.length
}
/** 明细添加按钮操作 */
function handleAddLine(formModel) {
  const {model, javaField} = formModel
  let obj = getDefaultValue(model.modelPropertiesList)
  if(props.form[javaField] && props.form[javaField]!=null) {
    props.form[javaField].push(obj)
  } else {
    props.form[javaField] = [obj]
  }
}
/** 明细删除按钮操作 */
function handleDeleteLine(formModel) {
  let {model, javaField} = formModel
  if (checkedLines.value[model.className].length == 0) {
    proxy.$modal.msgError(`请先选择要删除的${model.modelName}数据`)
  } else {
    proxy.$modal.confirm(`确认要删除选择的${model.modelName}数据`).then(() => {
      const lines = props.form[javaField]
      const tempCheckedLines = checkedLines.value[model.className]
      props.form[javaField] = lines.filter(function(item) {
        return tempCheckedLines.indexOf(item.index) == -1
      })
    }).then(() => {
      // proxy.$modal.msgSuccess("已删除")
    })
    .catch(() => {})
  }
}
/** 明细导入按钮操作 */
function handleImportLine(type) {
  lineImportConfigKey.value = type
  importDailogVisible.value = true
}
/** 处理结案按键事件 */
function handleFinishLine(formModel) {
  let {model, javaField} = formModel
  if (checkedLines.value[model.className].length == 0) {
    proxy.$modal.msgError(`请先选择要结案的${model.modelName}数据`)
  } else {
    proxy.$modal.confirm(`确认要结案选择的${model.modelName}数据`).then(() => {
      ElMessageBox.prompt('请输入结案原因', '系统提示', {inputPattern:/^.+$/, inputErrorMessage:'请输入结案原因', showClose:false}).then(({ value })=>{
        const lines = props.form[javaField]
        let finishIds = []
        let finishCause = value
        const ppk = model.modelPropertiesList.find(p=>{ return p.isPk==='1' })
        if (ppk) {
          checkedLines.value[model.className].forEach(index=>{ finishIds.push(lines.find(item=>{return item.index===index})[ppk.javaField])})
          // 结案接口
          emit('handleFinishLine', props.form[mainModelPkJavaField.value], finishIds, finishCause)
        }
        else {
          throw new Error(`模型:[${model.modelName}]没有配置主键字段，请检查模型设置！`)
        }
      }).catch((e) => {
        if (e != 'cancel') {
          proxy.$modal.msgError(e.message)
        }
      })
    }).catch(() => {})        
  }
}
/** 处理反结案按键事件 */
function handleUnfinishLine(formModel) {
  let {model, javaField} = formModel
  if (checkedLines.value[model.className].length == 0) {
    proxy.$modal.msgError(`请先选择要反结案的${model.modelName}数据`)
  } else {
    proxy.$modal.confirm(`确认要反结案选择的${model.modelName}数据`).then(() => {
      const lines = props.form[javaField]
      const unfinishIds = []
      const ppk = model.modelPropertiesList.find(p=>{ return p.isPk==='1' })
      if (ppk) {
        checkedLines.value[model.className].forEach(index=>{ unfinishIds.push(lines.find(item=>{return item.index===index})[ppk.javaField])})
        // 结案接口
        emit('handleUnfinishLine', props.form[mainModelPkJavaField.value], unfinishIds)
      }
      else {
        throw new Error(`模型:[${model.modelName}]没有配置主键字段，请检查模型设置！`)
      }
    }).catch((e) => {
      if (e != 'cancel') {
        proxy.$modal.msgError(e.message)
      }
    })
  }
}
// 处理单据级导操作
function handleLineImport(items, targetField) {
  props.form[targetField] = props.form[targetField].concat(items)
}
function handleTableHeaderDragend(newValue, oldValue, column, e) {
  const col = columns.value[orderLineActive.value].find(col => { return col.javaField === column.property })
  if (col) {
    col['width'] = newValue
  }
}
// handleClickRow(formModel, row) {
//   let { model } = formModel
//   proxy.$refs[model.className][0].toggleRowSelection(row)
// },
function handleCurrentChange(formModel, row) {
  // let { model } = formModel
  // proxy.$refs[model.className][0].toggleRowSelection(row)
}
function getSummaries(param) {
  return getTableSummary(columns.value[orderLineActive.value], param)
}
function saveTableSetting(formModel) {
  proxy.$tab.refreshPage()
}
function resetTableSetting(formModel) {
  let { model } = formModel
  cache.local.remove('table-setting:'+proxy.$parent.$options.name+':'+ model.className)
  proxy.$tab.refreshPage()
}

if (props.formOptions.formModelList) {
  orderLineActive.value = props.formOptions.formModelList.filter(item=>{return item.modelType==='sub'})[0].model.className
  subModel.value.forEach(({ model }) => {
    if (!checkedLines.value[model.className]) {
      checkedLines.value[model.className] = []
    }
    if (!single.value[model.className]) {
      single.value[model.className] = true
    }
    if (!multiple.value[model.className]) {
      multiple.value[model.className] = true
    }
    const localColumn = cache.local.getJSON('table-setting:'+proxy.$parent.$options.name+':'+model.className) || []
    columns.value[model.className] = genTableColumns(localColumn, model.modelPropertiesList.filter(i=>{return i.isList === '1'}), isEdit.value)
  })
}

reset()
</script>

<style lang="scss" scoped>
:deep(.el-button+.el-button) {
  margin-left: 0px;
}

.detail-card {
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: 0px !important;

  :deep(.el-card__body) {
    height: 0px;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;

    .el-form {
      height: 0px;
      flex: 1;
      display: flex;
      flex-flow: column nowrap;

      .header-button {
        flex: 0;
      }
      .main-form {
        flex: 0;
      }
      .detail-tabs {
        height: 0px;
        flex: 1;
        display: flex;
        flex-flow: column nowrap;

        .el-tabs__header {
          flex: 0;
        }
        
        .el-tabs__content {
          height: 0px;
          flex: 1;
          display: flex;
          flex-flow: column nowrap;

          .detail-tab-pane {
            height: 0px;
            flex: 1;
            display: flex;
            flex-flow: column nowrap;

            .detail-button {
              flex: 0;
            }

            .detail-table {
              flex: 1;
              position: relative;
            }
            .detail-el-table {
              flex: 1;
              position: absolute;
            }
          }
        }
      }
    }
  }


}

</style>

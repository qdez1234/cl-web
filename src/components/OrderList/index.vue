<template>
  <!-- 查询区 -->
  <query-form 
    ref="queryFormRef"
    :queryParams="queryParams"
    :showSearch="showSearch"
    :formOptions="formOptions"
    :advanced="advanced"
    @query="getList"
    @toggleAdvanced="toggleAdvanced">
  </query-form>
  <el-card shadow="never" class="main_box">
    <template #header>
      <!-- 功能按键区 -->
      <order-button 
        :buttons="buttons.main"
        :single="single"
        :multiple="multiple"
        :columns="columns"
        v-model:showSearch="showSearch"
        @onClickAdd="handleAdd"
        @onClickDelete="handleDelete"
        @onClickExport="handleExport"
        @onClickPrint="handlePrint"
        @onClickAudit="handleAudit"
        @onClickUnaudit="handleUnaudit"
        @onClickFinish="handleFinish"
        @onClickUnfinish="handleUnfinish"
        @saveTableSetting="saveTableSetting"
        @resetTableSetting="resetTableSetting"
        @queryTable="getList">
        <template #mainButton>
          <slot name="mainButton"></slot>
        </template>
      </order-button>
    </template>
    <!-- 表格区 -->
    <el-table
      stripe ref="mainTableRef"
      class="table-box"
      v-loading="loading"
      style="width: 100%" 
      height="100%"
      :data="orderList"
      :row-key="mainModelPkJavaField"
      @selection-change="handleSelectionChange"
      @header-dragend="handleTableHeaderDragend"
      @sort-change="handleTableSort"
      highlight-current-row
      @current-change="handleCurrentChange"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      border>
      <el-table-column type="selection" width="45" align="center" fixed="left"/>
      <table-column v-for="column in visibleColumn" :key="column.key" :column=column @handleDetail="handleDetail"/>
      <el-table-column label="操作" min-width="160" fixed="right" v-if="Object.keys(buttons.mainTableClomun).length>0">
        <template #default="scope">
          <table-column-button :buttons="buttons.mainTableClomun" :scope="scope" 
            @onClickView="handleView(scope.row)"
            @onClickUpdate="handleUpdate(scope.row)"
            @onClickDelte="handleDelete(scope.row)"
            @command="handleCommand(scope.row, $event)">
            <template #columnButton>
              <slot name="columnButton"></slot>
            </template>
            <template #columnMoreButton>
              <slot name="columnMoreButton"></slot>
            </template>
          </table-column-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <pagination
      class="pagination-box"
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-card>
</template>

<script setup name="OrderList">
import TableColumn from "@/components/TableColumn"
import QueryForm from "./queryForm.vue"
import TableColumnButton from "./tableColumnButton.vue"
import OrderButton from "./orderButton.vue"
import cache from '@/plugins/cache.js'
import { checkPermi } from "@/utils/permission.js"
import { ElMessageBox } from 'element-plus'
import { parseOrderBy, genTableColumns, getQueryDefaultValue } from '@/utils/erp.js'
import { ref, watch ,computed } from "vue";

const { proxy } = getCurrentInstance()

const props = defineProps({
  formOptions: {
    type: Object,
    default: undefined,
  },
  buttons: {
    type: Object,
    default: {},
  },
  orderList: {
    type: Array,
    default: []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: true,
  },
  queryParams: {
    type: Object,
    default: {
      pageNum: 1,
      pageSize: 10
    }
  }
})

const emit = defineEmits([
  'handleQuery',
  'handleAdd',
  'handleView',
  'handleUpdate',
  'handleDelete',
  'handleExport',
  'handleAudit',
  'handleUnaudit',
  'handleFinish',
  'handleUnfinish',
  'handlePrint',
  'handleCopy',
])


// 显示搜索条件
const showSearch = ref(true)
// 非单个禁用
const single = ref(true)
// 非多个禁用
const multiple = ref(true)
// 选中数组
const ids = ref([])
// 日期范围
const dateRange = ref([])
// 列信息
const columns = ref([])
// 选中行
const currentRow = ref(undefined)
const advanced = ref(false)

const visibleColumn = computed(()=>{
  return columns.value.filter((item) => item.visible).sort(function(a,b){return a.sort-b.sort})
})
const mainModel = computed(()=>{
  if (props.formOptions.formModelList) {
    return props.formOptions.formModelList.find(item=>{return item.modelType==='main'})
  }
})
// const subModel = computed(()=>{
//   if (props.formOptions.formModelList) {
//     return props.formOptions.formModelList.filter(item=>{return item.modelType==='sub'})
//   }
// })
const mainModelPkJavaField = computed(()=>{
  let result = undefined
  if(mainModel.value.model.modelPropertiesList.find((item) => item.isPk==='1')) {
    result = mainModel.value.model.modelPropertiesList.find((item) => item.isPk==='1').javaField
  }
  return result
})
const printPermi = computed(()=>{
  if (props.buttons.main.printAndView && props.buttons.main.printAndView.print.permi && props.buttons.main.printAndView.print.permi!=null && props.buttons.main.printAndView.print.permi.length>0) {
    return props.buttons.main.printAndView.print.permi
  }
  return ['*:*:*']
})
watch(columns, value=>{
  cache.local.setJSON('table-setting:'+proxy.$parent.$options.name+':'+mainModel.value.model.className, value)
},{deep:true})

/** 展开按钮操作 */
function toggleAdvanced() {
  advanced.value = !advanced.value
}

/** 处理查询*/
function getList() {
  emit('handleQuery')
}
/** 新增按钮事件 */
function handleAdd() {
  emit('handleAdd')
}

/** 查看按钮事件 */
function handleView(row) {
  const pk = row[mainModelPkJavaField.value]
  emit('handleView', pk)
}

/** 修改按钮事件 */
function handleUpdate(row) {
  const pk = row[mainModelPkJavaField.value] || ids.value
  emit('handleUpdate', pk)
}

/** 点击超链接 */
function handleDetail(row) {
  if(row.audited === '1') {
    handleView(row)
  } else {
    handleUpdate(row)
  }
}

/** 删除按钮事件 */
function handleDelete(row) {
  const deleteIds = row[mainModelPkJavaField.value] || ids.value
  proxy.$modal.confirm('是否确认删除ID号为"' + deleteIds + '"的数据项？').then(()=>{
    emit('handleDelete', deleteIds, (result)=>{
      result.then(() => {
        getList()
        proxy.$modal.msgSuccess("删除成功")
      })
    })
  }).catch(() => {})
}

/** 导出按钮事件 */
function handleExport() {
  emit('handleExport')
}

/** 审核按钮事件 */
function handleAudit(row) {
  let auditId = row[mainModelPkJavaField.value] || ids.value[0]
  proxy.$modal.confirm('是否确认审核ID号为"' + auditId + '"的数据项？').then(() => {
    emit('handleAudit', auditId, (result)=>{
      result.then(() => {
        proxy.$modal.msgSuccess("审核成功")
        getList()
      })
    })
  }).catch(() => {})
}

/** 反审按钮事件 */
function handleUnaudit(row) {
  let unauditId = row[mainModelPkJavaField.value] || ids.value[0]
  return proxy.$modal.confirm('是否确认反审核ID号为"' + unauditId + '"的数据项？').then(()=> {
    emit('handleUnaudit', unauditId, (result)=>{
      result.then(() => {
        proxy.$modal.msgSuccess("反审核成功")
        getList()
      })
    })
  }).catch(() => {})
}

/** 结案按钮事件 */
function handleFinish(row) {
  let finishId = row[mainModelPkJavaField.value] || ids.value[0]
  return proxy.$modal.confirm('是否结案ID号为"' + finishId + '"的采购订单？').then(()=> {
    ElMessageBox.prompt('请输入结案原因', '系统提示', {inputPattern:/^.+$/, inputErrorMessage:'请输入结案原因'}).then(({ value }) => {
      emit('handleFinish', finishId, value, (result)=>{
        result.then(() => {
          proxy.$modal.msgSuccess("结案成功")
          getList()
        })
      })
    }).catch(()=>{})
  }).catch(()=>{})
}

/** 反结案按钮事件 */
function handleUnfinish(row) {
  let unfinishId = row[mainModelPkJavaField.value] || ids.value[0]
  return proxy.$modal.confirm('是否反结案ID号为"' + unfinishId + '"的采购订单？').then(()=> {
    emit('handleUnfinish', unfinishId, (result)=>{
      result.then(() => {
        proxy.$modal.msgSuccess("反结案成功")
        getList()
      })
    })
  }).catch(() => {})
}

/** 打印按钮事件 */
function handlePrint(row) {
  let printType = 'V';
  const pk = row[mainModelPkJavaField.value] || ids.value[0];
  if (props.formOptions.printType === '1') {
    if (props.orderList.find(i=>{ return i[mainModelPkJavaField.value]===pk} ).audited === '1' && checkPermi(printPermi.value)){
      printType = 'P';
    }
  } else {
    if (checkPermi(printPermi.value)) {
      printType = 'P';
    }
  }
  emit('handlePrint', printType, pk);
}
/** 复制按钮事件 */
function handleCopy(row) {
  const pk = row[mainModelPkJavaField.value] || ids.value[0];
  proxy.$modal.confirm('确认复制当前单据？').then(() => {
    emit('handleCopy', pk)
  }).catch(()=>{})
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item[mainModelPkJavaField.value])
  single.value = selection.length!==1
  multiple.value = !selection.length
}
// 更多操作触发
function handleCommand(row, command) {
  switch (command) {
    case "handleAudit":
      handleAudit(row)
      break
    case "handleUnaudit":
      handleUnaudit(row)
      break
    case "handleFinish":
      handleFinish(row)
      break
    case "handleUnfinish":
      handleUnfinish(row)
      break
    case "handlePrint":
      handlePrint(row)
      break
    case "handleCopy":
      handleCopy(row)
      break
    default:
      break
  }
}
function handleTableHeaderDragend(newValue, oldValue, column, e) {
  const c = columns.value.find(col => {
    return col.javaField === column.property
  })
  if (c) {
    c.width = newValue
  }
}
function handleTableSort(column) {
  props.queryParams['orderByColumn'] = column.prop
  props.queryParams['isAsc'] = parseOrderBy(column.order)
  getList()
}
function handleCurrentChange(val) {
  currentRow.value = val
}
function saveTableSetting() {
  proxy.$tab.refreshPage()
}
function resetTableSetting() {
  cache.local.remove('table-setting:'+proxy.$parent.$options.name+':'+mainModel.value.model.className)
  proxy.$tab.refreshPage()
}
function rowStyle({row, rowIndex}) {
  // console.log("row-style", row, rowIndex)
  // let result
  // if (this.currentRow && row[mainModelPkJavaField.value]==this.currentRow[mainModelPkJavaField.value]) {
  //   console.log("current",row, this.currentRow)
  //   result = {'background-color': 'rgba(0, 0, 0, 0.8)', 'color': '#FFFFFF'}
  // } else {
  //   console.log("normal")
  //   result = {'background-color': 'rgba(19, 206, 102, 0.8)', 'color': '#FFFFFF'}
  // }
  // return result
}
function cellStyle({row, column, rowIndex, columnIndex}) {
  // console.log("cell-style", row, column, rowIndex, columnIndex)
}

const localColumn = cache.local.getJSON('table-setting:'+proxy.$parent.$options.name+':'+mainModel.value.model.className) || []
columns.value = genTableColumns(localColumn, mainModel.value.model.modelPropertiesList.filter(i=>{return i.isList === '1'}))
const queryDefaultValue = getQueryDefaultValue(props.queryParams, props.formOptions.formModelList)
// Object.keys(queryDefaultValue).forEach(item=>{
//   props.queryParams[item] = queryDefaultValue[item]
// })
Object.assign(props.queryParams, queryDefaultValue)
getList()
</script>

<style lang="scss" scoped>
 :deep(.el-table .cell) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .search_card {
    flex: 0;
  }
  .main_box {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    :deep(.el-card__header) {
      flex: 0;
    }
    :deep(.el-card__body) {
      height: 0px;
      flex: 1;
      display: flex;
      flex-flow: column nowrap;

      .table-box {
        flex: 1;
      }
        
      .pagination-box {
        flex: 0;
        // background-color: aqua;
        // padding: 0 !important;
      }
    }
  }
</style>

<template>
  <b-dialog v-model:visble="visible" v-model:fullscreen="fullscreen" :title="title">
    <template #dialog-body>
      <div class="import-dialog">
        <el-form class="import-query" :model="params" :rules="rules" :inline="false">
          <el-row>
            <el-col :span="18">
              <el-row :gutter="20">
                <el-col :span="8" v-for="(column, index) in queryFields" :key="index">
                  <el-form-item :label="column.propName" :prop="column.javaField">
                    <QueryField v-model="params[column.javaField]" :column="column" @query="handleQuery" /> 
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-form-item style="float: right">
                <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
                <el-button size="small" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table 
          class="import-table"
          :data="dataList" 
          @selection-change="handleTableSelectChange" 
          ref="tableRef" 
          height="100%" 
          :row-key="primaryKey"
          v-loading="loading"
          border>
          <el-table-column type="selection" reserve-selection align="center" width="45"/>
          <TableColumn :column="field" v-for="(field, index) in tableFields" :key="index"/>
        </el-table>

        <pagination
          class="import-pagination"
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </template>
    <template #dialog-footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleImport">导 入</el-button>
        <el-button @click="dialogClose">取 消</el-button>
      </div>
    </template>
  </b-dialog>
</template>

<script setup name="ImportDialog">
import BDialog from "@/components/BDialog"
import QueryField from "./QueryField"
import TableColumn from "./TableColumn"
import request from '@/utils/request'

const { proxy } = getCurrentInstance()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: () => false
  },
  options: {
    type: Object,
    default: {
      api: "",
      columns: [],
      title: "",
    }
  },
})
const emit = defineEmits(['update:modelValue', 'import'])

// 遮罩层
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const fullscreen = ref(false)
// 查询条件
const queryFields = computed(() => {
  return props.options?.columns.filter(item => item.isQuery)
})
// 列表栏位
const tableFields = computed(() => {
  return props.options?.columns.filter(item => item.isShow)
})
// 数据接口
const api = computed(() => {
  return props.options.api || undefined
})
// 显示标题
const title = computed(() => {
  return props.options.title
})
const primaryKey = computed(() => {
  return props.options.columns.find(item=>item.isPk=='1')?.javaField ||  'id'
})
// 选中的导入数据
const checkedLines = ref([])
// 导入列表
const dataList = ref([])
// 导入列表条目数
const total = ref(0)
// 遮罩层
const loading = ref(false)
// 导入列表查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  params: {
  }
})
const params = ref({})
// 表单校验规则
const rules = ref({})
const tableRef = ref()

//弹窗关闭事件
const dialogClose = () => {
  tableRef.value.clearSelection()
  visible.value = false
}
/** 导入表格复选框选中数据 */
const handleTableSelectChange = (selection) => {
  checkedLines.value = selection
}
/** 获取导入列表数据 */
const getList = () => {
  loading.value = true
  queryParams.value.params = params.value
  request({url: api.value, method: 'get', params: queryParams.value }).then(response => {
    dataList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}
/** 处理查询事件 */
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}
/** 处理导入事件 */
const handleImport = () => {
  emit('import', checkedLines.value)
  dialogClose()
}
/** 导入对话框查询重置 */
const resetQuery = () => {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
  }
  params.value = {}
  getList()
}
// 重置导入对话框
const resetDialog = () => {
  checkedLines.value = []
  dataList.value = []
  total.value = 0
  loading.value = false
  resetQuery()
}

onMounted(() => {
  resetDialog()
  nextTick(() => {
    tableRef.value.clearSelection()
  })
})

</script>

<style scoped lang="scss">
:deep(.el-table .cell) {
  white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.import-dialog {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.import-query {
  flex: 0;
}
.import-table {
  flex: 1;
}
.import-pagination {
  flex: 0;
}
.el-button+.el-button {
  margin-left: 12px !important;
}
</style>
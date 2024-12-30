<template>
  <b-dialog v-model:visble="visible" v-if="visible" v-model:fullscreen="fullscreen" :title="title">
    <template #dialog-body>
      <el-card class="modify-log-card" v-for="(item, index) in modifyLogList" :key="index">
        <template #header>
          <div class="card-header">
            <span style="margin-right: 9px;">{{ `${getFullDeptLabel(item.user.deptId)}` }}</span>
            <span>{{ `${item.user.nickName}(${item.user.userName})` }}</span>
            <el-divider direction="vertical" />
            <!-- <span>{{ `${modifyType[item.modifyType]}` }}</span> -->
            <dict-tag style="display: inline-block;" :options="core_modify_type" :value="item.modifyType"/>
            <el-divider direction="vertical" />
            <span>{{ `${item.createTime}` }}</span>
            <el-divider direction="vertical" />
            <span>{{ `IP: ${item.ip}` }}</span>
          </div>
        </template>
        <div v-for="(field, i) in item.modifyJson.main" :key="i">
          <span>{{ `${i+1}. [${field.fieldName}] 由 "` }}</span>
          <span style="color: #EE0000;">{{ `${field.oldValue}`}}</span>
          <span>{{ `" 改为 "` }}</span>
          <span style="color: #EE0000;">{{ `${field.newValue}` }}</span>
          <span>{{ `"` }}</span>
        </div>
        <div v-for="(detail, j) in item.modifyJson.detail" :key="j" >
          <el-table v-if="detail.line.length>0"
            :ref="`detailTable-${j}`"
            :data="detail.line"
            width="100%">
            <el-table-column
              v-for="(column, k) in Object.keys(detail.line[0])"
              :key="k"
              :prop="column"
              :label="column"
              :show-overflow-tooltip="true"
            />
          </el-table>
        </div>
      </el-card>
    </template>
    <template #dialog-footer>
      <div class="dialog-footer">
        <el-button @click="cancel">返 回</el-button>
      </div>
    </template>
  </b-dialog> 
</template>

<script setup name="ModifyLogDialog">
import { listModifyLogOptions, listDeptOptions } from "@/api/system/modifyLog"
import BDialog from "@/components/BDialog"

const { proxy } = getCurrentInstance()

const { core_modify_type } = proxy.useDict('core_modify_type');

const emit = defineEmits(['update:modelValue'])

const loading = ref(true)
const fullscreen = ref(false)
const deptOptions = ref([])

const props = defineProps({
  className: {
    type: String,
    default: ()=>'',
  },
  primaryKey: {
    type: [Number, String],
    default: undefined
  }
})

// 遮罩层
const visible = ref(false)
const title = ref("修改日志")


const queryParams = ref({
  pageNum: 1,
  pageSize: 1000,
  params: {
    className: null,
    primaryKey: null,
  },
  orderByColumn:"createTime",
  isAsc: "desc"
})

const modifyLogList = ref([])
const total = ref(0)


/** 查询修改日志列表 */
function getList() {
  loading.value = true;
  queryParams.value.params.className = props.className
  queryParams.value.params.primaryKey = props.primaryKey
  listModifyLogOptions(queryParams.value).then(response => {
    modifyLogList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

function cancel() {
  visible.value = false
}

function getDeptOption() {
  listDeptOptions().then(response => {
    deptOptions.value = response.data;
  });
}

function getFullDeptLabel(deptId) {
  let dept = deptOptions.value.find(item => item.deptId==deptId)
  let result = ""
  if (dept) {
    result = dept.deptName
    if (dept.parentId != 0 && deptOptions.value.find(item => item.deptId==dept.parentId)) {
      result =  getFullDeptLabel(dept.parentId) + ' / ' + result
    }
  }
  return result
}

function dialogOpen() {
  getList()
  getDeptOption()
  visible.value = true
}

defineExpose({
  dialogOpen
})


</script>

<style lang="scss" scoped>
.modify-log-card {
  font-size: 14px;
  margin: 12px;
  :deep(.el-card__body) {
    margin: 8px;
    
  }
  :deep(.el-table) {
    padding-top: 10px;
  }
}

</style>